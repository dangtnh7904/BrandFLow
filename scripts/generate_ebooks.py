import os
from fpdf import FPDF
import re

# Định nghĩa đường dẫn
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_PUB_DIR = os.path.join(BASE_DIR, "frontend", "public", "resources")
ARTIFACTS_DIR = r"C:\Users\HP\.gemini\antigravity-ide\brain\8e99eaca-ed08-4972-ae5d-1588732cef7b"

# Tạo thư mục public/resources nếu chưa có
os.makedirs(FRONTEND_PUB_DIR, exist_ok=True)

class EbookPDF(FPDF):
    def __init__(self, title, cover_image_path):
        super().__init__()
        self.doc_title = title
        self.cover_image_path = cover_image_path
        # Add font hỗ trợ tiếng Việt (Cần trỏ đúng path Arial trên Windows)
        try:
            self.add_font("Arial", "", r"C:\Windows\Fonts\arial.ttf", uni=True)
            self.add_font("Arial", "B", r"C:\Windows\Fonts\arialbd.ttf", uni=True)
            self.add_font("Arial", "I", r"C:\Windows\Fonts\ariali.ttf", uni=True)
        except Exception as e:
            print(f"Warning: Cannot load Arial font: {e}")
            pass

    def add_cover(self):
        self.add_page()
        try:
            # Full page cover
            self.image(self.cover_image_path, x=0, y=0, w=210, h=297)
        except Exception as e:
            print(f"Could not load cover {self.cover_image_path}: {e}")

    def header(self):
        if self.page_no() > 1:
            self.set_font("Arial", "I", 10)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, self.doc_title, align="C", new_x="LMARGIN", new_y="NEXT")
            self.ln(10)

    def footer(self):
        if self.page_no() > 1:
            self.set_y(-15)
            self.set_font("Arial", "I", 10)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, f"Page {self.page_no()}", align="C")

def create_pdf_from_md(md_filename, pdf_filename, title, cover_img):
    pdf = EbookPDF(title, cover_img)
    pdf.add_cover()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    md_path = os.path.join(ARTIFACTS_DIR, md_filename)
    if not os.path.exists(md_path):
        print(f"Error: Not found {md_path}")
        return

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    pdf.set_font("Arial", size=12)
    pdf.set_text_color(40, 40, 40)
    
    for line in lines:
        line = line.strip()
        if not line:
            pdf.ln(5)
            continue
            
        # Bỏ qua hình ảnh markdown
        if line.startswith("!["):
            continue
            
        # Headers
        if line.startswith("# "):
            pdf.set_font("Arial", "B", 24)
            pdf.set_text_color(0, 0, 0)
            pdf.multi_cell(0, 10, line[2:].strip(), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(5)
            pdf.set_font("Arial", size=12)
            pdf.set_text_color(40, 40, 40)
        elif line.startswith("## "):
            pdf.set_font("Arial", "B", 18)
            pdf.set_text_color(20, 20, 20)
            pdf.multi_cell(0, 8, line[3:].strip(), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(3)
            pdf.set_font("Arial", size=12)
            pdf.set_text_color(40, 40, 40)
        elif line.startswith("### "):
            pdf.set_font("Arial", "B", 14)
            pdf.set_text_color(40, 40, 40)
            pdf.multi_cell(0, 7, line[4:].strip(), new_x="LMARGIN", new_y="NEXT")
            pdf.ln(2)
            pdf.set_font("Arial", size=12)
        else:
            # Clean up bold syntax **text**
            line = re.sub(r'\*\*(.*?)\*\*', r'\1', line)
            # Clean up blockquotes
            if line.startswith(">"):
                line = line[1:].strip()
                pdf.set_font("Arial", "I", 12)
                pdf.set_text_color(100, 100, 100)
            else:
                pdf.set_font("Arial", size=12)
                pdf.set_text_color(40, 40, 40)
                
            pdf.multi_cell(0, 6, line, new_x="LMARGIN", new_y="NEXT")

    out_path = os.path.join(FRONTEND_PUB_DIR, pdf_filename)
    pdf.output(out_path)
    print(f"Generated {pdf_filename} at {out_path}")


if __name__ == "__main__":
    # Ebook 1
    create_pdf_from_md(
        md_filename="high_end_ebook_ai.md",
        pdf_filename="THE_AI_POWERED_SME.pdf",
        title="THE AI-POWERED SME",
        cover_img=os.path.join(ARTIFACTS_DIR, "ai_marketing_cover_1780228497849.png")
    )

    # Ebook 2
    create_pdf_from_md(
        md_filename="high_end_guideline_branding.md",
        pdf_filename="BRANDING_MASTERCLASS.pdf",
        title="BRANDING MASTERCLASS",
        cover_img=os.path.join(ARTIFACTS_DIR, "branding_masterclass_cover_1780228518941.png")
    )
