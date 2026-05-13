import pandas as pd
import json
import os
import sys

# Đảm bảo có thư mục scratch
os.makedirs('scratch', exist_ok=True)

output = {}

# 1. Đọc file Excel IMC Plan
try:
    xl = pd.ExcelFile('docs/MKT PLAN BAO NGOC IMC PLAN 5 THÁNG.N5.xlsx')
    output['excel_sheets'] = xl.sheet_names
    for sheet in xl.sheet_names:
        df = xl.parse(sheet)
        output[f'excel_{sheet}_columns'] = list(str(c) for c in df.columns)
        output[f'excel_{sheet}_head'] = df.astype(str).head(3).to_dict()
except Exception as e:
    output['excel_error'] = str(e)

# 2. Đọc file PDF (nếu có PyPDF2)
try:
    import PyPDF2
    with open('docs/Hà đô CH28.pdf', 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        output['pdf_hado_pages'] = len(reader.pages)
        # Extract vài trang đầu để hiểu dàn ý
        text = ""
        for i in range(min(5, len(reader.pages))):
            text += reader.pages[i].extract_text() + "\n"
        output['pdf_hado_text'] = text[:2000]
except Exception as e:
    output['pdf_hado_error'] = str(e)

# 3. Đọc template Marketing Plan PDF
try:
    import PyPDF2
    with open('docs/Marketing Plan Template .pdf', 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for i in range(min(5, len(reader.pages))):
            text += reader.pages[i].extract_text() + "\n"
        output['pdf_template_text'] = text[:2000]
except Exception as e:
    output['pdf_template_error'] = str(e)

with open('scratch/read_docs.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Done. Output written to scratch/read_docs.json")
