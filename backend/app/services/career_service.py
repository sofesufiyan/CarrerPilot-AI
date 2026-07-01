from app.agents.orchestrator import prepare_prompt
from app.agents.resume_agent import ResumeAgent
from app.tools.gemini_tool import ask_gemini
from app.tools.agent_logger import add, clear
import concurrent.futures


# -------------------------------------
# Career Advice
# -------------------------------------
def get_career_advice(question: str) -> str:
    clear()

    add("📥 User Question Received")

    prompt = prepare_prompt(question)

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:

            add("🚀 Sending Prompt to Gemini")

            future = executor.submit(
                ask_gemini,
                prompt,
            )

            response = future.result(timeout=20)

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
# Resume Review
# -------------------------------------
def review_resume(resume_text: str):

    clear()

    add("📄 Resume Uploaded")

    agent = ResumeAgent()

    add("🧠 Resume Agent Started")

    # Resume Engine Analysis
    analysis = agent.analyze(resume_text)

    # Gemini Prompt
    prompt, _ = agent.build_prompt(resume_text)

    try:

        with concurrent.futures.ThreadPoolExecutor() as executor:

            add("🚀 Sending Resume Analysis to Gemini")

            future = executor.submit(
                ask_gemini,
                prompt,
            )

            ai_response = future.result(timeout=20)

            add("✅ Resume Review Completed")

        return {
            "resume_score": analysis["resume_score"],
            "ats_score": analysis["ats_score"],
            "technical_skills": analysis["technical_skills"],
            "soft_skills": analysis["soft_skills"],
            "strengths": analysis["strengths"],
            "weaknesses": analysis["weaknesses"],
            "missing_skills": analysis["missing_skills"],
            "suggestions": analysis["suggestions"],
            "ai_explanation": ai_response,
        }

    except concurrent.futures.TimeoutError:

        return {
            "error": "Resume analysis timed out."
        }

    except Exception as e:

        error = str(e)

        if "429" in error or "RESOURCE_EXHAUSTED" in error:

            return {
                "error": "Gemini API quota exceeded."
            }

        return {
            "error": error
        }