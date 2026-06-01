import os
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EBOOKS_DIR = os.path.join(BASE_DIR, "scripts", "ebooks")
FRONTEND_PUB_DIR = os.path.join(BASE_DIR, "frontend", "public", "resources")
ARTIFACTS_DIR = r"C:\Users\HP\.gemini\antigravity-ide\brain\660661c7-87ec-4a3b-bd69-a9c1292e663f"

os.makedirs(EBOOKS_DIR, exist_ok=True)
os.makedirs(FRONTEND_PUB_DIR, exist_ok=True)

def create_cover(title, subtitle, texture_file, output_filename):
    # Try to open texture, fallback to solid color
    texture_path = os.path.join(ARTIFACTS_DIR, texture_file)
    width, height = 800, 1200
    
    if os.path.exists(texture_path):
        img = Image.open(texture_path).convert("RGBA")
        # Resize/Crop to 800x1200
        img_ratio = img.width / img.height
        target_ratio = width / height
        if img_ratio > target_ratio:
            # Image is wider
            new_w = int(img.height * target_ratio)
            left = (img.width - new_w) // 2
            img = img.crop((left, 0, left + new_w, img.height))
        else:
            # Image is taller
            new_h = int(img.width / target_ratio)
            top = (img.height - new_h) // 2
            img = img.crop((0, top, img.width, top + new_h))
        img = img.resize((width, height), Image.Resampling.LANCZOS)
        
        # Darken texture for better text readability
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(0.4)
    else:
        print(f"Texture not found: {texture_path}, using solid background.")
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    draw = ImageDraw.Draw(img)

    # Try to load a font, fallback to default
    try:
        font_title = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 64)
        font_subtitle = ImageFont.truetype(r"C:\Windows\Fonts\ariali.ttf", 32)
        font_brand = ImageFont.truetype(r"C:\Windows\Fonts\arial.ttf", 24)
    except IOError:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_brand = ImageFont.load_default()

    # Draw gold top line
    draw.line([(width//2 - 150, 150), (width//2 + 150, 150)], fill=(212, 175, 55, 255), width=4)

    # Draw brand at top
    brand_text = "BRANDFLOW INSIGHTS"
    bbox = draw.textbbox((0, 0), brand_text, font=font_brand)
    draw.text(((width - (bbox[2] - bbox[0])) / 2, 90), brand_text, font=font_brand, fill=(212, 175, 55, 255))

    # Split title if too long to avoid cut off
    words = title.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        bbox = draw.textbbox((0, 0), " ".join(current_line), font=font_title)
        if bbox[2] - bbox[0] > width - 100:
            current_line.pop()
            lines.append(" ".join(current_line))
            current_line = [word]
    lines.append(" ".join(current_line))

    # Draw title
    y_text = 250
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font_title)
        draw.text(((width - (bbox[2] - bbox[0])) / 2, y_text), line, font=font_title, fill=(255, 255, 255, 255))
        y_text += 80

    # Draw gold separator
    y_text += 20
    draw.line([(width//2 - 50, y_text), (width//2 + 50, y_text)], fill=(212, 175, 55, 255), width=3)
    
    # Draw subtitle
    y_text += 50
    # Split subtitle
    words = subtitle.split()
    sub_lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        bbox = draw.textbbox((0, 0), " ".join(current_line), font=font_subtitle)
        if bbox[2] - bbox[0] > width - 160:
            current_line.pop()
            sub_lines.append(" ".join(current_line))
            current_line = [word]
    sub_lines.append(" ".join(current_line))

    for line in sub_lines:
        bbox = draw.textbbox((0, 0), line, font=font_subtitle)
        draw.text(((width - (bbox[2] - bbox[0])) / 2, y_text), line, font=font_subtitle, fill=(200, 210, 220, 255))
        y_text += 45

    # Save to both EBOOKS_DIR (for PDF generator) and FRONTEND_PUB_DIR (for web display)
    out1 = os.path.join(EBOOKS_DIR, output_filename)
    out2 = os.path.join(FRONTEND_PUB_DIR, output_filename)
    
    # Convert RGBA to RGB for saving as JPG/PNG without alpha issues if needed, but PNG supports RGBA.
    img.save(out1, format="PNG")
    img.save(out2, format="PNG")
    print(f"Generated {output_filename}")

if __name__ == "__main__":
    create_cover(
        title="THE AI-POWERED SME",
        subtitle="Tự Động Hóa Vận Hành Bằng AI - Lợi Thế Bất Công Trong Kỷ Nguyên Số",
        texture_file="ai_sme_texture_1780282657576.png",
        output_filename="ai_marketing_cover.png"
    )

    create_cover(
        title="BRANDING MASTERCLASS",
        subtitle="Từ Sản Phẩm Tốt Trở Thành Đế Chế Độc Quyền (SME Edition)",
        texture_file="branding_texture_1780282644728.png",
        output_filename="branding_cover.png"
    )

    # For Marketing Plan, the user said "bìa cũ của mkt planning masterclass ổn rồi, đừng sửa bìa của cuốn đó"
    # So we don't generate it here, we will just copy the old one to the right places.
    old_mkt = r"C:\Users\HP\.gemini\antigravity-ide\brain\8e99eaca-ed08-4972-ae5d-1588732cef7b\marketing_plan_cover_1780233786494.png"
    if os.path.exists(old_mkt):
        img = Image.open(old_mkt)
        img.save(os.path.join(EBOOKS_DIR, "marketing_plan_cover.png"))
        img.save(os.path.join(FRONTEND_PUB_DIR, "marketing_plan_cover.png"))
        print("Copied marketing_plan_cover.png")
