import concurrent.futures
import json
import logging
import uuid
import re
from datetime import datetime
from typing import Dict, Any

from app.agents.orchestrator import prepare_prompt
from app.agents.resume_agent import ResumeAgent
from app.tools.gemini_tool import ask_gemini_text, ask_gemini_json
from app.tools.agent_logger import add, clear
from app.db.database import save_resume_analysis, get_resume_history

logger = logging.getLogger("uvicorn.error")

# Named constants for timeout limits
GEMINI_TIMEOUT_SECONDS = 20

# -------------------------------------
# Career Advice
# -------------------------------------
def should_inject_resume_context(question: str) -> bool:
    """
    Classifies user intent to determine if resume context is relevant.
    """
    keywords = [r'\bresume\b', r'\bcv\b', r'\bats\b', r'\bprofile\b', 
                r'\bportfolio\b', r'\bprojects?\b', r'\bexperience\b', r'\bbackground\b']
    pattern = re.compile('|'.join(keywords), re.IGNORECASE)
    return bool(pattern.search(question))

def get_career_advice(question: str, uid: str = None) -> str:
    clear()
    add("📥 User Question Received")
    
    resume_context = ""
    if uid and should_inject_resume_context(question):
        add("🔍 Resume context intent detected.")
        try:
            history = get_resume_history(uid)
            if history:
                latest = history[0]
                data = latest.get("data", {})
                resume_score = latest.get("resume_score", 0)
                ats_score = latest.get("ats_score", 0)
                skills = data.get("technical_skills", []) + data.get("soft_skills", [])
                projects = [p.get("title", "") for p in data.get("recommended_projects", [])]
                
                resume_context = f"\n\n[USER CONTEXT]\nResume Score: {resume_score}%\nATS Score: {ats_score}%\nSkills: {', '.join(skills[:5])}\nProjects: {', '.join(projects[:2])}\n[/USER CONTEXT]"
        except Exception as e:
            logger.error(f"Failed to fetch user context for career advice: {e}")

    prompt = prepare_prompt(question) + resume_context

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            add("🚀 Sending Prompt to Gemini")
            future = executor.submit(
                ask_gemini_text,
                prompt,
            )
            response = future.result(timeout=GEMINI_TIMEOUT_SECONDS)
            add("✅ Career Response Generated")
        return response

    except concurrent.futures.TimeoutError:
        return (
            "⏳ CareerPilot AI is taking longer than expected.\n\n"
            "Please try again in a few moments."
        )
    except Exception as e:
        error = str(e)
        if "429" in error or "RESOURCE_EXHAUSTED" in error:
            return (
                "⚠️ Gemini API quota exceeded.\n\n"
                "Please try again later."
            )
        return f"⚠️ Error: {error}"


# -------------------------------------
# Helper: Parse Gemini Structured JSON
# -------------------------------------
def parse_gemini_json(ai_response: str) -> dict:
    """
    Cleans and parses structured JSON output from Gemini.
    Removes markdown code block formatting (```json) if present.
    """
    cleaned = ai_response.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except Exception as e:
        logger.error(f"Failed to parse Gemini response as JSON: {e}. Raw response: {ai_response}")
        return {}


# -------------------------------------
# Resume Review
# -------------------------------------
def review_resume(resume_text: str, uid: str, filename: str = "resume.pdf") -> Dict[str, Any]:
    """
    Executes the Resume Intelligence Engine analysis.
    
    Runs local heuristics, attempts to retrieve Gemini structured recommendations,
    handles API service outages/timeouts gracefully by falling back to local scores,
    and persists the final structured review in the database.
    """
    clear()
    add("📄 Resume Uploaded")

    agent = ResumeAgent()
    add("🧠 Resume Agent Started")

    # Local parsing metrics extraction (skills, scores, strengths, weaknesses)
    analysis = agent.analyze(resume_text)

    # Build prompt requesting structured output
    prompt, _ = agent.build_prompt(resume_text)

    ai_response = None
    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            add("🚀 Sending Resume Analysis to Gemini")
            future = executor.submit(
                ask_gemini_json,
                prompt,
            )
            # Fetch response with a strict timeout limit
            res = future.result(timeout=GEMINI_TIMEOUT_SECONDS)
            
            ai_response = res
            add("✅ Resume Review Completed")
            
    except (concurrent.futures.TimeoutError, ValueError) as ge:
        # Catch only Gemini-related exceptions (timeouts or busy responses)
        logger.error(f"Gemini API failure or timeout: {ge}")
        add("⚠️ Gemini API currently busy or unavailable - falling back to local analysis")
        ai_response = None

    # Handle structured object extraction and fallback logic
    if ai_response is None:
        add("📊 Returning Local Resume Analysis")
        ai_explanation = "AI analysis is temporarily unavailable. Showing local resume analysis."
        confidence_score = 0
        roadmap = []
        recommended_roles = []
        recommended_certifications = []
        learning_resources = []
        recommended_projects = []
    else:
        parsed_data = ai_response
        
        ai_explanation = parsed_data.get("ai_explanation")
        if not ai_explanation:
            ai_explanation = "AI analysis completed."

        # Format and normalize parsed values (limit roadmap to 6 steps)
        roadmap = parsed_data.get("roadmap", [])
        if len(roadmap) > 6:
            roadmap = roadmap[:6]

        confidence_score = parsed_data.get("confidence_score", 90)
        recommended_roles = parsed_data.get("recommended_roles", [])
        recommended_certifications = parsed_data.get("recommended_certifications", [])
        learning_resources = parsed_data.get("learning_resources", [])
        recommended_projects = parsed_data.get("recommended_projects", [])
        
    # Generate timestamps and record identifiers
    analysis_id = str(uuid.uuid4())
    generated_at = datetime.utcnow().isoformat()

    # Assemble unified response object (maintaining API compatibility)
    response_data = {
        "id": analysis_id,
        "filename": filename,
        "resume_score": analysis["resume_score"],
        "ats_score": analysis["ats_score"],
        "technical_skills": analysis["technical_skills"],
        "soft_skills": analysis["soft_skills"],
        "strengths": analysis["strengths"],
        "weaknesses": analysis["weaknesses"],
        "missing_skills": analysis["missing_skills"],
        "suggestions": analysis["suggestions"],
        "ai_explanation": ai_explanation,
        "confidence_score": confidence_score,
        "generated_at": generated_at,
        "roadmap": roadmap,
        "recommended_roles": recommended_roles,
        "recommended_certifications": recommended_certifications,
        "learning_resources": learning_resources,
        "recommended_projects": recommended_projects,
    }

    # Save the local analysis or AI analysis into SQLite
    try:
        save_resume_analysis(
            uid=uid,
            filename=filename,
            resume_score=analysis["resume_score"],
            ats_score=analysis["ats_score"],
            resume_text=resume_text,
            data=response_data,
            analysis_id=analysis_id
        )
        add("💾 Analysis Saved to Database")
    except Exception as dbe:
        logger.error(f"Database error saving resume review: {dbe}")
        add(f"⚠️ Database Save Failure: {dbe}")

    return response_data