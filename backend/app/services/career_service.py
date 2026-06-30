from app.router.router import get_system_prompt
from google import genai
from app.core.config import GEMINI_API_KEY
import concurrent.futures

client = genai.Client(api_key=GEMINI_API_KEY)


def get_career_advice(question: str) -> str:
    system_prompt = get_system_prompt(question)

    prompt = f"""
{system_prompt}

Student Question:

{question}
"""

    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(
                client.models.generate_content,
                model="gemini-2.5-flash",
                contents=prompt,
            )

            response = future.result(timeout=20)

        return response.text

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
            future = executor.submit(
                client.models.generate_content,
                model="gemini-2.5-flash",
                contents=prompt,
            )

            response = future.result(timeout=20)

        return response.text

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