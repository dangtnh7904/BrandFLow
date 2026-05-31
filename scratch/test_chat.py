import os
from dotenv import load_dotenv
load_dotenv()
if "GOOGLE_API_KEY" not in os.environ and "GEMINI_API_KEY" in os.environ:
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]
from langchain_google_genai import ChatGoogleGenerativeAI

print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))

try:
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
    res = llm.invoke("Hello")
    print("gemini-2.5-flash Chat success! Response:", res.content)
except Exception as e:
    print("gemini-2.5-flash Chat failed:", type(e).__name__, "-", e)

try:
    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0)
    res = llm.invoke("Hello")
    print("gemini-2.0-flash Chat success! Response:", res.content)
except Exception as e:
    print("gemini-2.0-flash Chat failed:", type(e).__name__, "-", e)
