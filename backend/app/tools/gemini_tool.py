from google import genai
from app.core.config import GEMINI_API_KEY
from app.tools.agent_logger import add

client = genai.Client(api_key=GEMINI_API_KEY)


def ask_gemini(prompt: str):

    add("🤖 Gemini Tool Activated")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    add("✅ Gemini Response Generated")

    return response.text