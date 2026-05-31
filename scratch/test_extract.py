import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

import os
from dotenv import load_dotenv
load_dotenv()

from app.agents.intake.intake_agent import extract_document_summary

text = "Đây là công ty Test Company chuyên về lĩnh vực công nghệ giáo dục, đối tượng học sinh cấp 3."
try:
    res = extract_document_summary(text)
    print("SUCCESS:")
    print(res)
except Exception as e:
    print(f"FAILED WITH EXCEPTION: {e}")
