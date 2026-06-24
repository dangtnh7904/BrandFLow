import os
import pandas as pd
from datetime import datetime

class MathEngine:
    """
    Module 4: External Math Engine.
    Nhận Ngân sách tổng (VND) và Danh sách tỷ trọng (%) từ Agent 3.
    Tính toán phân bổ tiền thật và xuất báo cáo ra file Excel.
    """
    def __init__(self, output_dir: str = "./outputs"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        
    def calculate_allocations(self, total_budget: int, agent3_allocations: list) -> list:
        """
        Tính tiền thực tế từ % cho từng hạng mục.
        Hàm xử lý cho Agent 3 CFO Review.
        agent3_allocations format: [{"category": "Name", "percentage": 30.0}, ...]
        """
        results = []
        total_percent = 0.0
        
        for item in agent3_allocations:
            cat = item.get("category", "Unknown")
            pct = item.get("percentage", 0.0)
            total_percent += pct
            
            allocated_vnd = int(total_budget * (pct / 100.0))
            results.append({
                "Hạng mục": cat,
                "Tỷ trọng (%)": f"{pct}%",
                "Ngân sách dự kiến (VNĐ)": allocated_vnd
            })
            
        # Kiểm tra logic %
        print(f"🧮 [MATH ENGINE] Tổng tỷ trọng: {total_percent}%")
        
        return results
        
    def export_excel(self, campaign_name: str, calculated_data: list) -> str:
        """Xuất DataFrame ra file Excel."""
        if not calculated_data:
            print("⚠️ [MATH ENGINE] Không có dữ liệu để xuất Excel.")
            return ""
            
        df = pd.DataFrame(calculated_data)
        
        # Thêm dòng tổng để checksum
        total_vnd = sum([item["Ngân sách dự kiến (VNĐ)"] for item in calculated_data])
        df.loc[len(df)] = ["TỔNG CỘNG", "100%", total_vnd]
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_name = "".join([c if c.isalnum() else "_" for c in campaign_name])
        filename = f"Budget_{safe_name}_{timestamp}.xlsx"
        filepath = os.path.join(self.output_dir, filename)
        
        try:
            df.to_excel(filepath, index=False)
            print(f"✅ [MATH ENGINE] Đã xuất thành công file báo cáo: {filepath}")
            return filepath
        except Exception as e:
            print(f"🔴 [MATH ENGINE] Lỗi khi lưu Excel: {e}")
            return ""

    def calculate_swot_csfs(self, csfs_data: list) -> dict:
        """
        Tính điểm Cạnh tranh Tương đối (Relative Competitive Strength) 
        dựa trên các Yếu tố Thành công Then chốt (CSFs).
        csfs_data list of dict: [{"factor_name": "Price", "weight_percentage": 30.0, "score_1_to_10": 8}]
        """
        results = []
        total_weight = 0.0
        total_score = 0.0
        
        for index, item in enumerate(csfs_data):
            weight = float(item.get("weight_percentage", 0.0))
            score = int(item.get("score_1_to_10", 0))
            
            # Tính toán weighted score cho từng factor
            weighted_score = (weight / 100.0) * score
            
            total_weight += weight
            total_score += weighted_score
            
            results.append({
                "factor_name": item.get("factor_name", f"Factor {index+1}"),
                "weight_percentage": weight,
                "score_1_to_10": score,
                "weighted_score": round(weighted_score, 2)
            })
            
        print(f"🧮 [MATH ENGINE - SWOT] Tổng trọng số: {total_weight}% | Điểm cạnh tranh tổng: {round(total_score, 2)} / 10")
        
        return {
            "csfs_details": results,
            "total_relative_strength": round(total_score, 2),
            "is_weight_valid": abs(total_weight - 100.0) < 0.1 # Kiểm tra tổng trọng số có xấp xỉ 100% không
        }

    def calculate_market_gap(self, target_revenue: int, baseline_revenue: int, natural_growth_rate: float = 0.0) -> dict:
        """
        Tính Khoảng trống Doanh thu (Gap Analysis).
        Gap = Mục tiêu - (Doanh thu hiện tại + Mức tăng trưởng tự nhiên)
        """
        projected_baseline = int(baseline_revenue * (1 + natural_growth_rate / 100.0))
        gap_value = target_revenue - projected_baseline
        
        is_achievable = gap_value <= 0
        
        print(f"🧮 [MATH ENGINE - GAP]")
        print(f"   Target: {target_revenue:,} VND")
        print(f"   Projected Baseline (chưa có plan mới): {projected_baseline:,} VND")
        print(f"   GAP cần bù: {gap_value:,} VND")
        
        return {
            "target_revenue": target_revenue,
            "projected_baseline": projected_baseline,
            "gap_value": gap_value,
            "is_achievable_without_action": is_achievable,
            "advice": "Tập trung chiến lược Ansoff để lấp đầy GAP." if gap_value > 0 else "Baseline đủ đạt mục tiêu, có thể giảm ngân sách."
        }

