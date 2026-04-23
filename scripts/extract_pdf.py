import sys
import subprocess

def install_and_import(package, import_name=None):
    if import_name is None:
        import_name = package
    try:
        __import__(import_name)
    except ImportError:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        __import__(import_name)

# Install PyMuPDF (fitz) for text extraction if not present
install_and_import('PyMuPDF', 'fitz')
import fitz

pdf_path = r"D:\Project\BrandFlow\BrandFlow\Marketing Plan Template .pdf"
txt_path = r"D:\Project\BrandFlow\BrandFlow\scripts\pdf_content.txt"

try:
    doc = fitz.open(pdf_path)
    text = ""
    for i, page in enumerate(doc):
        text += f"\n--- Page {i+1} ---\n"
        # Extract text preserving somewhat the physical layout
        text += page.get_text("text")
    
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Successfully extracted {len(doc)} pages of text to {txt_path}")
except Exception as e:
    print(f"Error: {e}")
