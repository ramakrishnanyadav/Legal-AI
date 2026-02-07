import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("\n=== Available Gemini Models ===\n")

try:
    models = client.models.list()
    for model in models:
        # Filter for Gemini 2.0 Flash models
        if 'gemini' in model.name.lower() and 'flash' in model.name.lower():
            print(f"✅ Model: {model.name}")
            if hasattr(model, 'supported_generation_methods'):
                print(f"   Methods: {model.supported_generation_methods}")
            print()
except Exception as e:
    print(f"Error: {e}")