from google import genai
import time

from app.core.config import GEMINI_API_KEY
from app.tools.agent_logger import add

client = genai.Client(api_key=GEMINI_API_KEY)


def ask_gemini(prompt: str):

    add("🤖 Gemini Tool Activated")

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
            )

            add("✅ Gemini Response Generated")

            return response.text

        except Exception as e:

            add(f"⚠️ Retry {attempt+1}: {str(e)}")

            time.sleep(3)

    return "⚠️ Gemini is currently busy. Please try again in a few moments."