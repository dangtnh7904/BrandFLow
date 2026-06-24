import google.generativeai as genai
try:
    genai.configure(api_key='AIzaSyC1-yfTQ1syFW1xMmLyh22hzzHv82KvCk4')
    print('- Calling generate_content with gemini-2.0-flash...')
    model2 = genai.GenerativeModel('gemini-2.0-flash')
    res2 = model2.generate_content('Hello')
    print('   -> SUCCESS! Response:', res2.text.strip())

    print('- Calling generate_content with gemini-1.5-flash...')
    model = genai.GenerativeModel('gemini-1.5-flash')
    res = model.generate_content('Hello')
    print('   -> SUCCESS! Response:', res.text.strip())
except Exception as e:
    print('API ERROR:', type(e).__name__)
    print(e)
