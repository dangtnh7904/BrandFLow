import os
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import GoogleGenerativeAIEmbeddings

print("GEMINI_API_KEY:", os.getenv("GEMINI_API_KEY"))
print("GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))

try:
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    res = embeddings.embed_query("hello")
    print("Embedding success! Length:", len(res))
except Exception as e:
    print("Embedding failed:", type(e).__name__, "-", e)
