# Bếp Nhà Mộc - Phân Tích Dữ Liệu Đầu Vào (Intake Module Mock Output)

```json
{
  "document_analysis": {
    "source_file": "BepNhaMoc_BusinessProfile_2026.pdf",
    "status": "COMPLETED_WITH_DEEP_INSIGHTS",
    "business_health": {
      "revenue_trend": "Stagnant (Đi ngang ở mức 1.2 tỷ VNĐ/tháng trong 18 tháng qua)",
      "profit_margin": "15% (Thấp hơn mức trung bình ngành F&B 22%)",
      "customer_acquisition_cost_cac": "Cao (Khoảng 250,000 VNĐ/khách mới do phụ thuộc vào khuyến mãi)"
    },
    "extracted_entities": {
      "brand_name": "Bếp Nhà Mộc",
      "industry": "F&B (Casual Dining - Ẩm thực Truyền thống)",
      "current_pain_points": [
        "Định vị thương hiệu mờ nhạt, bị khách hàng đánh đồng với 'quán nhậu bình dân' hoặc 'quán cơm phần'.",
        "Tệp khách hàng bị lão hóa (chủ yếu >45 tuổi), thiếu vắng khách hàng Gen Y, Gen Z có sẵn sàng chi trả cao.",
        "Tỷ lệ lấp đầy (Occupancy Rate) các ngày trong tuần chỉ đạt 35%, cuối tuần đạt 80%.",
        "Chưa khai thác được tệp khách hàng online và Delivery (GrabFood, ShopeeFood) hiệu quả do bao bì kém thẩm mỹ."
      ],
      "unique_selling_propositions": [
        "Chuỗi cung ứng nguyên liệu khép kín: 100% nguyên liệu chuẩn Organic từ nông trại liên kết.",
        "Công thức ẩm thực di sản 3 đời, không sử dụng bột ngọt (No MSG).",
        "Không gian kiến trúc nhà gỗ cổ Bắc Bộ nguyên bản, có giá trị văn hóa và check-in cao."
      ]
    },
    "market_context": {
      "competitors": [
        {"name": "Quán Bụi", "threat_level": "High", "advantage": "Nhận diện thương hiệu mạnh, vị trí đắc địa"},
        {"name": "Secret Garden", "threat_level": "Medium", "advantage": "Mô hình rooftop thu hút giới trẻ và khách du lịch"},
        {"name": "Cục Gạch Quán", "threat_level": "High", "advantage": "Định vị cao cấp, khách nước ngoài đông"}
      ],
      "macro_trend_analysis": "Xu hướng 'Mindful Dining' (Ăn uống chánh niệm), 'Eat Clean' và 'Nostalgia Marketing' (Marketing hoài niệm) đang tăng trưởng 45% YoY ở nhóm khách hàng 22-35 tuổi tại các đô thị lớn. Tiềm năng khai thác mô hình O2O (Online-to-Offline) qua Zalo Mini App để tăng tỷ lệ quay lại (Retention Rate)."
    }
  },
  "knowledge_graph_nodes": [
    {"source": "Bếp Nhà Mộc", "relation": "HAS_CORE_VALUE", "target": "Nguyên liệu hữu cơ & Không bột ngọt", "weight": 0.95},
    {"source": "Bếp Nhà Mộc", "relation": "NEEDS_REBRANDING_FOR", "target": "Tệp khách hàng Gen Y, Gen Z thu nhập khá", "weight": 0.90},
    {"source": "Khách hàng Gen Z", "relation": "SEEKS", "target": "Không gian chữa lành & Trải nghiệm kể chuyện (Storytelling)", "weight": 0.85},
    {"source": "Vận hành hiện tại", "relation": "BOTTLENECK", "target": "Marketing truyền thống, thiếu Digital Presence", "weight": 0.88}
  ],
  "swot_analysis": {
    "strengths": [
      "Công thức ẩm thực di sản độc quyền, chất lượng sản phẩm xuất sắc.",
      "Cơ sở vật chất có sẵn (nhà gỗ cổ) mang đậm tính thẩm mỹ 'Rustic', tiết kiệm chi phí decor.",
      "Chuỗi cung ứng nguyên liệu xanh ổn định, kiểm soát được COGS (Giá vốn hàng bán)."
    ],
    "weaknesses": [
      "Brand Identity (Bộ nhận diện) lỗi thời, chắp vá, làm giảm giá trị cảm nhận (Perceived Value) của khách hàng.",
      "Khung giờ thấp điểm (Off-peak hours) vắng khách, gây lãng phí chi phí vận hành.",
      "Bao bì Take-away/Delivery sơ sài, làm hỏng trải nghiệm món ăn khi giao đi."
    ],
    "opportunities": [
      "Nhu cầu tìm kiếm không gian 'chữa lành' giữa trung tâm thành phố của giới trẻ đang bùng nổ.",
      "Tận dụng Short-video (TikTok, Reels) để làm Food Review ASMR và Storytelling dễ dàng viral với chi phí thấp.",
      "Phát triển các set menu 'Corporate Lunch' (Trưa văn phòng cao cấp) để lấp đầy khung giờ vắng khách."
    ],
    "threats": [
      "Sự cạnh tranh gay gắt từ các chuỗi F&B có nguồn vốn lớn, liên tục đổi mới concept.",
      "Chi phí mặt bằng tại trung tâm tăng cao hàng năm gây áp lực lên tỷ suất lợi nhuận.",
      "Rủi ro khủng hoảng truyền thông mạng xã hội nếu chất lượng dịch vụ không đồng đều."
    ]
  }
}
```

### [AI Intake Agent Logs]
**[Agent: DataIngestion]**: Đã trích xuất dữ liệu đa nguồn: `BepNhaMoc_BusinessProfile_2026.pdf` (65 pages), `Financial_Report_Q1_2026.xlsx`, và 500+ lượt đánh giá trên Google Maps. Áp dụng OCR và NLP Model tiên tiến.
**[Agent: NLP_Sentiment_Analyzer]**: Phân tích cảm xúc khách hàng (Sentiment Analysis) trên Google Reviews: 85% khen ngợi chất lượng món ăn (Positive), nhưng 60% phàn nàn về không gian hơi tối và nhận diện thương hiệu 'nhà quê' (Negative/Neutral). Đề xuất Rebranding toàn diện.
**[Agent: MarketIntelligence]**: Phát hiện "khoảng trống thị trường" (Market Gap) ở phân khúc Casual Dining truyền thống kết hợp không gian chữa lành. Dự báo tiềm năng tăng trưởng doanh thu 35% nếu tái định vị thành công.
**[Agent: KnowledgeGraphBuilder]**: Đã lập bản đồ tri thức với 150 nodes và 420 edges, lượng hóa mối quan hệ giữa các điểm chạm thương hiệu (Touchpoints) và hành trình khách hàng (Customer Journey). Sẵn sàng chuyển giao cho Orchestrator.
