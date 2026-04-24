import google.generativeai as genai
genai.configure(api_key='AIzaSyC1-yfTQ1syFW1xMmLyh22hzzHv82KvCk4')
print('Cac model kha dung:')
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f'- {m.name}')
