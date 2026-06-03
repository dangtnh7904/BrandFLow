"""
=============================================================================
BrandFlow — Premium eBook PDF Generator (High-End Design)
=============================================================================
Tạo PDF chuyên nghiệp chuẩn editorial từ nội dung Markdown.
Features:
  • Dual-font typography: Georgia (headings) + Arial (body)
  • Paragraph first-line indent (lùi đầu dòng)
  • Styled bullet points (gạch đầu dòng đẹp)
  • Chapter title pages (trang tiêu đề chương)
  • Pull-quotes & callout boxes
  • Table rendering (bảng biểu) — smart column widths
  • Elegant typography & spacing
  • Page decorations (header line, footer page number)
  • Smart page breaks (no unnecessary blank pages)
=============================================================================
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

import os
import re
from fpdf import FPDF

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_PUB_DIR = os.path.join(BASE_DIR, "frontend", "public", "resources")
EBOOKS_DIR = os.path.join(BASE_DIR, "scripts", "ebooks")
os.makedirs(FRONTEND_PUB_DIR, exist_ok=True)

# ── Design Tokens ──
NAVY = (15, 23, 42)        # #0F172A
DARK = (30, 30, 30)
BODY = (50, 50, 60)
MUTED = (120, 130, 150)
GOLD = (212, 175, 55)      # #D4AF37
CYAN = (6, 182, 212)
WHITE = (255, 255, 255)
LIGHT_BG = (248, 250, 252)
CALLOUT_BG = (240, 245, 255)
TIP_BG = (236, 253, 245)
TABLE_HEADER_BG = (15, 23, 42)
TABLE_ROW_ALT = (248, 250, 252)
ACCENT_LINE = (6, 182, 212)

PAGE_W = 210
PAGE_H = 297
MARGIN_L = 22
MARGIN_R = 22
MARGIN_T = 25
MARGIN_B = 20
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R
INDENT = 8  # First-line indent for paragraphs

# ── Font Names (dual typography system) ──
FONT_HEADING = "Heading"   # Georgia — serif, elegant, for titles
FONT_BODY = "Body"         # Arial — sans-serif, clean, for paragraphs


class HighEndPDF(FPDF):
    def __init__(self, title, cover_image_path):
        super().__init__()
        self.doc_title = title
        self.cover_image_path = cover_image_path
        self.chapter_count = 0
        self.in_table = False

        # ── BODY FONT: Arial (sans-serif) — readability for paragraphs ──
        try:
            self.add_font(FONT_BODY, "", r"C:\Windows\Fonts\arial.ttf", uni=True)
            self.add_font(FONT_BODY, "B", r"C:\Windows\Fonts\arialbd.ttf", uni=True)
            self.add_font(FONT_BODY, "I", r"C:\Windows\Fonts\ariali.ttf", uni=True)
            self.add_font(FONT_BODY, "BI", r"C:\Windows\Fonts\arialbi.ttf", uni=True)
        except Exception:
            self.add_font(FONT_BODY, "", r"C:\Windows\Fonts\arial.ttf")
            self.add_font(FONT_BODY, "B", r"C:\Windows\Fonts\arialbd.ttf")

        # ── HEADING FONT: Times New Roman (serif) — elegance for titles, full Vietnamese Unicode ──
        try:
            self.add_font(FONT_HEADING, "", r"C:\Windows\Fonts\times.ttf", uni=True)
            self.add_font(FONT_HEADING, "B", r"C:\Windows\Fonts\timesbd.ttf", uni=True)
            self.add_font(FONT_HEADING, "I", r"C:\Windows\Fonts\timesi.ttf", uni=True)
            self.add_font(FONT_HEADING, "BI", r"C:\Windows\Fonts\timesbi.ttf", uni=True)
            self._has_heading_font = True
        except Exception:
            print("⚠ Times New Roman not found, falling back to Arial for headings")
            self._has_heading_font = False

    def _heading_font(self):
        """Return the heading font name (Georgia if available, else Arial)."""
        return FONT_HEADING if self._has_heading_font else FONT_BODY

    # ── Cover Page ──
    def add_cover(self):
        self.add_page()
        try:
            self.image(self.cover_image_path, x=0, y=0, w=210, h=297)
        except Exception as e:
            print(f"Cover error: {e}")
            self.set_fill_color(*NAVY)
            self.rect(0, 0, 210, 297, "F")
            self.set_font(self._heading_font(), "B", 36)
            self.set_text_color(*WHITE)
            self.set_xy(20, 100)
            self.multi_cell(170, 18, self.doc_title, align="C")

    # ── Chapter Title Page ──
    def add_chapter_page(self, chapter_num, chapter_title):
        self.add_page()
        # Dark background
        self.set_fill_color(*NAVY)
        self.rect(0, 0, PAGE_W, PAGE_H, "F")

        # Background Pattern / Geometric Shapes
        self.set_draw_color(30, 41, 59)
        self.set_line_width(2)
        self.circle(PAGE_W, 0, 100, style="D")
        self.circle(PAGE_W, 0, 150, style="D")
        
        self.set_fill_color(30, 41, 59)
        self.regular_polygon(0, PAGE_H, 60, 3, style="F")

        # Gold accent line
        self.set_draw_color(*GOLD)
        self.set_line_width(0.8)
        self.line(MARGIN_L, 100, MARGIN_L + 50, 100)

        # Chapter number — small caps style (Body font, lighter)
        self.set_font(FONT_BODY, "B", 12)
        self.set_text_color(*GOLD)
        self.set_xy(MARGIN_L, 108)
        chapter_label = f"CHƯƠNG {chapter_num}" if chapter_num else ""
        self.cell(0, 8, chapter_label, new_x="LMARGIN", new_y="NEXT")

        # Chapter title — Heading font (Georgia), large and elegant
        self.set_font(self._heading_font(), "B", 30)
        self.set_text_color(*WHITE)
        self.set_xy(MARGIN_L, 124)
        self.multi_cell(CONTENT_W, 15, chapter_title, new_x="LMARGIN", new_y="NEXT")

        # Bottom decorative line
        self.set_draw_color(*GOLD)
        self.set_line_width(0.3)
        self.line(MARGIN_L, PAGE_H - 40, PAGE_W - MARGIN_R, PAGE_H - 40)

        # BrandFlow watermark — italic body font
        self.set_font(FONT_BODY, "I", 9)
        self.set_text_color(100, 110, 130)
        self.set_xy(MARGIN_L, PAGE_H - 35)
        self.cell(CONTENT_W, 6, "BrandFlow Insights", align="C")

    # ── Page Header ──
    def header(self):
        if self.page_no() <= 1:
            return
        self.set_draw_color(*ACCENT_LINE)
        self.set_line_width(0.3)
        self.line(MARGIN_L, 12, PAGE_W - MARGIN_R, 12)

        # Header text — small body font
        self.set_font(FONT_BODY, "I", 7.5)
        self.set_text_color(*MUTED)
        self.set_xy(MARGIN_L, 14)
        self.cell(CONTENT_W / 2, 5, self.doc_title)
        self.set_xy(MARGIN_L + CONTENT_W / 2, 14)
        self.cell(CONTENT_W / 2, 5, "BrandFlow Insights", align="R")
        self.ln(12)

    # ── Page Footer ──
    def footer(self):
        if self.page_no() <= 1:
            return
        self.set_y(-MARGIN_B)
        self.set_draw_color(200, 200, 210)
        self.set_line_width(0.2)
        self.line(MARGIN_L, PAGE_H - MARGIN_B, PAGE_W - MARGIN_R, PAGE_H - MARGIN_B)
        self.set_font(FONT_BODY, "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 10, str(self.page_no()), align="C")

    # ── Content Renderers ──

    def _ensure_space(self, needed_mm=30):
        """Check if there's enough space on the current page."""
        if self.get_y() > PAGE_H - MARGIN_B - needed_mm:
            self.add_page()

    def write_paragraph(self, text, indent=True):
        """Write an indented paragraph — Body font (Arial), comfortable line height."""
        self._ensure_space(20)
        self.set_font(FONT_BODY, "", 10.5)
        self.set_text_color(*BODY)
        if indent:
            self.set_x(MARGIN_L + INDENT)
            first_line_w = CONTENT_W - INDENT
        else:
            self.set_x(MARGIN_L)
            first_line_w = CONTENT_W

        clean_text = self._clean_bold(text)
        self.multi_cell(first_line_w if indent else CONTENT_W, 7, clean_text, new_x="LMARGIN", new_y="NEXT")
        self.ln(3.5)

    def write_bold_paragraph(self, text):
        """Write bold text — Body font bold."""
        self._ensure_space(20)
        self.set_font(FONT_BODY, "B", 10.5)
        self.set_text_color(*DARK)
        clean = self._clean_bold(text)
        self.multi_cell(CONTENT_W, 7, clean, new_x="LMARGIN", new_y="NEXT")
        self.ln(3.5)

    def write_bullet(self, text, level=0):
        """Write a styled bullet point — Body font."""
        self._ensure_space(15)
        bullet_indent = MARGIN_L + 8 + (level * 10)
        text_indent = bullet_indent + 8
        text_width = PAGE_W - MARGIN_R - text_indent

        # Bullet symbol
        self.set_font(FONT_BODY, "B", 10)
        self.set_text_color(*CYAN)
        self.set_xy(bullet_indent, self.get_y())
        bullet_char = "●" if level == 0 else "○"
        self.cell(6, 6.5, bullet_char)

        # Bullet text
        self.set_font(FONT_BODY, "", 10.5)
        self.set_text_color(*BODY)
        self.set_x(text_indent)
        clean = self._clean_bold(text)
        self.multi_cell(text_width, 6.5, clean, new_x="LMARGIN", new_y="NEXT")
        self.ln(2.5)

    def write_numbered_item(self, num, text):
        """Write a numbered list item — Body font."""
        self._ensure_space(15)
        num_indent = MARGIN_L + 6
        text_indent = num_indent + 10
        text_width = PAGE_W - MARGIN_R - text_indent

        # Number
        self.set_font(FONT_BODY, "B", 10.5)
        self.set_text_color(*NAVY)
        self.set_xy(num_indent, self.get_y())
        self.cell(8, 6.5, f"{num}.")

        # Text
        self.set_font(FONT_BODY, "", 10.5)
        self.set_text_color(*BODY)
        self.set_x(text_indent)
        clean = self._clean_bold(text)
        self.multi_cell(text_width, 6.5, clean, new_x="LMARGIN", new_y="NEXT")
        self.ln(2.5)

    def write_callout(self, text, callout_type="NOTE"):
        """Write a styled callout box — Body italic font."""
        bg = CALLOUT_BG if callout_type in ("NOTE", "IMPORTANT") else TIP_BG
        accent = CYAN if callout_type in ("NOTE", "IMPORTANT") else (16, 185, 129)

        clean = self._clean_bold(text)

        # Accurate height calculation
        self.set_font(FONT_BODY, "I", 10)
        text_area_w = CONTENT_W - 26
        words = clean.split(' ')
        line_count = 1
        current_line = ""
        for word in words:
            test_line = current_line + (" " if current_line else "") + word
            if self.get_string_width(test_line) > text_area_w:
                line_count += 1
                current_line = word
            else:
                current_line = test_line
        box_h = max(22, line_count * 6 + 16)

        if self.get_y() + box_h > PAGE_H - MARGIN_B - 5:
            self.add_page()

        y_start = self.get_y()

        # Background
        self.set_fill_color(*bg)
        self.rect(MARGIN_L + 4, y_start, CONTENT_W - 8, box_h, "F")

        # Left accent bar
        self.set_fill_color(*accent)
        self.rect(MARGIN_L + 4, y_start, 3, box_h, "F")

        # Content — Body italic
        self.set_font(FONT_BODY, "I", 10)
        self.set_text_color(60, 70, 90)
        self.set_xy(MARGIN_L + 14, y_start + 6)
        self.multi_cell(text_area_w, 6, clean, new_x="LMARGIN", new_y="NEXT")
        self.set_y(y_start + box_h + 6)

    def write_h2(self, text):
        """Section header (##) — Heading font (Georgia), large."""
        self.ln(10)
        self.set_font(self._heading_font(), "B", 20)
        self.set_text_color(*NAVY)
        self.multi_cell(CONTENT_W, 11, text, new_x="LMARGIN", new_y="NEXT")
        # Underline accent
        self.set_draw_color(*CYAN)
        self.set_line_width(0.6)
        y = self.get_y() + 2
        self.line(MARGIN_L, y, MARGIN_L + 40, y)
        self.ln(10)

    def write_h3(self, text):
        """Sub-section header (###) — Heading font (Georgia), medium."""
        self._ensure_space(25)
        self.ln(8)
        self.set_font(self._heading_font(), "B", 14)
        self.set_text_color(*NAVY)
        self.multi_cell(CONTENT_W, 8, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(5)

    def write_code(self, text):
        """Inline code / formula — Body font, smaller."""
        self._ensure_space(15)
        self.set_font(FONT_BODY, "", 9.5)
        self.set_text_color(80, 80, 80)
        self.set_fill_color(240, 240, 245)
        clean = text.strip('`')
        self.set_x(MARGIN_L + 8)
        self.cell(0, 8, f"  {clean}  ", fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(4)

    def write_table(self, headers, rows):
        """Render a styled table — Body font with smart column widths."""
        if not headers or not rows:
            return

        num_cols = len(headers)
        available_w = CONTENT_W - 4

        # ── Smart column width calculation ──
        self.set_font(FONT_BODY, "B", 8.5)
        col_max_w = []
        for col_idx in range(num_cols):
            header_text = headers[col_idx].strip().strip('*').strip(':').strip()
            max_w = self.get_string_width(header_text) + 6

            self.set_font(FONT_BODY, "", 8)
            for row in rows:
                if col_idx < len(row):
                    cell_text = self._clean_bold(row[col_idx].strip())
                    cell_w = self.get_string_width(cell_text) + 6
                    max_w = max(max_w, cell_w)
            self.set_font(FONT_BODY, "B", 8.5)
            col_max_w.append(max_w)

        # Distribute proportionally with min/max
        total_natural = sum(col_max_w) or 1
        col_widths = []
        min_col_w = max(20, available_w / (num_cols * 2.5))
        max_col_w = available_w * 0.6

        for w in col_max_w:
            proportional = (w / total_natural) * available_w
            clamped = max(min_col_w, min(max_col_w, proportional))
            col_widths.append(clamped)

        scale = available_w / sum(col_widths)
        col_widths = [w * scale for w in col_widths]

        self.ln(4)

        # Header row
        self.set_fill_color(*TABLE_HEADER_BG)
        self.set_text_color(*WHITE)
        self.set_font(FONT_BODY, "B", 8.5)
        x_start = MARGIN_L + 2
        for i, h in enumerate(headers):
            self.set_xy(x_start + sum(col_widths[:i]), self.get_y())
            header_text = h.strip().strip('*').strip(':').strip()
            self.cell(col_widths[i], 8, header_text, border=0, fill=True)
        self.ln(8)

        # Data rows
        for row_idx, row in enumerate(rows):
            if row_idx % 2 == 1:
                self.set_fill_color(*TABLE_ROW_ALT)
            else:
                self.set_fill_color(*WHITE)
            self.set_text_color(*BODY)
            self.set_font(FONT_BODY, "", 8)

            y_before = self.get_y()
            max_h = 7
            cells_text = []
            for col_idx in range(num_cols):
                if col_idx < len(row):
                    clean = self._clean_bold(row[col_idx].strip())
                else:
                    clean = ""
                cells_text.append(clean)
                cell_w = col_widths[col_idx] - 2
                if cell_w > 0 and clean:
                    words = clean.split(' ')
                    line_count = 1
                    current_line = ""
                    for word in words:
                        test_line = current_line + (" " if current_line else "") + word
                        if self.get_string_width(test_line) > cell_w:
                            line_count += 1
                            current_line = word
                        else:
                            current_line = test_line
                    cell_h = line_count * 5 + 3
                    max_h = max(max_h, cell_h)

            if y_before + max_h > PAGE_H - MARGIN_B - 5:
                self.add_page()
                y_before = self.get_y()
                self.set_fill_color(*TABLE_HEADER_BG)
                self.set_text_color(*WHITE)
                self.set_font(FONT_BODY, "B", 8.5)
                for i, h in enumerate(headers):
                    self.set_xy(x_start + sum(col_widths[:i]), y_before)
                    header_text = h.strip().strip('*').strip(':').strip()
                    self.cell(col_widths[i], 8, header_text, border=0, fill=True)
                self.ln(8)
                y_before = self.get_y()
                self.set_font(FONT_BODY, "", 8)

            fill = row_idx % 2 == 1
            self.set_text_color(*BODY)
            self.set_font(FONT_BODY, "", 8)
            for i, txt in enumerate(cells_text):
                self.set_xy(x_start + sum(col_widths[:i]), y_before)
                self.multi_cell(col_widths[i], 5, txt, border=0, fill=fill, new_x="RIGHT", new_y="TOP")
            self.set_y(y_before + max_h)

        self.ln(6)

    def write_separator(self):
        """Decorative section separator"""
        self.ln(6)
        y = self.get_y()
        mid = PAGE_W / 2
        self.set_draw_color(*MUTED)
        self.set_line_width(0.2)
        self.line(mid - 30, y, mid - 8, y)
        self.line(mid + 8, y, mid + 30, y)
        self.set_fill_color(*GOLD)
        self.regular_polygon(mid, y, 2.5, 4, style="F")
        self.ln(10)

    # ── Helpers ──
    def _clean_bold(self, text):
        """Remove **bold** markdown syntax but keep text."""
        return re.sub(r'\*\*(.*?)\*\*', r'\1', text)

    def regular_polygon(self, x, y, r, n, style="D"):
        """Draw a regular polygon (diamond for n=4)."""
        import math
        points = []
        for i in range(n):
            angle = 2 * math.pi * i / n - math.pi / 2
            px = x + r * math.cos(angle)
            py = y + r * math.sin(angle)
            points.append((px, py))
        if style in ("F", "FD", "DF"):
            self.set_fill_color(*GOLD)
        for i, (px, py) in enumerate(points):
            if i == 0:
                self.set_xy(px, py)
            self.line(points[i][0], points[i][1], points[(i+1) % n][0], points[(i+1) % n][1])
            
    def circle(self, x, y, r, style="D"):
        """Draw a circle."""
        if style == "F":
            self.ellipse(x - r, y - r, 2*r, 2*r, style="F")
        else:
            self.ellipse(x - r, y - r, 2*r, 2*r, style="D")

    def write_space_filler(self):
        """Fill empty spaces at bottom of page with elegant brand mark."""
        y = self.get_y()
        if y < PAGE_H - 100:
            mid = PAGE_W / 2
            center_y = y + (PAGE_H - MARGIN_B - y) / 2
            
            self.set_draw_color(240, 245, 250)
            self.set_line_width(0.5)
            self.circle(mid, center_y, 25, style="D")
            self.circle(mid, center_y, 20, style="D")
            
            # Watermark — Heading font italic
            self.set_font(self._heading_font(), "I", 12)
            self.set_text_color(200, 210, 225)
            self.set_xy(MARGIN_L, center_y - 4)
            self.cell(CONTENT_W, 8, "BRANDFLOW INSIGHTS", align="C")
            
            self.set_y(PAGE_H - MARGIN_B)


def parse_and_render(pdf: HighEndPDF, lines: list):
    """Parse markdown lines and render them with high-end styling."""
    i = 0
    chapter_num = 0
    in_table = False
    table_headers = []
    table_rows = []
    callout_buffer = []
    in_callout = False
    callout_type = "NOTE"

    while i < len(lines):
        line = lines[i].rstrip('\n').rstrip('\r')

        # ── Skip HTML diagram blocks ──
        if line.strip().startswith('<div') or line.strip().startswith('</div') or line.strip().startswith('<!--'):
            i += 1
            continue
        if line.strip().startswith('<') and not line.strip().startswith('> '):
            i += 1
            continue

        stripped = line.strip()

        # ── Flush callout if we're leaving it ──
        if in_callout and not stripped.startswith('>'):
            full_callout = ' '.join(callout_buffer)
            pdf.write_callout(full_callout, callout_type)
            callout_buffer = []
            in_callout = False

        # ── Flush table if we're leaving it ──
        if in_table and not stripped.startswith('|'):
            pdf.write_table(table_headers, table_rows)
            table_headers = []
            table_rows = []
            in_table = False

        # ── Empty line ──
        if not stripped:
            i += 1
            continue

        # ── Horizontal rule ──
        if stripped == '---' or stripped == '***':
            pdf.write_separator()
            i += 1
            continue

        # ── Skip images ──
        if stripped.startswith('!['):
            i += 1
            continue

        # ── H1: Book title (skip, already on cover) ──
        if stripped.startswith('# ') and not stripped.startswith('## '):
            i += 1
            continue

        # ── H2: Chapter title → Full page chapter divider ──
        if stripped.startswith('## '):
            title = stripped[3:].strip()
            ch_match = re.match(r'(?:CHƯƠNG|Chương|Chapter)\s+(\d+)', title)
            if ch_match:
                chapter_num = int(ch_match.group(1))
                if pdf.page_no() > 2 and pdf.get_y() < PAGE_H * 0.55:
                    pdf.write_space_filler()
                pdf.add_chapter_page(chapter_num, title)
                pdf.add_page()
            elif 'PHỤ LỤC' in title.upper() or 'APPENDIX' in title.upper():
                pdf.add_chapter_page(None, title)
                pdf.add_page()
            else:
                if pdf.page_no() <= 2:
                    pdf.add_page()
                pdf.write_h2(title)
            i += 1
            continue

        # ── H3: Sub-section ──
        if stripped.startswith('### '):
            title = stripped[4:].strip()
            pdf.write_h3(title)
            i += 1
            continue

        # ── Callout blocks ──
        if stripped.startswith('> [!'):
            match = re.match(r'>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]', stripped)
            if match:
                callout_type = match.group(1)
                in_callout = True
                callout_buffer = []
                i += 1
                continue

        if stripped.startswith('>'):
            text = stripped.lstrip('>').strip()
            if in_callout:
                if text:
                    callout_buffer.append(text)
            else:
                in_callout = True
                callout_type = "NOTE"
                callout_buffer = [text] if text else []
            i += 1
            continue

        # ── Tables ──
        if stripped.startswith('|'):
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            if all(re.match(r'^[-:]+$', c) for c in cells):
                i += 1
                continue
            if not in_table:
                table_headers = cells
                in_table = True
            else:
                table_rows.append(cells)
            i += 1
            continue

        # ── Bullet points ──
        bullet_match = re.match(r'^(\s*)[-*]\s+(.*)', stripped)
        if bullet_match:
            indent_level = len(bullet_match.group(1)) // 2
            text = bullet_match.group(2)
            pdf.write_bullet(text, level=indent_level)
            i += 1
            continue

        # ── Numbered list ──
        num_match = re.match(r'^(\d+)\.\s+(.*)', stripped)
        if num_match:
            num = num_match.group(1)
            text = num_match.group(2)
            pdf.write_numbered_item(num, text)
            i += 1
            continue

        # ── Code blocks ──
        if stripped.startswith('`') and stripped.endswith('`'):
            pdf.write_code(stripped)
            i += 1
            continue

        # ── Bold-only lines ──
        if stripped.startswith('**') and stripped.endswith('**'):
            pdf.write_bold_paragraph(stripped)
            i += 1
            continue

        # ── Regular paragraph ──
        pdf.write_paragraph(stripped, indent=True)
        i += 1

    # Flush remaining
    if in_callout and callout_buffer:
        pdf.write_callout(' '.join(callout_buffer), callout_type)
    if in_table and table_headers:
        pdf.write_table(table_headers, table_rows)


def create_premium_pdf(md_filename, pdf_filename, title, cover_img):
    """Generate a high-end PDF from markdown."""
    pdf = HighEndPDF(title, cover_img)
    pdf.set_auto_page_break(auto=True, margin=MARGIN_B + 5)
    pdf.set_left_margin(MARGIN_L)
    pdf.set_right_margin(MARGIN_R)

    # Cover
    pdf.add_cover()

    # Table of contents page
    pdf.add_page()
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, PAGE_W, PAGE_H, "F")

    # TOC title — Heading font
    pdf.set_font(pdf._heading_font(), "B", 14)
    pdf.set_text_color(*GOLD)
    pdf.set_xy(MARGIN_L, 40)
    pdf.cell(CONTENT_W, 8, "MỤC LỤC", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)
    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.3)
    mid = PAGE_W / 2
    pdf.line(mid - 20, pdf.get_y(), mid + 20, pdf.get_y())
    pdf.ln(10)

    # Parse MD to find chapter titles
    md_path = os.path.join(EBOOKS_DIR, md_filename)
    if not os.path.exists(md_path):
        print(f"Error: Not found {md_path}")
        return

    with open(md_path, "r", encoding="utf-8") as f:
        all_lines = f.readlines()

    toc_items = []
    for line in all_lines:
        s = line.strip()
        if s.startswith('## '):
            toc_items.append(s[3:].strip())

    # TOC items — Body font
    pdf.set_font(FONT_BODY, "", 10.5)
    pdf.set_text_color(180, 190, 210)
    for idx, item in enumerate(toc_items):
        pdf.set_x(MARGIN_L + 10)
        prefix = f"{idx + 1:02d}  —  "
        pdf.cell(CONTENT_W - 20, 10, prefix + item, new_x="LMARGIN", new_y="NEXT")

    # Content pages
    parse_and_render(pdf, all_lines)

    # ── Closing Page ──
    pdf.add_page()
    pdf.set_fill_color(*NAVY)
    pdf.rect(0, 0, PAGE_W, PAGE_H, "F")

    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.5)
    pdf.line(MARGIN_L, 120, MARGIN_L + 40, 120)

    # Closing quote — Heading font italic
    pdf.set_font(pdf._heading_font(), "I", 16)
    pdf.set_text_color(*WHITE)
    pdf.set_xy(MARGIN_L, 130)
    pdf.multi_cell(CONTENT_W, 10, "Cảm ơn bạn đã đọc.\nChúc bạn thành công trên hành trình\nxây dựng thương hiệu.", align="C")

    pdf.ln(20)
    # Brand name — Heading font bold
    pdf.set_font(pdf._heading_font(), "B", 13)
    pdf.set_text_color(*GOLD)
    pdf.cell(CONTENT_W, 8, "brandflow.io", align="C", new_x="LMARGIN", new_y="NEXT")

    # Copyright — Body font
    pdf.set_font(FONT_BODY, "", 9)
    pdf.set_text_color(*MUTED)
    pdf.ln(5)
    pdf.cell(CONTENT_W, 6, "© 2026 BrandFlow. All rights reserved.", align="C")

    out_path = os.path.join(FRONTEND_PUB_DIR, pdf_filename)
    pdf.output(out_path)
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"✅ Generated {pdf_filename} ({size_mb:.1f} MB) → {out_path}")


if __name__ == "__main__":
    print("═" * 60)
    print("  BrandFlow Premium eBook Generator")
    print("  Typography: Times New Roman (headings) + Arial (body)")
    print("═" * 60)

    create_premium_pdf(
        md_filename="high_end_ebook_ai.md",
        pdf_filename="THE_AI_POWERED_SME.pdf",
        title="THE AI-POWERED SME",
        cover_img=os.path.join(EBOOKS_DIR, "cover_ai.png")
    )

    create_premium_pdf(
        md_filename="high_end_guideline_branding.md",
        pdf_filename="BRANDING_MASTERCLASS.pdf",
        title="BRANDING MASTERCLASS",
        cover_img=os.path.join(EBOOKS_DIR, "cover_branding.png")
    )

    create_premium_pdf(
        md_filename="high_end_ebook_marketing_plan.md",
        pdf_filename="MARKETING_PLAN_MASTERCLASS.pdf",
        title="MARKETING PLAN MASTERCLASS",
        cover_img=os.path.join(EBOOKS_DIR, "cover_marketing.png")
    )

    print("\n✅ All 3 ebooks generated successfully!")
