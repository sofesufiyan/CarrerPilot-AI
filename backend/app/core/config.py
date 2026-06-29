import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory of the project (backend/)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from .env using an absolute path
dotenv_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")