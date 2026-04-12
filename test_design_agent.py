import sys
import os

# Mock the environment to allow running the test
from dotenv import load_dotenv
load_dotenv()

from app.schemas.schemas import DesignGenerateRequest
from app.agents.design.design_agent import BrandDesigner

def test():
    req = DesignGenerateRequest(**
    {
  "industry": "Nước tăng lực Thể thao Mạo hiểm",
  "core_usps": [
    "Nhân 3 lần năng lượng ngay lập tức",
    "Công thức không gây ép tim"
  ],
  "target_audience_insights": [
    "Nam thanh niên 16-28 tuổi, đam mê tốc độ, hiphop, trượt ván",
    "Thích sự nổi loạn, cá tính mạnh, không bị gò bó"
  ],
  "tone_of_voice": "Gào thét, Bùng nổ, Hầm hố, Cực cháy",
  "strict_rules": [
    "KHÔNG DÙNG HÌNH TRÒN VÀ ĐƯỜNG CONG MỀM MẠI",
    "PHẢI SỬ DỤNG ĐỘ TƯƠNG PHẢN CỰC CAO (High Contrast/Neon)",
    "BẮT BUỘC mang phong cách Grunge, bụi bặm hoặc rách nát"
  ]
}

)
    
    designer = BrandDesigner()
    result = designer.generate_design_prompts(req)
    import json
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    test()
