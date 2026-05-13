import google.generativeai as genai
import os
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
print('Cac model kha dung:')
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f'- {m.name}')
