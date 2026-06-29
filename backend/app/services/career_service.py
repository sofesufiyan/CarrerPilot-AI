from google import genai
from app.core.config import GEMINI_API_KEY
from app.agents.career_agent import CAREER_SYSTEM_PROMPT

client = genai.Client(api_key=GEMINI_API_KEY)

def get_career_advice(question: str) -> str:
    prompt = f"""
{CAREER_SYSTEM_PROMPT}

Before answering:

1. Identify the student's main goal.
2. Decide which role you should take:
   - Career Roadmap Expert
   - Resume Expert
   - Interview Coach
   - Skill Gap Analyzer
3. Answer using the most appropriate role.
4. Explain your reasoning briefly.
5. Give actionable steps.


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