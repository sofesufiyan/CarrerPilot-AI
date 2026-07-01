import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of backend
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env
dotenv_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("====================================")
print("BASE_DIR:", BASE_DIR)
print("DOTENV PATH:", dotenv_path)
print("Loaded Gemini Key:", GEMINI_API_KEY)
print("====================================")