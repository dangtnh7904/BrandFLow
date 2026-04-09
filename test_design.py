import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

from design_agent import generate_brand_identity

def run_test():
    print("=" * 80)
    print("🚀 BẮT ĐẦU TEST: BRAND IDENTITY (3 Variants + Caching)")
    print("=" * 80)

    # Lần 1: Chạy mô phỏng không có cache sinh 3 variants
    result = generate_brand_identity(
        brand_name="Sen & Trà",
        goal="Mở chuỗi cửa hàng trà đạo hữu cơ, mang tính chữa lành tại Hà Nội",
        industry="F&B",
        target_audience="Dân văn phòng, người trẻ thích không gian yên tĩnh (Gen Z/Y)"
    )

    print("\n" + "=" * 80)
    print("📦 Output JSON (Rút gọn):")
    print(f"Logo URL: {result['logo_url']}")
    print(f"Banner URL: {result['banner_url']}")
    print(f"Fanpage Concept: {result['fanpage_concept'][:150]}...\n")

if __name__ == "__main__":
    run_test()
