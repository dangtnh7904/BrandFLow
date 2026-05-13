import google.generativeai as genai
import os
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
try:
    print('- Calling gemini-flash-latest...')
    model = genai.GenerativeModel('gemini-flash-latest')
    res = model.generate_content('Hi')
    print('   -> OK')
except Exception as e:
    print('Error:', e)
