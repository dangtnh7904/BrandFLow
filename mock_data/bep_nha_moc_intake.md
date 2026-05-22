# Bếp Nhà Mộc - Phân Tích Dữ Liệu Đầu Vào (Intake Module Mock Output)

```json
{
  "document_analysis": {
    "source_file": "BepNhaMoc_BrandFlow.docx",
    "status": "COMPLETED",
    "extracted_entities": {
      "brand_name": "Bếp Nhà Mộc",
      "industry": "F&B (Ẩm thực & Đồ uống)",
      "current_pain_points": [
        "Doanh thu đi ngang sau 3 năm hoạt động.",
        "Hình ảnh thương hiệu bị đánh đồng với 'quán nhậu bình dân'.",
        "Khách hàng chủ yếu là người trung niên, thiếu vắng tệp Gen Y và Gen Z."
      ],
      "unique_selling_propositions": [
        "Sử dụng 100% nguyên liệu hữu cơ (Organic).",
        "Công thức nấu ăn gia truyền 3 đời.",
        "Không gian quán là nhà gỗ cổ cải tạo."
      ]
    },
    "market_context": {
      "competitors": [
        "Quán Bụi",
        "Cục Gạch Quán",
        "Secret Garden"
      ],
      "trend_analysis": "Xu hướng 'Mindful Dining' (Ăn uống chánh niệm) và 'Nostalgia Marketing' (Marketing hoài niệm) đang tăng trưởng mạnh mẽ ở nhóm khách hàng 22-35 tuổi tại các đô thị lớn."
    }
  },
  "knowledge_graph_nodes": [
    {"source": "Bếp Nhà Mộc", "relation": "HAS_CORE_VALUE", "target": "Nguyên liệu hữu cơ"},
    {"source": "Bếp Nhà Mộc", "relation": "NEEDS_REBRANDING_FOR", "target": "Tệp khách hàng Gen Y, Gen Z"},
    {"source": "Thực đơn hiện tại", "relation": "LACKS", "target": "Sự kể chuyện (Storytelling) hấp dẫn"},
    {"source": "Không gian quán", "relation": "IS_A", "target": "Nhà gỗ cổ chữa lành"}
  ],
  "swot_analysis": {
    "strengths": ["Công thức độc quyền", "Không gian có sẵn chất mộc", "Nguyên liệu sạch, chuẩn VietGAP"],
    "weaknesses": ["Nhận diện thương hiệu mờ nhạt", "Marketing truyền thống, thiếu sự hiện diện trên Digital", "Packaging (bao bì) mang về còn sơ sài"],
    "opportunities": ["Gen Z đang tìm kiếm các không gian 'chữa lành' và hoài niệm", "TikTok là kênh bùng nổ traffic dễ dàng cho F&B có không gian đẹp"],
    "threats": ["Sự cạnh tranh gay gắt từ các chuỗi nhà hàng truyền thống được đầu tư bài bản", "Chi phí nguyên liệu hữu cơ tăng cao làm giảm biên lợi nhuận"]
  }
}
```

### [AI Intake Agent Logs]
**[Agent: DocumentParser]**: Đã đọc và trích xuất thành công nội dung từ `BepNhaMoc_BrandFlow.docx`. Dung lượng 62KB. Đã làm sạch các ký tự rác và định dạng bảng biểu.
**[Agent: NLP_Analyzer]**: Phát hiện sự mất cân đối giữa "Chất lượng sản phẩm" (Rất cao) và "Định vị thương hiệu" (Bình dân). Đề xuất tái cấu trúc (Rebranding) lên phân khúc Trung - Cao cấp (Mid-High end).
**[Agent: KnowledgeGraphBuilder]**: Đã lập bản đồ tri thức (Knowledge Graph) với 45 nodes và 120 edges, liên kết dữ liệu của Bếp Nhà Mộc với các xu hướng F&B hiện tại trên thị trường. Sẵn sàng truyền dữ liệu cho hệ thống RAG Memory.
**[Agent: SWOT_Generator]**: Tổng hợp phân tích SWOT hoàn tất. Chuyển tiếp kết quả cho Orchestrator để lập kế hoạch tổng thể.
