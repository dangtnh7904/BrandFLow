# Bếp Nhà Mộc - Nhận Diện Thương Hiệu (Design Agent Mock Output)

```json
{
  "brand_identity_system": {
    "core_concept": "Hơi Thở Của Mộc (The Breath of Wood) - Giao thoa giữa di sản Việt Nam và tinh thần tối giản hiện đại (Modern Minimalism).",
    "logo_concept": {
      "symbol": "Hình ảnh mái nhà tranh cách điệu kết hợp với làn khói bếp cuộn thành hình bát cơm, sử dụng tỷ lệ vàng (Golden Ratio) để tạo sự cân bằng tuyệt đối. Nét vẽ dứt khoát, độ dày viền (stroke) hiện đại, không rườm rà.",
      "logotype": "Sử dụng typography custom dựa trên cấu trúc Serif cổ điển, nhưng bo tròn các góc (rounded edges) tạo cảm giác thân thiện, organic và mộc mạc.",
      "color_palette": {
        "primary": [
          {"name": "Nâu Trầm Hương (Agarwood Brown)", "hex": "#4A3525", "usage": "Logo chính, Text tiêu đề"},
          {"name": "Xanh Lá Chuối (Banana Leaf Green)", "hex": "#768A5E", "usage": "Nền điểm nhấn, Nút CTA"}
        ],
        "secondary": [
          {"name": "Be Đất Sét (Clay Beige)", "hex": "#F4EFEA", "usage": "Màu nền chủ đạo, Background UI"},
          {"name": "Đỏ Gạch Nung (Terracotta Red)", "hex": "#C85A48", "usage": "Icon, Điểm nhấn cảnh báo/Khuyến mãi"}
        ],
        "psychology": "Bảng màu tạo phản ứng tâm lý tĩnh tại, thư giãn, khơi gợi cảm giác thèm ăn tự nhiên và sự tin cậy."
      }
    },
    "typography": {
      "heading": "Playfair Display (Sang trọng, Di sản, Hoài niệm)",
      "body": "Plus Jakarta Sans (Độ đọc cao trên màn hình digital, hiện đại, tối giản)",
      "caption": "Cursive script nhẹ nhàng cho các quote/câu chuyện thương hiệu."
    },
    "sensory_guidelines": {
      "photography": "Chụp dưới ánh sáng tự nhiên khuếch tán (Diffused natural light) hoặc ánh sáng vàng ấm (Warm tungsten). Góc chụp Macro cận cảnh tôn vinh kết cấu thực phẩm (Food texture) và vân gỗ. Tone màu Film hoài cổ (Vintage film grain).",
      "materials": "Sử dụng chất liệu thật cho các ấn phẩm in: Giấy Kraft tái chế, giấy mỹ thuật có gân mộc, dập nổi logo không in mực (Blind Embossing) để tối giản hóa bao bì."
    }
  },
  "behance_case_study_layout": [
    {
      "block_id": "b1_hero",
      "type": "HeroBanner_Cinematic",
      "content": "BẾP NHÀ MỘC\nThơm Khói Bếp - Ấm Tình Nhà\nA Mindful Dining Rebranding Experience",
      "design_params": {
        "background_video_loop": "Cinematic shot cận cảnh giọt sương trên lá sen, chuyển cảnh sang khói bếp mờ ảo bay lên từ mâm cơm bằng gốm sứ mộc.",
        "text_color": "#F4EFEA",
        "layout": "Center aligned, Minimalist"
      }
    },
    {
      "block_id": "b2_the_problem",
      "type": "BeforeAfter_Split",
      "title": "Vượt Khỏi Vùng An Toàn",
      "content": "Từ một quán ăn gia đình mờ nhạt đến một không gian chữa lành độc bản. Chúng tôi tái định vị Bếp Nhà Mộc để chạm đến trái tim của giới trẻ thành thị.",
      "design_params": {
        "left_image": "Hình ảnh quán cũ lộn xộn",
        "right_image": "Bản sketch 3D không gian mới với ánh sáng mood-lighting ấm áp",
        "overlay": "Gradient Fade"
      }
    },
    {
      "block_id": "b3_logo_construction",
      "type": "LogoGrid_Showcase",
      "title": "Biểu Tượng Của Sự Gắn Kết",
      "content": "Sự kết hợp hoàn hảo giữa Mái Nhà (Nơi trở về), Khói Bếp (Sự ấm áp) và Bát Cơm (Nuôi dưỡng).",
      "design_params": {
        "show_golden_ratio_grid": true,
        "grid_color": "#768A5E",
        "background": "#F4EFEA"
      }
    },
    {
      "block_id": "b4_packaging_o2o",
      "type": "MockupGallery_Premium",
      "title": "Bao Bì Bền Vững & Giao Hàng (O2O Delivery)",
      "content": "Thiết kế bao bì mang đi (Takeaway) sử dụng 100% vật liệu phân hủy sinh học (bã mía, hộp giấy kraft). Mang trải nghiệm 'chữa lành' từ nhà hàng về tận bàn ăn của khách hàng.",
      "design_params": {
        "mockups": [
          {"item": "Hộp Bento Bã Mía Premium", "prompt": "Premium sugarcane bagasse eco-friendly bento box for a Vietnamese restaurant, wrapped with a minimalist paper sleeve featuring the 'Bếp Nhà Mộc' logo. Placed on a rustic wooden table with soft window light, photorealistic, elegant --ar 16:9"},
          {"item": "Túi giấy Kraft & Ly nước nắp giấy", "prompt": "Minimalist kraft paper delivery bag and paper cup with paper lid, subtle terracotta red accents, standing on a concrete texture background, studio lighting, hyper-realistic --ar 4:3"}
        ]
      }
    },
    {
      "block_id": "b5_digital_experience",
      "type": "UIUX_Showcase",
      "title": "Trải Nghiệm Số (Digital Touchpoints)",
      "content": "Giao diện Zalo Mini App cho Loyalty Program và Đặt bàn. Tối giản hóa luồng người dùng (User Flow) với UI mượt mà, tôn vinh hình ảnh món ăn.",
      "design_params": {
        "device_mockups": "iPhone 15 Pro Titanium",
        "screens": ["Home/Menu", "Booking/Table Selection", "Loyalty Rewards"],
        "ui_style": "Neumorphism kết hợp với hình ảnh Flat, sử dụng màu Nâu Trầm Hương làm chủ đạo."
      }
    },
    {
      "block_id": "b6_social_media_grid",
      "type": "SocialMedia_Aesthetic",
      "title": "Câu Chuyện Mạng Xã Hội",
      "content": "Một Instagram feed mang đậm tính điện ảnh và thơ ca, không chỉ bán đồ ăn, mà bán cảm xúc.",
      "design_params": {
        "grid_layout": "3x3 Seamless Grid",
        "theme": "Moody, Warm, Nostalgic Film"
      }
    }
  ],
  "dalle_generation_prompts": {
    "interior_concept": "A high-end rustic Vietnamese restaurant interior named 'Bếp Nhà Mộc'. Dark wooden furniture, terracotta tile floor, warm amber pendant lighting casting soft shadows. A large bonsai tree in the center. Minimalist, wabi-sabi aesthetic, zen atmosphere, photorealistic, architectural digest style, 8k, octane render --ar 16:9",
    "key_visual": "A cinematic, eye-level close-up of a traditional Vietnamese clay pot with caramelized pork (thịt kho tộ), sizzling with subtle steam. Placed on a rustic linen cloth over a dark oak table. In the blurred background, warm bokeh lights and a hint of a vintage tea set. Michelin star food photography, moody lighting, highly detailed --ar 16:9",
    "app_ui": "A sleek, minimalist UI design for a restaurant loyalty mobile app. Featured screen shows a beautiful high-res photo of traditional Vietnamese food at the top, below is a clean white section with elegant serif typography for the dish name 'Bếp Nhà Mộc', and a green call-to-action button 'Đặt Bàn Ngay'. Dribbble style, clean, modern, UX/UI, high resolution --ar 9:16"
  }
}
```

### [AI Design Studio Assistant Logs]
**[Agent: BrandStrategist_Design]**: Đã định vị xong Visual Concept "Hơi Thở Của Mộc". Phân tích đối thủ cho thấy hầu hết dùng màu Đỏ/Vàng rực (phong cách Fast Food). Việc chúng ta đi ngược lại với Nâu Trầm và Xanh Lá sẽ tạo ra sự khác biệt thị giác (Visual Differentiation) tuyệt đối, giúp SME nổi bật ngay lập tức.
**[Agent: UX_UI_Engineer]**: Đã thêm block Digital Experience (Zalo Mini App). Với các doanh nghiệp F&B SME, Retention (Tỷ lệ quay lại) là sống còn. UI được thiết kế để đẩy mạnh tính năng "Booking" và "Tích điểm", giảm ma sát (Friction) trong trải nghiệm người dùng.
**[Agent: Packaging_Specialist]**: Đã tích hợp các giải pháp bao bì Eco-friendly (Bã mía, Kraft). Theo báo cáo thị trường, khách hàng Gen Z sẵn sàng trả thêm 10-15% cho bao bì bền vững. Đây là điểm chốt sales (USP) cực mạnh khi Pitching demo cho Chủ nhà hàng.
**[Agent: PromptArchitect]**: Cập nhật các Prompt Midjourney/DALL-E với các từ khóa chuyên ngành như "wabi-sabi", "architectural digest style", "Michelin star food photography" để kết quả render đạt chuẩn Commercial Grade (Cấp độ thương mại), đủ sức "Wow" khách hàng ngay từ slide đầu tiên.
