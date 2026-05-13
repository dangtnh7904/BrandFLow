import PyPDF2
import json
import os

pdf_files = [
    "docs/2024 Marketing Plans Profitable Strategies in the Digital Age, 9th Edition (Malcolm McDonald, Hugh Wilson, Dave Chaf.pdf",
    "docs/Consumer Behavior_ Building Marketing Strategy ( PDFDrive ).pdf",
    "docs/Marketing Management - Indian Case Studies Included, 16th Edition ( etc.) (Z-Library).pdf",
    "docs/Hà đô CH28.pdf"
]

output = {}
os.makedirs("scratch", exist_ok=True)

for pdf in pdf_files:
    if not os.path.exists(pdf):
        output[pdf] = "Not found"
        continue
    try:
        with open(pdf, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = len(reader.pages)
            # Extract first 25 pages to get TOC and intro frameworks
            text = ""
            for i in range(min(25, num_pages)):
                page_text = reader.pages[i].extract_text()
                if page_text:
                    text += page_text + "\n"
            output[pdf] = text[:15000] # Cap length to avoid massive JSONs
    except Exception as e:
        output[pdf] = f"Error: {e}"

with open("scratch/pdf_extractions.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("PDF extraction complete.")
