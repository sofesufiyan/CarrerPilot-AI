from app.agents.orchestrator import prepare_prompt
from app.router.router import get_system_prompt
from app.tools.gemini_tool import ask_gemini
from app.tools.agent_logger import add, clear
import concurrent.futures


def get_career_advice(question: str) -> str:
    clear()

    add("📥 User Question Received")

    prompt = prepare_prompt(question)

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:

            add("🚀 Sending Prompt to Gemini Tool")

            future = executor.submit(
                ask_gemini,
                prompt,
            )

            response = future.result(timeout=20)

            add("✅ Response Generated")

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
                "⚠️ CareerPilot AI has reached the current Gemini API free quota.\n\n"
                "Please wait a few minutes and try again."
            )

        return f"⚠️ Error: {error}"


def review_resume(resume_text: str) -> str:
    clear()

    add("📄 Resume Uploaded")
    add("🧠 Resume Agent Selected")

    system_prompt = get_system_prompt("review my resume")

    prompt = f"""
{system_prompt}

Student Resume:

{resume_text}

IMPORTANT:

• Keep the response under 350 words.
• Focus only on the most important improvements.
• Give practical and concise advice.
• Do NOT repeat information.
"""

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:

            add("🚀 Sending Resume to Gemini Tool")

            future = executor.submit(
                ask_gemini,
                prompt,
            )

            response = future.result(timeout=20)

            add("✅ Resume Analysis Completed")

        return response

    except concurrent.futures.TimeoutError:
        return (
            "⏳ Resume analysis is taking longer than expected.\n\n"
            "Please try again in a few moments."
        )

    except Exception as e:
        error = str(e)

        if "429" in error or "RESOURCE_EXHAUSTED" in error:
            return (
                "⚠️ CareerPilot AI has reached the current Gemini API free quota.\n\n"
                "Please wait a few minutes and try again."
            )

        return f"⚠️ Error: {error}"