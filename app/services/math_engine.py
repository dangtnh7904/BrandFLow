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

    def calculate_customer_rule_score(self, plan: dict, criteria_weights: dict = None) -> dict:
        """
        Tính điểm cơ sở (Rule Score) cho kế hoạch dựa trên các yếu tố định lượng.
        """
        if criteria_weights is None:
            criteria_weights = {
                "kpi_clarity": 35,
                "feasibility": 25,
                "strategic_coherence": 20,
                "target_audience_fit": 10,
                "brand_dna_fit": 10
            }
        
        score = 0
        details = {}
        
        # 1. KPI Clarity
        tactics = plan.get("tactics", {}).get("tactics_7ps", [])
        if tactics:
            has_kpi = sum(1 for t in tactics if t.get("kpi") and len(t.get("kpi", "")) > 5)
            kpi_score = (has_kpi / len(tactics)) * criteria_weights["kpi_clarity"]
        else:
            kpi_score = 0
        details["kpi_clarity"] = kpi_score
        score += kpi_score
        
        # 2. Feasibility
        details["feasibility"] = criteria_weights["feasibility"]
        score += criteria_weights["feasibility"]
        
        # 3. Strategic Coherence
        if plan.get("strategy", {}).get("ansoff_matrix_choice"):
            details["strategic_coherence"] = criteria_weights["strategic_coherence"]
            score += criteria_weights["strategic_coherence"]
        else:
            details["strategic_coherence"] = 0
            
        # 4 & 5. Audience & Brand DNA
        details["target_audience_fit"] = criteria_weights["target_audience_fit"]
        details["brand_dna_fit"] = criteria_weights["brand_dna_fit"]
        score += criteria_weights["target_audience_fit"] + criteria_weights["brand_dna_fit"]
        
        return {
            "rule_score": round(score, 2),
            "details": details
        }

    def project_unit_economics(self, total_budget: int, avg_cpc: float, cvr: float, aov: float, gross_margin_pct: float, retention_rate: float) -> dict:
        """
        C-LEVEL METRICS: Tính toán Unit Economics (CAC, LTV, Payback).
        """
        if avg_cpc <= 0 or cvr <= 0:
            return {"error": "Invalid inputs"}
            
        # Cost of Customer Acquisition
        cost_per_lead = avg_cpc / cvr
        sales_cvr = 0.2 # Giả sử tỷ lệ chốt sales từ lead là 20%
        cac = cost_per_lead / sales_cvr
        
        # New Customers Acquired
        new_customers = int(total_budget / cac) if cac > 0 else 0
        
        # Lifetime Value
        gross_profit_per_order = aov * (gross_margin_pct / 100)
        churn_rate = 1.0 - (retention_rate / 100)
        if churn_rate <= 0: churn_rate = 0.1 # Cap at 90% retention
        
        ltv = gross_profit_per_order / churn_rate
        
        ltv_cac_ratio = round(ltv / cac, 2) if cac > 0 else 0
        
        # Trạng thái sức khỏe
        health_status = "Nguy hiểm (Đốt tiền)" if ltv_cac_ratio < 1.0 else "Ổn định" if ltv_cac_ratio < 3.0 else "Tuyệt vời (Scale ngay)"
        
        return {
            "CAC": int(cac),
            "LTV": int(ltv),
            "LTV_CAC_Ratio": ltv_cac_ratio,
            "New_Customers": new_customers,
            "Total_Revenue_Generated": new_customers * aov,
            "Gross_Profit": int(new_customers * ltv),
            "Health_Status": health_status
        }

    def simulate_monte_carlo_roi(self, budget: int, expected_cvr: float, expected_aov: float, gross_margin: float, iterations: int = 1000) -> dict:
        """
        C-LEVEL METRICS: Monte Carlo Simulation để mô phỏng rủi ro (Risk Modeling).
        Sử dụng phân phối chuẩn (Normal Distribution) để tạo 1000 kịch bản ngẫu nhiên.
        """
        import numpy as np
        
        # Tính toán dựa trên độ lệch chuẩn 20%
        cvr_std = expected_cvr * 0.2
        aov_std = expected_aov * 0.2
        
        # Sinh mảng ngẫu nhiên
        cvr_sims = np.random.normal(expected_cvr, cvr_std, iterations)
        cvr_sims = np.clip(cvr_sims, a_min=0.001, a_max=None) # Không thể âm
        
        aov_sims = np.random.normal(expected_aov, aov_std, iterations)
        
        # Giả định cost per traffic cố định (VD: 5000 VND/click)
        cpc = 5000
        traffic = budget / cpc
        
        # Tính doanh thu và lợi nhuận cho 1000 kịch bản
        revenue_sims = traffic * cvr_sims * aov_sims
        profit_sims = revenue_sims * (gross_margin / 100) - budget
        
        roi_sims = (profit_sims / budget) * 100
        
        # Phân tích tứ phân vị (Percentiles)
        worst_case = np.percentile(roi_sims, 10) # 10th percentile
        base_case = np.median(roi_sims)          # 50th percentile
        best_case = np.percentile(roi_sims, 90)  # 90th percentile
        
        prob_of_loss = (roi_sims < 0).sum() / iterations * 100
        
        return {
            "Worst_Case_ROI": round(worst_case, 2),
            "Base_Case_ROI": round(base_case, 2),
            "Best_Case_ROI": round(best_case, 2),
            "Probability_of_Loss_Percent": round(prob_of_loss, 2),
            "Recommendation": "Rủi ro quá cao, cân nhắc lại kịch bản CVR" if prob_of_loss > 30 else "Dự án an toàn để giải ngân"
        }


