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

The following is the student's resume.

Review it professionally.

Give the response in this format:

# Resume Analysis

## Overall Score (0-100)

## Strengths

## Weaknesses

## Missing Skills

## ATS Improvements

## Suggested Projects

## Final Advice

Resume:

{resume_text}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return str(e)