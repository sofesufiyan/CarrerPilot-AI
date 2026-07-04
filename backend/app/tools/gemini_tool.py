from google import genai
import time
import logging
import traceback
import json
import re
from typing import Dict, Any

from app.core.config import GEMINI_API_KEY
from app.tools.agent_logger import add

logger = logging.getLogger("uvicorn.error")

def detect_intent(question: str) -> str:
    """Classifies the specific intent of the user's question."""
    q = question.lower()
    
    # Priority 1: Core career features (most specific user requests)
    if any(x in q for x in ["resume", "cv", "ats", "system", "score"]):
        # Sub-classify
        if "ats" in q or "system" in q or "score" in q:
            return "ATS"
        return "RESUME"
        
    if any(x in q for x in ["interview", "prep"]):
        return "INTERVIEW"
        
    if any(x in q for x in ["project", "portfolio"]):
        return "PORTFOLIO"
        
    # Priority 2: Specific domain fields (check this before general 'learn' word)
    if any(x in q for x in ["ai engineer", "deep learning", "machine learning", "data science"]):
        return "AI_ML_ADVICE"
        
    # Check roadmap with word boundaries for 'learn'
    if any(x in q for x in ["roadmap", "plan", "certifications"]) or re.search(r'\blearn\b', q):
        return "ROADMAP"
        
    return "GENERAL_CAREER"

def generate_local_mentor(prompt: str) -> str:
    """Generates a conversational local response using extracted context."""
    prompt_lower = prompt.lower()
    
    # Debug logs as requested
    logger.info("=== LOCAL MENTOR DEBUG ===")
    
    # Extract the actual student question from the orchestrator prompt
    question_match = re.search(r'Student Question:\s*(.*?)(?=\n\[USER CONTEXT\]|\Z)', prompt, re.DOTALL | re.IGNORECASE)
    user_question = question_match.group(1).lower().strip() if question_match else prompt_lower
    
    detected_intent = detect_intent(user_question)
    
    logger.info(f"User prompt: {user_question}")
    logger.info(f"Detected intent: {detected_intent}")
    
    # Extract context if appended
    resume_score, ats_score, skills, projects = "N/A", "N/A", "various skills", "some projects"
    context_match = re.search(r'\[USER CONTEXT\](.*?)\[\/USER CONTEXT\]', prompt, re.DOTALL)
    if context_match:
        logger.info("Whether Resume Context was injected: YES")
        context_str = context_match.group(1)
        rs_match = re.search(r'Resume Score:\s*(\d+%)', context_str)
        ats_match = re.search(r'ATS Score:\s*(\d+%)', context_str)
        sk_match = re.search(r'Skills:\s*(.+?)\n', context_str)
        pj_match = re.search(r'Projects:\s*(.+?)\n', context_str)
        
        if rs_match: resume_score = rs_match.group(1)
        if ats_match: ats_score = ats_match.group(1)
        if sk_match and sk_match.group(1).strip(): skills = sk_match.group(1).strip()
        if pj_match and pj_match.group(1).strip(): projects = pj_match.group(1).strip()
    else:
        logger.info("Whether Resume Context was injected: NO")
    
    response = ""
    
    role_match = re.search(r'for an? ([\w\s]+? role)', user_question, re.IGNORECASE)
    target_role = role_match.group(1) if role_match else "your target role"
    
    if detected_intent == "RESUME":
        logger.info("Selected response generator: RESUME_FALLBACK")
        response += f"I noticed you're asking about your resume for {target_role}. Based on your recent scan, your overall resume score is {resume_score} and your ATS readability is {ats_score}. To push those numbers higher, try starting your bullet points with strong action verbs like 'Spearheaded' or 'Orchestrated' and quantify your impact with real metrics.\n\n"
        response += f"Since you have background with {skills.split(',')[0] if skills != 'various skills' else 'these technologies'}, make sure those keywords are naturally integrated into your experience section, not just listed at the bottom.\n\n"
        response += "**Next Step:** Pick your two most recent roles and rewrite one bullet point each to include a specific percentage or dollar amount."
    elif detected_intent == "ATS":
        logger.info("Selected response generator: ATS_FALLBACK")
        response += f"Let's talk about ATS optimization for {target_role}. Your current ATS score is {ats_score}. The best way to improve this is by keeping your formatting as standard as possible—avoid complex tables, multiple columns, or graphics that confuse the parsers.\n\n"
        response += f"It's also crucial to match the job description's keywords perfectly. Since your profile highlights {skills}, ensure those terms are placed exactly as they appear in the job listing you're targeting.\n\n"
        response += "**Next Step:** Convert your resume to a plain-text single-column format and test if all the text highlights properly when you select it."
    elif detected_intent == "INTERVIEW":
        logger.info("Selected response generator: INTERVIEW_FALLBACK")
        response += f"Interview preparation for {target_role} is all about structure and confidence. When discussing your experience—especially around {skills}—always use the STAR method (Situation, Task, Action, Result).\n\n"
        if projects != "some projects" and projects:
            response += f"You can actually use '{projects.split(',')[0]}' as a perfect talking point. Be ready to explain the architecture, the hardest bug you fixed, and what you learned from it.\n\n"
        response += "**Next Step:** Write down three behavioral questions and practice answering them out loud using the STAR framework."
    elif detected_intent == "ROADMAP":
        logger.info("Selected response generator: ROADMAP_FALLBACK")
        response += f"Building a strong career roadmap for {target_role} requires focusing on fundamentals before frameworks. Given your current skill set ({skills}), I recommend deepening your knowledge in system design and backend architecture.\n\n"
        response += "It's also highly beneficial to build in public. The more you can show real-world application, the better you'll stand out to recruiters.\n\n"
        response += "**Next Step:** Pick one core technology you want to master this month and commit to building a small, functional prototype with it."
    elif detected_intent == "PORTFOLIO":
        logger.info("Selected response generator: PORTFOLIO_FALLBACK")
        response += f"Portfolio projects are the best way to prove your capabilities for {target_role}. Based on your profile, building a full-stack dashboard or integrating a complex public API would be an excellent move.\n\n"
        if projects != "some projects" and projects:
            response += f"I see you were already recommended to build something like '{projects.split(',')[0]}'. That is a fantastic starting point. Make sure to include a thorough README and clean architecture.\n\n"
        response += "**Next Step:** Set up a fresh GitHub repository today and write a README outlining the features of your next project."
    elif detected_intent == "AI_ML_ADVICE":
        logger.info("Selected response generator: DOMAIN_SPECIFIC_FALLBACK")
        response += f"That's a great question about the AI/ML field! Transitioning into {target_role} requires a solid grasp of Python, calculus, linear algebra, and machine learning frameworks like PyTorch or TensorFlow.\n\n"
        response += "Rather than just following tutorials, the best way to learn is by taking a dataset from Kaggle and building an end-to-end pipeline, from data cleaning to model deployment.\n\n"
        response += "**Next Step:** Start by reviewing the core concepts of Neural Networks, and then implement a simple image classifier or text sentiment analyzer from scratch."
    else:
        logger.info("Selected response generator: GENERAL_FALLBACK")
        response += f"Navigating your career path towards {target_role} requires a mix of continuous learning and strong positioning. Since I am operating in offline fallback mode, I cannot give a highly customized answer to your specific technical question.\n\n"
        response += "However, no matter what technology or role you are pursuing, focusing on the fundamentals, building a public portfolio, and preparing thoroughly for behavioral interviews are universal keys to success.\n\n"
        response += "**Next Step:** Review your learning goals for this week and ensure they align with the job description of your target role."

    response += "\n\n---\n*Generated using CareerPilot AI Local Mentor because the cloud AI service is temporarily unavailable.*"
    return response


def generate_local_resume_analysis(prompt: str) -> dict:
    """Generates a fallback structured JSON (dict) for Resume Uploads."""
    return {
        "resume_score": 75,
        "ats_score": 72,
        "ai_explanation": "This is a local analysis. Your resume has a strong foundation, but can be improved with more quantifiable metrics and cleaner formatting for better ATS parsing.",
        "confidence_score": 0.8,
        "roadmap": [
            {"step": 1, "description": "Review and refine your bullet points to include specific outcomes (e.g. 'increased sales by 20%').", "status": "pending"},
            {"step": 2, "description": "Ensure your formatting is single-column and easily parsable.", "status": "pending"},
            {"step": 3, "description": "Update your LinkedIn profile to match your updated resume.", "status": "pending"},
            {"step": 4, "description": "Start a new portfolio project to demonstrate your latest skills.", "status": "pending"},
            {"step": 5, "description": "Practice mock interviews focusing on behavioral questions.", "status": "pending"},
            {"step": 6, "description": "Begin active networking and applying to targeted roles.", "status": "pending"}
        ],
        "recommended_roles": ["Software Engineer", "Data Analyst", "Product Manager"],
        "recommended_certifications": [
            {"name": "AWS Certified Cloud Practitioner", "url": "https://aws.amazon.com/certification/", "type": "Cloud"}
        ],
        "learning_resources": [
            {"title": "Harvard CS50", "url": "https://cs50.harvard.edu/", "type": "Course"}
        ],
        "recommended_projects": [
            {"title": "Full-Stack Dashboard", "description": "Build a comprehensive web dashboard with user authentication.", "tech_stack": ["React", "Node.js", "PostgreSQL"]}
        ]
    }


def generate_local_interview_feedback(prompt: str) -> dict:
    """Generates a fallback structured JSON (dict) for Interview Coach."""
    if "overall_feedback" in prompt:
        # Report Stage
        return {
            "overall_feedback": "You showed a solid understanding of fundamental concepts. To reach the next level, focus on structuring your answers more clearly using the STAR method.",
            "top_strengths": ["Clear communication", "Willingness to learn"],
            "key_weaknesses": ["Providing quantifiable metrics in answers", "Deep technical architecture specifics"],
            "improvement_plan": [
                "Practice answering behavioral questions with the STAR framework.",
                "Review system design principles for your target role.",
                "Do another mock interview focusing entirely on technical depth."
            ]
        }
    elif "feedback_strengths" in prompt:
        # Evaluate Stage
        is_last = "is_complete to true" in prompt
        return {
            "feedback_strengths": "Good effort attempting this question. You hit on some key themes.",
            "feedback_improvements": "Try to structure your answers using the STAR method (Situation, Task, Action, Result) for clarity.",
            "score": 7,
            "next_question": None if is_last else "Can you describe a challenging technical hurdle you recently overcame?",
            "is_complete": is_last
        }
    else:
        # Start Stage
        return {
            "question": "Could you tell me about yourself and your background?"
        }


def ask_gemini_text(prompt: str) -> str:
    """Requests plain conversational text from Gemini (used by Career Mentor)."""
    add("🤖 Gemini Tool Activated (Text Mode)")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    model_name = "gemini-2.5-flash"
    
    logger.info("== Gemini Text Request Initiated ==")
    logger.info(f"Prompt Length: {len(prompt)} characters")

    start_time = time.time()
    
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        elapsed = time.time() - start_time
        logger.info(f"✅ Gemini Text Request Successful | Elapsed Time: {elapsed:.2f}s")
        add("✅ Gemini Text Response Generated")

        return response.text

    except Exception as e:
        elapsed = time.time() - start_time
        logger.error(f"❌ Gemini Text API Error | Elapsed: {elapsed:.2f}s | Error: {str(e)}")
        
        add("⚠️ Cloud AI Unavailable. Using Local Mentor Fallback (Text).")
        logger.warning(f"Gemini failed. Instantly falling back to Local Mentor (Text).")
        
        return generate_local_mentor(prompt)


def ask_gemini_json(prompt: str) -> dict:
    """Requests structured JSON from Gemini (used by Resume & Interview)."""
    add("🤖 Gemini Tool Activated (JSON Mode)")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    model_name = "gemini-2.5-flash"
    
    # Enforce JSON prompt instruction automatically
    json_prompt = prompt + "\n\nIMPORTANT: Return ONLY a valid JSON object. Do NOT wrap in markdown block. Do NOT add any extra text."
    
    logger.info("== Gemini JSON Request Initiated ==")
    logger.info(f"Prompt Length: {len(json_prompt)} characters")

    start_time = time.time()
    
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=json_prompt
        )

        elapsed = time.time() - start_time
        logger.info(f"✅ Gemini JSON Request Successful | Elapsed Time: {elapsed:.2f}s")
        
        # Parse the response text as JSON
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        parsed_data = json.loads(clean_json)
        
        add("✅ Gemini JSON Response Generated")
        return parsed_data

    except Exception as e:
        elapsed = time.time() - start_time
        logger.error(f"❌ Gemini JSON API Error | Elapsed: {elapsed:.2f}s | Error: {str(e)}")
        
        # Determine which JSON fallback to use based on prompt heuristics
        if "resume_score" in prompt and "roadmap" in prompt:
            add("⚠️ Cloud AI Unavailable. Using Local Resume Fallback (JSON).")
            logger.warning("Gemini failed. Instantly falling back to Local Resume Analysis (JSON).")
            return generate_local_resume_analysis(prompt)
        else:
            add("⚠️ Cloud AI Unavailable. Using Local Interview Fallback (JSON).")
            logger.warning("Gemini failed. Instantly falling back to Local Interview Feedback (JSON).")
            return generate_local_interview_feedback(prompt)