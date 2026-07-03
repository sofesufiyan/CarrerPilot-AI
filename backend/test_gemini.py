import time
import traceback
import sys
import os

# Ensure we can import the local 'app' package
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.config import GEMINI_API_KEY
except ImportError:
    print("Error: Could not import GEMINI_API_KEY from app.core.config.")
    sys.exit(1)

from google import genai

def test_gemini():
    # Attempt to get SDK version
    try:
        import importlib.metadata
        sdk_version = importlib.metadata.version("google-genai")
    except Exception:
        sdk_version = getattr(genai, "__version__", "Unknown")

    print(f"--- Gemini API Diagnostics ---")
    print(f"SDK Version: {sdk_version}")
    
    model_name = "gemini-2.5-flash"
    prompt = "Say Hello in one sentence."
    
    print(f"Model Name:  {model_name}")
    print(f"Prompt:      {prompt}")
    print(f"------------------------------\n")
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    
    start_time = time.time()
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        elapsed = time.time() - start_time
        print(f"Time Taken:    {elapsed:.2f} seconds")
        print(f"Response Text: {response.text}")
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"Time Taken before failure: {elapsed:.2f} seconds")
        print("\n--- Exception Traceback ---")
        traceback.print_exc()

if __name__ == "__main__":
    test_gemini()
