"""
=============================================================================
design_agent/config.py — Cấu hình, hằng số, và schemas cho Design Agent
=============================================================================
Chứa:
  - Pydantic schemas (DesignLanguage, BrandIdentityOutput)
  - Bảng ánh xạ ngành hàng → biểu tượng hình ảnh (INDUSTRY_VISUAL_SYMBOLS)
  - Bảng ánh xạ ngành hàng → phong cách ảnh banner (INDUSTRY_BANNER_STYLE)
  - Fallback Design Language theo ngành khi LLM lỗi
  - Config kỹ thuật cho Stable Diffusion / ComfyUI (resolution, steps, negative prompts)
  - URL webhook mặc định
=============================================================================
"""

import os
from typing import List
from pydantic import BaseModel, Field


# =============================================================================
# PYDANTIC SCHEMAS
# =============================================================================

class DesignLanguage(BaseModel):
    """Bộ ngôn ngữ thiết kế trích xuất từ Brand DNA."""
    color_palette: str = Field(
        description="Bảng màu đề xuất (3-5 màu HEX). VD: '#2D5016, #F5E6D3, #8B4513, #FFFFFF'"
    )
    typography: str = Field(
        description="Font chữ đề xuất cho heading và body. VD: 'Heading: Playfair Display / Body: Inter'"
    )
    style_keywords: List[str] = Field(
        description="5-8 từ khóa phong cách thiết kế. VD: ['minimalist', 'organic', 'zen', 'warm']"
    )
    mood: str = Field(
        description="Tâm trạng tổng thể thiết kế. VD: 'Thanh tịnh, ấm áp, gần gũi thiên nhiên'"
    )


class BrandIdentityOutput(BaseModel):
    """Kết quả cuối cùng trả về cho caller."""
    logo_url: str = Field(description="URL ảnh logo đã sinh")
    banner_url: str = Field(description="URL ảnh banner đã sinh")
    fanpage_concept: str = Field(description="Mô tả concept fanpage chi tiết")
    design_language: dict = Field(description="Bộ Design Language JSON")


# =============================================================================
# INDUSTRY MAPPINGS — Ánh xạ ngành hàng → yếu tố hình ảnh
# =============================================================================

# Biểu tượng hình ảnh phù hợp theo ngành, dùng trong logo prompt
INDUSTRY_VISUAL_SYMBOLS = {
    "F&B": "tea leaf, coffee bean, steam, bowl, chopsticks, spoon, wheat",
    "Spa_Beauty": "lotus flower, water drop, bamboo, orchid, smooth stone",
    "B2B_Tech": "circuit node, hexagon grid, abstract data flow, connection dots",
    "Fashion": "fabric texture, thread, hanger silhouette, mannequin outline",
    "Education": "open book, lightbulb, graduation cap, pencil, knowledge tree",
    "Healthcare": "heart pulse, leaf with cross, shield, caring hands",
    "Real_Estate": "rooftop silhouette, key, doorway arch, skyline",
    "General": "abstract geometric shape, overlapping circles, rising arrow",
}

# Phong cách ảnh banner phù hợp theo ngành
INDUSTRY_BANNER_STYLE = {
    "F&B": "appetizing food photography, steam rising, warm golden hour lighting, bokeh background",
    "Spa_Beauty": "soft focus spa scene, candle glow, essential oil drops, serene nature backdrop",
    "B2B_Tech": "futuristic workspace, holographic UI elements, clean desk setup, blue-toned lighting",
    "Fashion": "editorial fashion photography, dramatic lighting, textured fabric close-up",
    "Education": "bright study environment, diverse students, inspirational atmosphere",
    "Healthcare": "clean clinical environment, caring professional, soft natural light",
    "Real_Estate": "architectural photography, golden hour exterior, modern interior design",
    "General": "professional workspace, collaborative team, bright natural lighting",
}


# =============================================================================
# FALLBACK DESIGN LANGUAGE — Dùng khi LLM không khả dụng
# =============================================================================

FALLBACK_DESIGN_LANGUAGES = {
    "F&B": {
        "color_palette": "#D4A574, #2D5016, #F5E6D3, #8B4513, #FFFFFF",
        "typography": "Heading: Playfair Display / Body: Inter",
        "style_keywords": ["warm", "organic", "appetizing", "cozy", "artisan"],
        "mood": "Ấm áp, gần gũi, mang hương vị truyền thống",
    },
    "Spa_Beauty": {
        "color_palette": "#E8D5C4, #9B7653, #F0E1D4, #6B4F36, #FDFBF7",
        "typography": "Heading: Cormorant Garamond / Body: Lato",
        "style_keywords": ["elegant", "serene", "luxurious", "pastel", "clean"],
        "mood": "Thanh lịch, thư giãn, chuyên nghiệp",
    },
    "B2B_Tech": {
        "color_palette": "#0F172A, #3B82F6, #1E293B, #60A5FA, #F8FAFC",
        "typography": "Heading: Space Grotesk / Body: Inter",
        "style_keywords": ["modern", "minimal", "tech", "geometric", "professional"],
        "mood": "Hiện đại, chuyên nghiệp, đáng tin cậy",
    },
}

DEFAULT_DESIGN_LANGUAGE = {
    "color_palette": "#1E40AF, #F59E0B, #111827, #F3F4F6, #FFFFFF",
    "typography": "Heading: Outfit / Body: Inter",
    "style_keywords": ["modern", "clean", "professional", "balanced", "versatile"],
    "mood": "Chuyên nghiệp, cân đối, dễ tiếp cận",
}


def get_fallback_design_language(industry: str) -> dict:
    """Trả về Design Language mặc định theo ngành khi LLM lỗi."""
    return FALLBACK_DESIGN_LANGUAGES.get(industry, DEFAULT_DESIGN_LANGUAGE)


# =============================================================================
# STABLE DIFFUSION / COMFYUI CONFIG
# =============================================================================

# URL webhook mặc định. Override bằng env DESIGN_WEBHOOK_URL.
DEFAULT_WEBHOOK_URL = os.getenv(
    "DESIGN_WEBHOOK_URL",
    "http://localhost:5678/webhook/brandflow-design"
)

# Config kỹ thuật cho từng loại asset (SDXL best practice)
ASSET_CONFIGS = {
    "logo": {
        "width": 1024,
        "height": 1024,
        "steps": 35,
        "cfg_scale": 8.0,
        "sampler": "euler_ancestral",
        "scheduler": "karras",
        "checkpoint": "sdxl_base_1.0",
        "negative_prompt": (
            "text, words, letters, numbers, typography, watermark, signature, "
            "photorealistic human face, photorealistic hands, "
            "gradient background, colored background, complex background, "
            "3D render, 3D effect, shadow, drop shadow, glow, lens flare, "
            "blurry, low quality, low resolution, jpeg artifacts, compression, "
            "multiple logos, multiple icons, cluttered, busy, "
            "realistic photograph, stock photo, clip art, "
            "worst quality, ugly, deformed, disfigured"
        ),
    },
    "banner": {
        "width": 1216,
        "height": 640,
        "steps": 28,
        "cfg_scale": 7.0,
        "sampler": "dpmpp_2m",
        "scheduler": "karras",
        "checkpoint": "sdxl_base_1.0",
        "negative_prompt": (
            "rendered text, typography, letters, words, watermark, signature, "
            "blurry, out of focus, motion blur, "
            "low quality, low resolution, jpeg artifacts, pixelated, "
            "oversaturated, neon colors, garish, "
            "nsfw, nude, violent, gore, "
            "ugly face, deformed hands, extra fingers, mutated, "
            "stock photo watermark, shutterstock, getty images, "
            "worst quality, normal quality, amateur, snapshot"
        ),
    },
    "fanpage": {
        "width": 1216,
        "height": 896,
        "steps": 28,
        "cfg_scale": 7.0,
        "sampler": "dpmpp_2m",
        "scheduler": "karras",
        "checkpoint": "sdxl_base_1.0",
        "negative_prompt": (
            "inconsistent colors, mismatched style, broken layout, "
            "distorted UI elements, glitched interface, "
            "blurry, low quality, low resolution, jpeg artifacts, "
            "placeholder text, lorem ipsum, "
            "nsfw, inappropriate content, "
            "ugly, worst quality, amateur design, "
            "cluttered, messy, unaligned elements, "
            "wrong aspect ratio, cropped incorrectly"
        ),
    },
}


def get_asset_config(asset_type: str) -> dict:
    """Trả về config kỹ thuật cho loại asset. Fallback về banner nếu không tìm thấy."""
    return ASSET_CONFIGS.get(asset_type, ASSET_CONFIGS["banner"])
