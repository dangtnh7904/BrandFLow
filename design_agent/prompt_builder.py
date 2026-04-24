"""
=============================================================================
design_agent/prompt_builder.py — Xây dựng prompt sinh ảnh cho từng asset
=============================================================================
Chứa 3 hàm chuyên biệt + 1 hàm dispatcher:
  - build_logo_prompt()     → Prompt cho logo icon (vector, minimalist)
  - build_banner_prompt()   → Prompt cho banner marketing (hero shot, CTA)
  - build_fanpage_prompt()  → Prompt cho Facebook fanpage mockup (cohesive)
  - build_design_prompt()   → Dispatcher: chọn hàm theo asset_type

Công thức prompt (Stable Diffusion best practice):
    [Subject & Composition] + [Style Tags] + [Color Direction]
    + [Mood / Atmosphere] + [Quality Boosters] + [Technical Specs]
=============================================================================
"""

from .config import INDUSTRY_VISUAL_SYMBOLS, INDUSTRY_BANNER_STYLE


def _resolve_industry(industry: str) -> tuple:
    """Trả về (symbols, banner_style) phù hợp với industry, fallback về General."""
    key = industry if industry in INDUSTRY_VISUAL_SYMBOLS else "General"
    return INDUSTRY_VISUAL_SYMBOLS[key], INDUSTRY_BANNER_STYLE[key]


def _resolve_style(keywords: list) -> str:
    """Nối style keywords thành chuỗi, có fallback."""
    return ", ".join(keywords) if keywords else "modern, clean, professional"


# =============================================================================
# LOGO PROMPT — Minimalist vector icon, brand personality
# =============================================================================

def build_logo_prompt(
    brand_name: str,
    design_language: dict,
    industry: str = "",
) -> str:
    """
    Build prompt sinh logo icon cho Stable Diffusion / ComfyUI.

    Đặc điểm prompt:
        - Icon-only, KHÔNG chữ, vector flat, nền trắng thuần
        - Có biểu tượng ngành hàng (tea leaf, circuit, lotus...)
        - Quality boosters: Behance, Dribbble, award-winning
        - Negative: text, 3D, gradient, complex background
    """
    colors = design_language.get("color_palette", "")
    keywords = design_language.get("style_keywords", [])
    mood = design_language.get("mood", "")
    style_str = _resolve_style(keywords)
    symbols, _ = _resolve_industry(industry)

    prompt = (
        # Subject & Composition
        f"A single minimalist logo icon for a {industry or 'modern'} brand called '{brand_name}'. "
        f"The icon creatively incorporates visual elements inspired by: {symbols}. "
        f"Centered composition on a pure white background (#FFFFFF). "
        # Style Tags
        f"Style: {style_str}, flat vector art, geometric simplification, "
        f"clean edges, single-weight line art, negative space design. "
        # Color Direction
        f"Brand color palette: {colors}. "
        f"Use maximum 2-3 colors from the palette, "
        f"one dominant color and one accent color. "
        # Mood / Brand Personality
        f"The logo should evoke: {mood}. "
        f"Convey trust, memorability, and brand personality at a glance. "
        # Quality Boosters
        f"Award-winning logo design, Behance featured, Dribbble popular shot, "
        f"vector illustration, SVG-ready, scalable to any size. "
        # Technical Specs
        f"Ultra-sharp edges, no gradients, no shadows, no 3D effects, "
        f"no text, no letters, no typography, icon mark only. "
        f"Masterpiece, best quality, 4K resolution, professional graphic design."
    )

    print(f"   🖼️ [LOGO] Prompt đã build ({len(prompt)} chars)")
    return prompt


# =============================================================================
# BANNER PROMPT — Marketing-focused, CTA feeling, hero image
# =============================================================================

def build_banner_prompt(
    brand_name: str,
    design_language: dict,
    goal: str = "",
    industry: str = "",
    target_audience: str = "",
) -> str:
    """
    Build prompt sinh banner marketing cho Stable Diffusion / ComfyUI.

    Đặc điểm prompt:
        - Hero shot composition, rule of thirds
        - Negative space cho text overlay (CTA area)
        - Leading lines hướng mắt về CTA
        - Cinematic color grading, editorial quality
    """
    colors = design_language.get("color_palette", "")
    typography = design_language.get("typography", "")
    keywords = design_language.get("style_keywords", [])
    mood = design_language.get("mood", "")
    style_str = _resolve_style(keywords)
    _, banner_style = _resolve_industry(industry)

    prompt = (
        # Subject & Scene
        f"A stunning wide-format marketing banner for '{brand_name}' ({industry or 'brand'} industry). "
        f"Campaign objective: {goal or 'brand awareness and customer acquisition'}. "
        f"Target audience: {target_audience or 'modern urban consumers'}. "
        # Hero Visual & Composition
        f"Hero shot composition with {banner_style}. "
        f"Rule of thirds layout with the hero element placed on the left two-thirds, "
        f"leaving clean negative space on the right side for headline text overlay. "
        f"Subtle gradient overlay fading from left to right for text readability. "
        # Style Tags
        f"Visual style: {style_str}, editorial quality, magazine-grade composition. "
        # Color & Atmosphere
        f"Color palette: {colors}. "
        f"Dominant mood: {mood}. "
        f"Atmospheric depth with soft bokeh or ambient lighting in background. "
        # CTA Design Elements
        f"The composition should create visual urgency and emotional connection, "
        f"guiding the viewer's eye toward the text space (call-to-action area). "
        f"Include subtle visual cues like leading lines or light direction pointing right. "
        # Typography Space
        f"Typography area clearly defined: top-right or center-right quadrant reserved "
        f"for headline ({typography}). "
        # Quality Boosters
        f"Professional advertising photography, award-winning ad campaign visual, "
        f"commercial quality, cinematic color grading. "
        # Technical Specs
        f"Wide format 1200x628 aspect ratio, ultra high resolution, 4K, "
        f"sharp focus on subject, no watermark, no text rendered in image. "
        f"Masterpiece, best quality, photorealistic."
    )

    print(f"   🖼️ [BANNER] Prompt đã build ({len(prompt)} chars)")
    return prompt


# =============================================================================
# FANPAGE PROMPT — Cohesive social media identity system
# =============================================================================

def build_fanpage_prompt(
    brand_name: str,
    design_language: dict,
    industry: str = "",
) -> str:
    """
    Build prompt sinh Facebook fanpage mockup cho Stable Diffusion / ComfyUI.

    Đặc điểm prompt:
        - Realistic Facebook layout (cover + profile + post grid)
        - Cohesive color system xuyên suốt mọi element
        - 3 content types khác nhau trong post grid
        - UI/UX showcase quality
    """
    colors = design_language.get("color_palette", "")
    typography = design_language.get("typography", "")
    keywords = design_language.get("style_keywords", [])
    mood = design_language.get("mood", "")
    style_str = _resolve_style(keywords)
    _, banner_style = _resolve_industry(industry)

    prompt = (
        # Subject & Layout
        f"A professional Facebook fanpage visual identity mockup for '{brand_name}', "
        f"a {industry or 'modern'} brand. "
        f"Show a realistic Facebook page layout viewed on a desktop browser, including: "
        # Cover Photo Area
        f"1) A beautiful cover photo banner (851x315px proportion) at the top "
        f"featuring {banner_style}, with the brand's color palette ({colors}) "
        f"integrated harmoniously into the scene. "
        # Profile Photo Area
        f"2) A circular profile picture area (bottom-left of cover) showing "
        f"a clean logo mark on a solid brand-colored background. "
        # Post Grid
        f"3) Below the cover: a sample grid of 3 recent posts showing "
        f"diverse content types — one product/service photo, one quote card "
        f"with brand colors, and one lifestyle/behind-the-scenes shot. "
        f"Each post maintains the same visual language and color temperature. "
        # Design System Consistency
        f"Overall aesthetic: {style_str}. "
        f"Color scheme strictly following: {colors}. "
        f"The entire page feels cohesive — every element shares the same "
        f"mood ({mood}), typography style ({typography}), and color temperature. "
        # Quality Boosters
        f"Professional social media design mockup, UI/UX showcase, "
        f"Behance case study presentation quality. "
        # Technical Specs
        f"Clean UI rendering, realistic browser chrome, high fidelity mockup, "
        f"no placeholder text, visually complete. "
        f"Best quality, 4K resolution, sharp details, professional design portfolio."
    )

    print(f"   🖼️ [FANPAGE] Prompt đã build ({len(prompt)} chars)")
    return prompt


# =============================================================================
# DISPATCHER — Chọn hàm build prompt theo asset_type
# =============================================================================

def build_design_prompt(
    asset_type: str,
    brand_name: str,
    design_language: dict,
    goal: str = "",
    industry: str = "",
    target_audience: str = "",
) -> str:
    """
    Dispatcher: chọn hàm build prompt phù hợp theo asset_type.

    Args:
        asset_type:  "logo" | "banner" | "fanpage"
        (các tham số khác truyền xuống hàm con)

    Returns:
        str — Prompt tiếng Anh tối ưu cho Stable Diffusion / ComfyUI.
    """
    if asset_type == "logo":
        return build_logo_prompt(brand_name, design_language, industry)

    elif asset_type == "banner":
        return build_banner_prompt(
            brand_name, design_language, goal, industry, target_audience
        )

    elif asset_type == "fanpage":
        return build_fanpage_prompt(brand_name, design_language, industry)

    else:
        # Fallback generic
        style_str = _resolve_style(design_language.get("style_keywords", []))
        colors = design_language.get("color_palette", "")
        mood = design_language.get("mood", "")
        prompt = (
            f"A professional brand visual asset for '{brand_name}', "
            f"visual style: {style_str}. "
            f"Color palette: {colors}. "
            f"Overall mood and atmosphere: {mood}. "
            f"Clean, polished, commercial quality. "
            f"Masterpiece, best quality, 4K resolution, professional graphic design."
        )
        print(f"   🖼️ [{asset_type.upper()}] Prompt đã build ({len(prompt)} chars)")
        return prompt
