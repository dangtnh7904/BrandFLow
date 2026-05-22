# Bếp Nhà Mộc - Nhận Diện Thương Hiệu (Design Agent Mock Output)

```json
{
  "brand_identity_system": {
    "logo_concept": {
      "symbol": "Hình ảnh mái nhà tranh cách điệu kết hợp với làn khói bếp cuộn thành hình bát cơm, mang đậm nét truyền thống nhưng nét vẽ tối giản, hiện đại.",
      "logotype": "Sử dụng font chữ có chân (Serif) với các nét thanh đậm mượt mà, tạo cảm giác thân thuộc, hoài cổ.",
      "color_palette": {
        "primary": ["#5C4033 (Nâu Gỗ Đậm)", "#8F9779 (Xanh Lá Úa - Trầm)"],
        "secondary": ["#F5F5DC (Be - Màu Đất Sét)", "#E2725B (Đỏ Gạch - Đất Nung)"],
        "accent": "#FFC000 (Vàng Nắng Ấm - Gợi sự ấm cúng của ánh đèn/bếp lửa)"
      }
    },
    "typography": {
      "heading": "Playfair Display (Thể hiện sự sang trọng, hoài niệm)",
      "body": "Inter hoặc Nunito (Dễ đọc, hiện đại, thân thiện)"
    },
    "imagery_guidelines": {
      "lighting": "Ánh sáng vàng ấm (Warm lighting), sử dụng kỹ thuật đổ bóng (Chiaroscuro) để tạo chiều sâu.",
      "composition": "Góc chụp từ trên xuống (Top-down) cho mâm cơm, và góc cận cảnh (Macro) cho chi tiết món ăn hoặc vân gỗ.",
      "props": "Đĩa gốm mộc, đũa tre, mâm đồng, lá chuối, khăn trải bàn vải linen thô."
    }
  },
  "behance_case_study_layout": [
    {
      "block_id": "b1_hero",
      "type": "HeroBanner",
      "content": "BẾP NHÀ MỘC - THƠM KHÓI BẾP, ẤM TÌNH NHÀ\nRebranding Case Study",
      "design_params": {
        "background": "Hình ảnh mờ ảo của mâm cơm gia đình bốc khói trong không gian ánh sáng vàng trầm.",
        "text_color": "#F5F5DC",
        "layout": "Center aligned, Typography lớn"
      }
    },
    {
      "block_id": "b2_challenge",
      "type": "TextWithImage",
      "title": "The Challenge",
      "content": "Thoát khỏi hình ảnh 'quán nhậu gia đình' bình dân để trở thành một không gian 'Mindful Dining' cao cấp nhưng vẫn mộc mạc, giữ vững tinh thần mâm cơm Việt.",
      "design_params": {
        "image_prompt": "A modern yet rustic Vietnamese restaurant interior, warm lighting, wooden furniture, cinematic, high detail, photorealistic --ar 16:9",
        "alignment": "left_text_right_image"
      }
    },
    {
      "block_id": "b3_logo_construction",
      "type": "LogoShowcase",
      "title": "The Mark",
      "content": "Sự kết hợp giữa Mái Nhà, Khói Bếp và Bát Cơm.",
      "design_params": {
        "show_grid": true,
        "grid_color": "#8F9779",
        "background": "#F5F5DC"
      }
    },
    {
      "block_id": "b4_colors_typo",
      "type": "IdentitySystem",
      "title": "Color & Typography",
      "design_params": {
        "show_hex_codes": true,
        "font_showcase": "Aa Bb Cc - Về Nhà Ăn Cơm"
      }
    },
    {
      "block_id": "b5_application_packaging",
      "type": "MockupGallery",
      "title": "Packaging & Menu",
      "design_params": {
        "mockups": [
          {"item": "Menu làm từ giấy kraft dập nổi", "prompt": "A restaurant menu made of kraft paper with embossed logo 'Bếp Nhà Mộc', sitting on a dark wooden table next to a cup of hot tea, natural warm lighting, photorealistic --ar 4:3"},
          {"item": "Hộp mang về", "prompt": "Eco-friendly takeaway food boxes for a Vietnamese restaurant, tied with jute twine, featuring minimal rustic logo, natural lighting --ar 4:3"}
        ]
      }
    },
    {
      "block_id": "b6_social_media",
      "type": "SocialMediaGrid",
      "title": "Digital Presence",
      "content": "Giao diện Instagram với tông màu trầm ấm, tập trung vào câu chuyện đằng sau mỗi món ăn.",
      "design_params": {
        "columns": 3,
        "theme": "Dark and Warm"
      }
    }
  ],
  "dalle_generation_prompts": {
    "logo": "A minimalist, rustic logo design for a traditional Vietnamese restaurant named 'Bếp Nhà Mộc'. The symbol creatively combines a thatched roof, kitchen smoke, and a rice bowl. Colors: dark wood brown, muted green, and clay beige. Vector graphic, flat design, clean white background.",
    "key_visual": "A cinematic, heartwarming scene of a traditional Vietnamese family dinner. A wooden table filled with traditional dishes like clay pot caramelized pork, crab soup, in rustic ceramic bowls. Warm, golden hour sunlight filtering through a window, casting beautiful shadows. High detail, photorealistic, 8k resolution, food photography.",
    "social_banner": "A high-end Facebook cover for a rustic Vietnamese restaurant. A beautiful dark wooden surface with a bowl of steaming rice and a pair of bamboo chopsticks resting on a ceramic holder. Elegant serif typography overlay saying 'Thơm Khói Bếp - Ấm Tình Nhà' in beige color. Warm, moody lighting, professional food photography."
  }
}
```

### [AI Design Assistant Output Logs]
**[Agent: BrandDesigner]**: Đã phân tích Brand DNA "Bếp Nhà Mộc". Xác định từ khóa thị giác cốt lõi: Mộc mạc (Rustic), Ấm áp (Warm/Cozy), Truyền thống (Traditional), Chữa lành (Healing/Mindful).
**[Agent: GuardrailChecker]**: Đã kiểm tra bảng màu. Các mã màu #5C4033, #8F9779, #F5F5DC đáp ứng tiêu chí tương phản (WCAG AA) và truyền tải đúng cảm giác tự nhiên (Earthy tones).
**[Agent: PromptEngineer]**: Đã biên dịch 3 Prompts tối ưu cho DALL-E 3 / Midjourney để tạo Logo, Key Visual và Social Banner. Đã thêm các từ khóa "cinematic", "food photography", "warm lighting" để đảm bảo chất lượng đầu ra.
**[Agent: BehanceLayoutPlanner]**: Khởi tạo thành công 6 Blocks cấu trúc trình bày Case Study chuyên nghiệp. Sẵn sàng render thành code Frontend hoặc xuất qua Figma.
