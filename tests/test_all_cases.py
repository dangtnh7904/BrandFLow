import os
import sys

# Paths
BASE_DIR = r"C:\Users\HP\OneDrive - Hanoi University of Science and Technology\BrandFLow\tests\mock_outputs"

def load_mock(filename):
    try:
        with open(os.path.join(BASE_DIR, filename), "r", encoding="utf-8") as f:
            return f.read().lower()
    except Exception as e:
        print(f"[ERROR] Khong tim thay file {filename}")
        return ""

def print_result(tc_name, condition, success_msg, fail_msg):
    if condition:
        print(f"[PASS] {tc_name}: {success_msg}")
        return 1
    else:
        print(f"[FAIL] {tc_name}: {fail_msg}")
        return 0

def test_tc1():
    print("\n--- TEST CASE 1: CONG NGHE (SaaS B2B) ---")
    content = load_mock("tc1_tech.md")
    score = 0
    score += print_result("Muc tieu", "tỷ lệ chuyển đổi" in content or "conversion rate" in content, "Tap trung toi uu ty le chuyen doi Trial-to-Paid.", "Thieu muc tieu toi uu ty le chuyen doi.")
    score += print_result("Hanh dong", "email" in content and "b2b" in content, "De xuat Email Marketing va Call B2B.", "Thieu giai phap Email/B2B Call.")
    score += print_result("Chien luoc", "đáng tin cậy" in content, "Dinh vi chuyen gia dang tin cay.", "Khong dinh vi duoc su dang tin cay.")
    return score, 3

def test_tc2():
    print("\n--- TEST CASE 2: GIAO DUC (Trung tam Anh ngu) ---")
    content = load_mock("tc2_edu.md")
    score = 0
    score += print_result("Chien luoc", ("thương hiệu nổi bật" in content or "cá nhân" in content) and "giảng viên" in content, "Nhan manh thuong hieu/giang vien hon ca nhan Founder.", "Sai dinh vi Founder.")
    score += print_result("Hanh dong", "học thử" in content and "referral" in content, "Khai thac tot Referral va su kien Hoc thu.", "Thieu giai phap Referral/Hoc thu.")
    score += print_result("Ngan sach", ("nhắm mục tiêu" in content or "targeting" in content) and "chốt sale" in content, "Chay Ads Targeting va toi uu kich ban cho Tu van vien.", "De xuat ngan sach/nguon luc khong khop.")
    return score, 3

def test_tc3():
    print("\n--- TEST CASE 3: MY PHAM (Local Brand Thuan Chay) ---")
    content = load_mock("tc3_cos.md")
    score = 0
    score += print_result("Chien luoc", "personal branding" in content or "gu thẩm mỹ" in content, "Day manh Personal Branding cho Founder.", "Thieu chien luoc xap dung hinh anh Founder.")
    score += print_result("Kiem soat KOL", "affiliate" in content or "tracking link" in content, "Su dung Affiliate/Tracking de do luong KOL.", "Khong giai quyet duoc bai toan do luong KOL.")
    score += print_result("Giu chan khach", "loyalty" in content or "mua lại" in content, "De xuat chuong trinh Loyalty tang ty le mua lai.", "Thieu giai phap Loyalty giu chan khach hang.")
    return score, 3

def test_tc4():
    print("\n--- TEST CASE 4: F&B (Quan Cafe Mo hinh Khong gian) ---")
    content = load_mock("tc4_fnb.md")
    score = 0
    score += print_result("Chien luoc", "bao bì" in content and "delivery" in content, "Mang trai nghiem khong gian dong goi vao Delivery.", "Chua ket hop duoc Khong gian va Delivery.")
    score += print_result("Hanh dong", "tối ưu gian hàng" in content or "local store" in content, "De xuat Local Store Marketing hop ly voi <10tr.", "De xuat chay Ads lang phi.")
    score += print_result("Giai quyet", "giảm giá" in content and "upsell" in content, "Dua ra giai phap giam le thuoc ma giam gia.", "Khong xu ly triet de viec phu thuoc ma giam gia.")
    return score, 3

def main():
    print(">>> BAT DAU CHAY AUTOMATION TEST CHO 4 KICH BAN BRANDFLOW <<<")
    t1_p, t1_t = test_tc1()
    t2_p, t2_t = test_tc2()
    t3_p, t3_t = test_tc3()
    t4_p, t4_t = test_tc4()
    
    total_pass = t1_p + t2_p + t3_p + t4_p
    total_tests = t1_t + t2_t + t3_t + t4_t
    
    print("\n==============================================")
    print(f"TONG KET: {total_pass}/{total_tests} Tieu chi Dat (PASSED).")
    if total_pass == total_tests:
        print("TAT CA 4 KICH BAN DEU VUOT QUA KIEM THU XUAT SAC!")
    else:
        print("CO TEST CASE FAILED. CAN REVIEW LAI OUTPUT CUA AI.")

if __name__ == "__main__":
    main()
