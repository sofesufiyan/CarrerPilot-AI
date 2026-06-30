from app.router.router import get_system_prompt
from google import genai
from app.core.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)


def get_career_advice(question: str) -> str:
    system_prompt = get_system_prompt(question)

    prompt = f"""
{system_prompt}

Student Question:

{question}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return str(e)


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
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return str(e)