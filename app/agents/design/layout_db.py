from typing import List, Dict, Any

# Mocked RAG Database for Layout Matching
# Khớp ngữ cảnh (ngành nghề) với một cấu trúc JSON Layout chuẩn Behance.
# Cấu trúc: Mỗi industry trả về 1 list các block skeletons.

LAYOUT_DATABASE = {
    "F&B": [
        {
            "id": "hero_01",
            "type": "HeroBlock",
            "props": {
                "title": "",
                "subtitle": "",
                "background_color": "#FF5722",
                "text_color": "#FFFFFF",
                "image_prompt": "A mouth-watering high-end cinematic food photography of a signature dish, dark moody lighting, vivid colors, 16:9, highly detailed, no text",
                "image_url": ""
            }
        },
        {
            "id": "mission_01",
            "type": "MissionBlock",
            "props": {
                "headline": "",
                "body_text": "",
                "accent_color": "#FF5722"
            }
        },
        {
            "id": "palette_01",
            "type": "PaletteBlock",
            "props": {
                "colors": [], # LLM will fill 3-5 hex codes
                "description": ""
            }
        },
        {
            "id": "gallery_01",
            "type": "GalleryBlock",
            "props": {
                "images": [
                    {"prompt": "A modern cozy coffee shop interior design, warm lighting, people chatting, cinematic, 16:9", "url": ""},
                    {"prompt": "Close up of an artisan barista pouring latte art, hyperrealistic, 16:9", "url": ""}
                ]
            }
        }
    ],
    "Tech B2B": [
        {
            "id": "hero_01",
            "type": "GridHeroBlock",
            "props": {
                "title": "",
                "subtitle": "",
                "theme": "dark", # dark or light
                "primary_color": "#0EA5E9",
                "image_prompt": "Abstract 3D glowing nodes connecting in a digital network, dark blue background, futuristic tech, 16:9",
                "image_url": ""
            }
        },
        {
            "id": "dna_01",
            "type": "DNAFeaturesBlock",
            "props": {
                "features": [] # LLM fills list of dicts: {"title": "", "desc": "", "icon": ""}
            }
        },
        {
            "id": "typo_01",
            "type": "TypographyBlock",
            "props": {
                "heading_font": "",
                "body_font": "",
                "rationale": ""
            }
        },
        {
            "id": "mockup_01",
            "type": "AppMockupBlock",
            "props": {
                "app_name": "",
                "description": "",
                "screen_prompt": "A sleek modern B2B SaaS dashboard UI design on a laptop screen floating in dark void, minimalist, glowing blue accents, 16:9",
                "screen_url": ""
            }
        }
    ],
    "Default": [
        {
            "id": "hero_01",
            "type": "HeroBlock",
            "props": {
                "title": "",
                "subtitle": "",
                "background_color": "#111827",
                "text_color": "#F9FAFB",
                "image_prompt": "Abstract modern corporate branding background, minimal geometry, 16:9",
                "image_url": ""
            }
        },
        {
            "id": "story_01",
            "type": "MissionBlock",
            "props": {
                "headline": "",
                "body_text": "",
                "accent_color": "#3B82F6"
            }
        },
        {
            "id": "palette_01",
            "type": "PaletteBlock",
            "props": {
                "colors": [],
                "description": ""
            }
        },
        {
            "id": "typo_01",
            "type": "TypographyBlock",
            "props": {
                "heading_font": "",
                "body_font": "",
                "rationale": ""
            }
        }
    ]
}

def get_layout_template(industry: str) -> List[Dict[str, Any]]:
    # Simple matching engine
    industry_lower = industry.lower()
    if "f&b" in industry_lower or "thực phẩm" in industry_lower or "nhà hàng" in industry_lower:
        return LAYOUT_DATABASE["F&B"]
    elif "tech" in industry_lower or "công nghệ" in industry_lower or "phần mềm" in industry_lower or "saas" in industry_lower:
        return LAYOUT_DATABASE["Tech B2B"]
    else:
        return LAYOUT_DATABASE["Default"]
