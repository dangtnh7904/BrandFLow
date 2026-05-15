import os
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI

models_to_test = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b",
    "gemini-pro",
    "gemini-2.0-flash"
]

for model in models_to_test:
    try:
        llm = ChatGoogleGenerativeAI(model=model, temperature=0)
        res = llm.invoke("Hello")
        print(f"{model}: SUCCESS - {res.content}")
        break
    except Exception as e:
        print(f"{model}: FAILED - {e}")
