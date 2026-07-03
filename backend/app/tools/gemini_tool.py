from google import genai
import time
import logging
import traceback

from app.core.config import GEMINI_API_KEY
from app.tools.agent_logger import add

logger = logging.getLogger("uvicorn.error")

def generate_local_fallback(prompt: str) -> str:
    """Generates a structured local response when cloud AI fails."""
    prompt_lower = prompt.lower()
    
    response = ""
    
    if "resume" in prompt_lower or "cv" in prompt_lower:
        response += "### Resume Improvement Guide\n"
        response += "- **Action Verbs**: Start every bullet point with strong action verbs (e.g., Developed, Orchestrated, Spearheaded).\n"
        response += "- **Quantify Results**: Include metrics where possible (e.g., 'Increased performance by 20%').\n"
        response += "- **Tailor Content**: Ensure your resume matches the keywords found in the job description.\n\n"
        
    if "ats" in prompt_lower or "system" in prompt_lower or "score" in prompt_lower:
        response += "### ATS Optimization\n"
        response += "- **Standard Formatting**: Avoid complex tables, columns, or graphics that confuse ATS parsers.\n"
        response += "- **Standard Headings**: Use clear headings like 'Work Experience', 'Education', and 'Skills'.\n"
        response += "- **Keywords**: Incorporate exact technical keywords from the job description naturally.\n\n"
        
    if "interview" in prompt_lower or "prep" in prompt_lower:
        response += "### Interview Preparation\n"
        response += "- **STAR Method**: Answer behavioral questions using Situation, Task, Action, Result.\n"
        response += "- **Technical Prep**: Review core data structures, algorithms, and system design principles relevant to your target role.\n"
        response += "- **Mock Interviews**: Practice answering questions out loud to build confidence.\n\n"
        
    if "roadmap" in prompt_lower or "plan" in prompt_lower or "learn" in prompt_lower or "certifications" in prompt_lower:
        response += "### Career Learning Roadmap & Resources\n"
        response += "1. **Master the Fundamentals**: Deep dive into the core languages and tools of your target stack.\n"
        response += "2. **Build Projects**: Apply your knowledge to real-world applications.\n"
        response += "3. **Version Control**: Become proficient with Git and GitHub.\n"
        response += "4. **Networking**: Connect with industry professionals and attend meetups.\n\n"
        
    if "project" in prompt_lower or "portfolio" in prompt_lower:
        response += "### Recommended Portfolio Projects\n"
        response += "- **Full-Stack Dashboard**: Build an application with authentication, database interactions, and a clean UI.\n"
        response += "- **API Integration**: Create a tool that pulls data from a public API and displays it meaningfully.\n"
        response += "- **Automation Script**: Solve a real problem using Python or Node.js automation.\n\n"
        
    if not response:
        response += "### Career Development Strategy\n"
        response += "- Focus on continuous learning and staying updated with industry trends.\n"
        response += "- Build a strong professional network and personal brand.\n"
        response += "- Work on practical projects to demonstrate your skills.\n"
        response += "- Optimize your resume and LinkedIn profile for your target roles.\n\n"

    response += "\n---\n*Generated using CareerPilot AI Local Mentor because the cloud AI service is temporarily unavailable.*"
    return response


def ask_gemini(prompt: str):
    add("🤖 Gemini Tool Activated")
    
    # Initialize the client INSIDE the function to ensure thread safety
    client = genai.Client(api_key=GEMINI_API_KEY)
    model_name = "gemini-2.5-flash"
    
    logger.info("== Gemini Request Initiated ==")
    logger.info(f"Prompt Length: {len(prompt)} characters")

    start_time = time.time()
    
    # 1. Try Gemini exactly ONCE
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        elapsed = time.time() - start_time
        logger.info(f"✅ Gemini Request Successful | Elapsed Time: {elapsed:.2f}s")
        add("✅ Gemini Response Generated")

        # 2. If Gemini succeeds, return the AI response
        return response.text

    except Exception as e:
        elapsed = time.time() - start_time
        error_msg = str(e)
        
        logger.error(f"❌ Gemini API Error | Elapsed: {elapsed:.2f}s")
        logger.error("Complete Exception Traceback:")
        logger.error(traceback.format_exc())
        
        # 3. If Gemini fails for ANY reason (429, Timeout, Network Error, etc.), 
        # immediately switch to local fallback engine
        add("⚠️ Cloud AI Unavailable. Using Local Mentor Fallback.")
        logger.warning(f"Gemini failed ({error_msg}). Instantly falling back to local engine.")
        
        return generate_local_fallback(prompt)