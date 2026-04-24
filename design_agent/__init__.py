"""
=============================================================================
design_agent/__init__.py — Package Entry Point
=============================================================================
Re-export các hàm public để giữ backward compatibility.

Import hiện tại trong codebase:
    from design_agent import generate_brand_identity   ← workflow_graph.py, main.py
    from design_agent import build_design_prompt        ← (nếu cần)
    from design_agent import call_image_api             ← (nếu cần)

Tất cả đều hoạt động bình thường sau khi refactor.

Cấu trúc package:
    design_agent/
    ├── __init__.py          ← File này (re-exports)
    ├── config.py            ← Constants, schemas, industry mappings
    ├── dna_extractor.py     ← Trích xuất Design Language từ Brand DNA
    ├── prompt_builder.py    ← Build prompt cho logo / banner / fanpage
    ├── image_client.py      ← Gọi API sinh ảnh (ComfyUI / n8n)
    └── orchestrator.py      ← Pipeline tổng: generate_brand_identity()
=============================================================================
"""

# Hàm chính — được gọi từ workflow_graph.py và main.py
from .orchestrator import generate_brand_identity

# Hàm phụ — export để các module khác có thể dùng trực tiếp
from .prompt_builder import (
    build_design_prompt,
    build_logo_prompt,
    build_banner_prompt,
    build_fanpage_prompt,
)
from .image_client import call_image_api
from .dna_extractor import extract_design_language
from .config import (
    DesignLanguage,
    BrandIdentityOutput,
    INDUSTRY_VISUAL_SYMBOLS,
    INDUSTRY_BANNER_STYLE,
    get_asset_config,
    get_fallback_design_language,
)

__all__ = [
    # Core
    "generate_brand_identity",
    # Prompt building
    "build_design_prompt",
    "build_logo_prompt",
    "build_banner_prompt",
    "build_fanpage_prompt",
    # Image API
    "call_image_api",
    # DNA extraction
    "extract_design_language",
    # Config & schemas
    "DesignLanguage",
    "BrandIdentityOutput",
    "INDUSTRY_VISUAL_SYMBOLS",
    "INDUSTRY_BANNER_STYLE",
    "get_asset_config",
    "get_fallback_design_language",
]
