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
