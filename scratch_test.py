import os
from dotenv import load_dotenv

load_dotenv()

from app.services.ai_form_generator import _generate_single_form, _generate_batch

doc_text = "Cong ty ban banh mi, doanh thu 1 ty"
answers = "Ban o Vietnam"
form_key = "a1-mission"

print("Single form mode:")
print(_generate_single_form(form_key, doc_text, answers))

print("\nBatch mode:")
print(_generate_batch("Nhom test", [form_key], doc_text, answers))
