import json
from app.agents.intake.intake_agent import extract_document_summary
from app.agents.intake.input_validator import validate_input_completeness


class UploadAnalyzer:
    def __init__(self):
        pass
        
    def extract_answers(self, text: str) -> dict:
        """
        Reads the uploaded text and performs a deep Strategic Marketing Audit 
        using the 2024 Marketing Plan framework.
        Returns extracted answers + completeness validation.
        """
        try:
            extracted = extract_document_summary(text)
            
            # Validate completeness of extracted data
            completeness = validate_input_completeness(extracted_data=extracted)
            
            return {
                "extracted": extracted,
                "completeness": completeness,
            }
        except Exception as e:
            print("Error in UploadAnalyzer:", e)
            return {
                "extracted": {},
                "completeness": validate_input_completeness(extracted_data={}),
            }
