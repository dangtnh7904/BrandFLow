import json
from app.agents.intake.intake_agent import extract_document_summary

class UploadAnalyzer:
    def __init__(self):
        pass
        
    def extract_answers(self, text: str) -> dict:
        """
        Reads the uploaded text and performs a deep Strategic Marketing Audit 
        using the 2024 Marketing Plan framework instead of the old mock form.
        """
        try:
            # Chuyển hướng luồng Upload về Agent Phân tích sâu (Strategic Auditor)
            return extract_document_summary(text)
        except Exception as e:
            print("Error in UploadAnalyzer:", e)
            return {}
