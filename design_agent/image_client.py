"""
=============================================================================
design_agent/image_client.py — Gọi API sinh ảnh bên ngoài + Caching
=============================================================================
Gọi webhook ComfyUI / n8n để sinh ảnh từ prompt.
Hiện tại chạy ở chế độ SIMULATION (trả placeholder URL).

CACHING:
  - Hash prompt + asset config → deterministic cache key
  - Nếu key đã tồn tại → trả URL cached ngay lập tức (0ms)
  - Nếu chưa → gọi API → lưu kết quả vào cache
  - Cache lưu trên disk tại ./cache/design_images.json
  - Xóa cache: gọi clear_image_cache() hoặc xóa file

Khi tích hợp thật:
  1. Set biến môi trường DESIGN_WEBHOOK_URL
  2. Bỏ comment block requests.post(...) trong hàm _call_api_uncached()
=============================================================================
"""

import hashlib
import json
import os
import uuid
from pathlib import Path

from .config import DEFAULT_WEBHOOK_URL, get_asset_config


# =============================================================================
# CACHE LAYER — File-based cache cho image URLs
# =============================================================================

# Thư mục cache (tạo tự động nếu chưa có)
CACHE_DIR = Path(os.getenv("DESIGN_CACHE_DIR", "./cache"))
CACHE_FILE = CACHE_DIR / "design_images.json"


def _load_cache() -> dict:
    """Đọc cache từ disk. Trả dict rỗng nếu file chưa tồn tại hoặc bị lỗi."""
    try:
        if CACHE_FILE.exists():
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        print(f"   ⚠️ [CACHE] Lỗi đọc cache ({e}), khởi tạo cache mới.")
    return {}


def _save_cache(cache: dict) -> None:
    """Ghi cache xuống disk. Tạo thư mục nếu chưa có."""
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except IOError as e:
        print(f"   ⚠️ [CACHE] Lỗi ghi cache ({e}), bỏ qua.")


def _generate_cache_key(prompt: str, asset_type: str, asset_config: dict) -> str:
    """
    Sinh cache key deterministic từ prompt + config.

    Thuật toán:
        1. Nối prompt + asset_type + các tham số config quan trọng (width, height, steps, cfg_scale)
        2. Hash bằng SHA-256
        3. Trả về hex string 16 ký tự đầu (đủ unique, dễ đọc)

    Tại sao chỉ hash một số config fields?
        - negative_prompt, checkpoint thay đổi hiếm → bỏ qua để giảm cache miss
        - width, height, steps, cfg_scale ảnh hưởng trực tiếp đến output → phải hash
    """
    key_components = (
        f"{prompt}"
        f"|{asset_type}"
        f"|{asset_config.get('width', 0)}"
        f"|{asset_config.get('height', 0)}"
        f"|{asset_config.get('steps', 0)}"
        f"|{asset_config.get('cfg_scale', 0)}"
    )
    hash_hex = hashlib.sha256(key_components.encode("utf-8")).hexdigest()
    return hash_hex[:16]


def clear_image_cache() -> int:
    """
    Xóa toàn bộ image cache.

    Returns:
        int — Số lượng entry đã xóa.
    """
    cache = _load_cache()
    count = len(cache)
    if CACHE_FILE.exists():
        CACHE_FILE.unlink()
    print(f"   🗑️ [CACHE] Đã xóa {count} entry cached.")
    return count


def get_cache_stats() -> dict:
    """Trả về thống kê cache: số entry, kích thước file, path."""
    cache = _load_cache()
    file_size = CACHE_FILE.stat().st_size if CACHE_FILE.exists() else 0
    return {
        "entries": len(cache),
        "file_size_bytes": file_size,
        "cache_path": str(CACHE_FILE.absolute()),
    }


# =============================================================================
# MAIN FUNCTION — Gọi API với caching
# =============================================================================

def call_image_api(
    prompt: str,
    asset_type: str,
    webhook_url: str = None,
    use_cache: bool = True,
) -> str:
    """
    Gọi API sinh ảnh với caching layer.

    Logic:
        1. Sinh cache key từ hash(prompt + config)
        2. Kiểm tra cache → nếu hit, trả URL ngay (0ms, 0 API cost)
        3. Nếu miss → gọi API thật (hoặc simulation)
        4. Lưu kết quả vào cache cho lần sau

    Args:
        prompt:       Prompt mô tả hình ảnh (output từ prompt_builder)
        asset_type:   Loại asset ("logo", "banner", "fanpage")
        webhook_url:  URL webhook tùy chỉnh. Mặc định lấy từ config.
        use_cache:    Bật/tắt caching. Mặc định True.

    Returns:
        str — URL ảnh (cached hoặc mới sinh).
    """
    asset_config = get_asset_config(asset_type)
    cache_key = _generate_cache_key(prompt, asset_type, asset_config)

    # ── CHECK CACHE ──
    if use_cache:
        cache = _load_cache()
        if cache_key in cache:
            cached_url = cache[cache_key]["url"]
            print(f"   ⚡ [{asset_type.upper()}] CACHE HIT → {cached_url}")
            return cached_url

    # ── CACHE MISS → Gọi API ──
    image_url = _call_api_uncached(prompt, asset_type, asset_config, webhook_url)

    # ── SAVE TO CACHE ──
    if use_cache:
        cache = _load_cache()
        cache[cache_key] = {
            "url": image_url,
            "asset_type": asset_type,
            "prompt_preview": prompt[:100] + "..." if len(prompt) > 100 else prompt,
        }
        _save_cache(cache)
        print(f"   💾 [{asset_type.upper()}] Đã cache (key: {cache_key})")

    return image_url


# =============================================================================
# INTERNAL — Gọi API thật (không cache)
# =============================================================================

def _call_api_uncached(
    prompt: str,
    asset_type: str,
    asset_config: dict,
    webhook_url: str = None,
) -> str:
    """
    Gọi API sinh ảnh thực tế (ComfyUI / n8n webhook).
    Hàm này KHÔNG có logic cache — chỉ gọi API và trả URL.

    Workflow thực tế khi tích hợp ComfyUI:
        1. Gửi POST: { "prompt", "negative_prompt", "config" }
        2. ComfyUI queue job → Stable Diffusion SDXL sinh ảnh
        3. Webhook trả về: { "image_url": "https://cdn.example.com/xxx.png" }
    """
    url = webhook_url or DEFAULT_WEBHOOK_URL

    # Payload gửi cho webhook
    payload = {
        "prompt": prompt,
        "negative_prompt": asset_config["negative_prompt"],
        "asset_type": asset_type,
        "request_id": str(uuid.uuid4()),
        "config": asset_config,
    }

    print(f"   📡 [{asset_type.upper()}] Gọi Image API: {url}")

    # =====================================================================
    # PRODUCTION MODE: Thực hiện HTTP POST gọi API (n8n / ComfyUI webhooks)
    # =====================================================================
    try:
        import requests
        import random
        # Thử gọi n8n Webhook theo URL đã cấu hình
        # Tăng timeout lên 20s vì OpenAI DALL-E chạy khá lâu (khoảng 10-15s)
        response = requests.post(url, json=payload, timeout=25)
        response.raise_for_status()
        
        # Bóc tách JSON
        result = response.json()
        image_url = result.get("image_url", "")
        
        # Rất nhiều trường hợp n8n trả về dạng mảng list: [{"image_url": "..."}]
        if not image_url and isinstance(result, list) and len(result) > 0:
            image_url = result[0].get("image_url", "")
            
        if image_url:
            print(f"   ✅ [{asset_type.upper()}] Ảnh thật n8n: {image_url}")
            return image_url
        else:
            raise ValueError(f"Khởi chạy n8n thành công nhưng n8n không trả về 'image_url'. Nội dung thực tế: {result}")
            
    except Exception as e:
        print(f"   ⚠️ [{asset_type.upper()}] n8n lỗi: {e}")
        print(f"   🚀 Chuyển sang API Public (Pollinations.ai) dự phòng...")
        
        import urllib.parse
        import random
        safe_prompt = urllib.parse.quote(prompt[:800])
        w = asset_config.get("width", 1024)
        h = asset_config.get("height", 1024)
        seed = random.randint(1, 999999)
        real_image_url = f"https://image.pollinations.ai/prompt/{safe_prompt}?width={w}&height={h}&seed={seed}&nologo=true"
        print(f"   ✅ [{asset_type.upper()}] Đã sinh ảnh gốc public: {real_image_url}")
        return real_image_url
