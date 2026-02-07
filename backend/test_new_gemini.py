#!/usr/bin/env python3
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"✅ Key loaded: {api_key[:15]}...{api_key[-4:]}")

client = genai.Client(api_key=api_key)

print("📤 Sending request...")
response = client.models.generate_content(
    model='gemini-2.0-flash-exp',
    contents='Say: Hello from new Gemini!',
    config=types.GenerateContentConfig(
        temperature=0.1,
        max_output_tokens=50
    )
)

print(f"✅ SUCCESS: {response.text}")