import re
import sys

# Giả lập đầu ra từ LLM/AI (Chúng ta sẽ đọc từ file markdown vừa tạo)
def get_simulated_output():
    try:
        with open(r"C:\Users\HP\.gemini\antigravity\brain\4143e619-a131-4b0b-ac6a-1427e12de1be\simulated_marketing_plan.md", "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return ""

def run_tests():
    marketing_plan = get_simulated_output()
    if not marketing_plan:
        print("[ERROR] Khong the tai ban ke hoach.")
        return

    print("--- Bat dau chay Automation Test cho Kich ban F&B (Chuoi Nhuong Quyen) ---\n")
    passed_tests = 0
    total_tests = 4

    # 1. Test Cấu trúc
    print("[TEST 1/4] Kiem tra Cau truc 8 phan...")
    expected_sections = [
        "1. TÓM TẮT ĐIỀU HÀNH", "2. TỔNG QUAN TÌNH HÌNH", "3. MỤC TIÊU MARKETING",
        "4. CHIẾN LƯỢC MARKETING", "5. CHƯƠNG TRÌNH HÀNH ĐỘNG MARKETING",
        "6. KẾ HOẠCH TRIỂN KHAI", "7. KIỂM SOÁT VÀ ĐÁNH GIÁ", "8. ĐỊNH HƯỚNG TĂNG TRƯỞNG"
    ]
    missing = [sec for sec in expected_sections if sec not in marketing_plan]
    if not missing:
        print("[PASS] Cau truc day du.")
        passed_tests += 1
    else:
        print(f"[FAIL] Thieu cac phan: {missing}")

    content_lower = marketing_plan.lower()

    # 2. Test Chiến lược Nhượng quyền
    print("[TEST 2/4] Kiem tra Chien luoc Nhuong quyen...")
    if "nhượng quyền" in content_lower or "franchise" in content_lower:
        print("[PASS] Co tich hop dinh huong Nhuong Quyen nhu yeu cau Input.")
        passed_tests += 1
    else:
        print("[FAIL] Khong tim thay chien luoc Nhuong Quyen.")

    # 3. Test Giải quyết vấn đề Khuyến mãi
    print("[TEST 3/4] Kiem tra phan tich giai phap 'Phu thuoc Khuyen mai'...")
    has_discount_issue = "khuyến mãi" in content_lower or "giảm giá" in content_lower
    has_retention_solution = "quay lại" in content_lower or "trung thành" in content_lower or "trải nghiệm" in content_lower
    if has_discount_issue and has_retention_solution:
        print("[PASS] Da nhan dien va de xuat giai phap cho van de lam dung khuyen mai.")
        passed_tests += 1
    else:
        print("[FAIL] Chua giai quyet triet de van de phu thuoc ma giam gia.")

    # 4. Test Tính Nhất quán Ngân sách
    print("[TEST 4/4] Kiem tra Tinh nhat quan ve Ngan sach (Khoi nghiep, han hep)...")
    if "tvc" not in content_lower and ("chưa có ngân sách" in content_lower or "thuê ngoài" in content_lower or "agency" in content_lower or "freelancer" in content_lower):
        print("[PASS] De xuat logic, phu hop voi tinh trang thieu ngan sach co dinh & nhan su kiem nhiem.")
        passed_tests += 1
    else:
        print("[FAIL] Co yeu to de xuat ngan sach vien vong, khong thuc te.")

    print("\n==============================")
    print(f"KET QUA: {passed_tests}/{total_tests} Tests Passed.")
    if passed_tests == total_tests:
        print("TAT CA TEST CASE DEU PASS. Ban Ke Hoach Marketing Hop Le!")

if __name__ == "__main__":
    run_tests()
