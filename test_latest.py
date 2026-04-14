import google.generativeai as genai
genai.configure(api_key='AIzaSyC1-yfTQ1syFW1xMmLyh22hzzHv82KvCk4')
try:
    print('- Calling gemini-flash-latest...')
    model = genai.GenerativeModel('gemini-flash-latest')
    res = model.generate_content('Hi')
    print('   -> OK')
except Exception as e:
    print('Error:', e)
