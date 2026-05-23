import os
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    os.environ["GOOGLE_API_KEY"] = api_key

from langchain_google_genai import ChatGoogleGenerativeAI

models_to_test = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-pro",
    "gemini-2.0-flash",
    "gemini-2.5-flash"
]

print(f"Using API Key: {api_key[:8]}...{api_key[-8:] if len(api_key) > 8 else ''}")

for model in models_to_test:
    try:
        # Set max_retries=0 to fail immediately and speed up testing
        llm = ChatGoogleGenerativeAI(model=model, temperature=0, google_api_key=api_key, max_retries=0)
        res = llm.invoke("Hello, reply in 1 word.")
        print(f"{model}: SUCCESS - {res.content.strip()}")
    except Exception as e:
        print(f"{model}: FAILED - {e}")
