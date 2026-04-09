# BrandFlow Design Agent Pipeline 🎨

Tài liệu này mô tả chi tiết tính năng Tự động sinh tài sản thương hiệu (Logo, Banner, Fanpage Concept), cách thức hoạt động, cách chạy test, và những lưu ý quan trọng dành cho team phát triển trong tương lai.

## 1. Mô tả hoạt động (Overview)
Luồng tính năng hiện tại vận hành theo quy trình Tự động (End-to-End) bao gồm 5 bước:
1.  **Truy xuất Memory (ChromaDB):** Lấy lại nền tảng Core Values của thương hiệu (nếu có).
2.  **Trích xuất Design DNA (Groq LLM):** Đọc nội dung thương hiệu và nội suy ra Bảng màu (Hex codes), Typography, Keywords, và Mood chủ đạo.
3.  **Prompt Builder:** Tự động ghép nối Design DNA với công thức tối ưu hóa Prompt (dành riêng cho logo, banner, fanpage) nhằm tạo ra các yêu cầu mô tả ảnh chính xác bằng tiếng Anh.
4.  **Image Generation & Heuristics (Sinh ảnh song song + Chấm điểm):** 
    - Gọi API song song để sinh ra **3 Variants (biến thể)** cho cùng một thiết kế giúp đưa ra nhiều lựa chọn.
    - Caching cơ sở: Mỗi URL ảnh được hash dựa trên prompt để tiết kiệm tài nguyên nếu chạy lại.
    - Chấm điểm (Heuristics Scoring): Phân tích điểm Clarity & Align để chọn ngẫu nhiên Variant có logic đúng nhất.
5.  **Fallback thông minh (Pollinations):** Nếu môi trường API ảnh chính (như n8n) bị sập, hệ thống sẽ tự động dùng "Fallback API" (Pollinations.ai) sinh ảnh Public theo đường link trực tiếp (Bằng độ dài 800 chars) để luồng của Frontend không bị chặn ngang.

---

## 2. Những thay đổi vừa được thực hiện (Changelog)
- Khai tử file `design_agent.py` nguyên khối cũ (gần 700 dòng gộp chung).
- **Trở thành cấu trúc Package (`/design_agent/*`)**: Phân tách rõ ràng Separation of Concerns:
    - `orchestrator.py`: Điều phối luồng và thuật toán chấm điểm Variant.
    - `prompt_builder.py`: Bộ máy tạo prompt chuyên sâu.
    - `image_client.py`: Client giao tiếp với Webhook sinh ảnh n8n, tích hợp Caching Local (`./cache/design_images.json`) và cơ chế Fallback public.
    - `dna_extractor.py`: Logic gọi LLM (Groq Llama 3) trích xuất dữ liệu thô ra cấu trúc Design Language.
    - `config.py`: Các thông số thiết lập cứng (style, config ảnh 1024x1024...).
- **Tích hợp file Test Độc Lập:** Tạo script `test_design.py` để test nhanh phần core backend mà không bị vướng bận FastApi/React.

---

## 3. Hướng dẫn chạy Test tính năng tạo Logo
Để một Coder/Tester kiểm duyệt backend:

1. Đứng tại thư mục cấu hình gốc (`BrandFLow`).
2. Mở Terminal và gõ:
   ```bash
   python test_design.py
   ```
3.  Để xóa bộ nhớ đêm (ép hệ thống chạy gọi API vẽ hình thay vì trả Cache HIT 0 giây):
    ```bash
    python -c "from design_agent.image_client import clear_image_cache; clear_image_cache()"; python test_design.py
    ```
4. Quan sát cửa sổ Console để đọc log API và click vào URL nhận được (Logo, Banner) in ra ở cuối (Output JSON).

---

## 4. Những phần CHƯA LÀM ĐƯỢC ở phía n8n (Known Issues / TODOs)
Hệ thống Python Backend đã hoàn chỉnh 100%, nhưng tiến trình hiện tại bị chặn ở hạ tầng **n8n orchestration** (Server sinh ảnh):

1. **Lỗi Quota của OpenAI (DALL-E 3):** Node sinh ảnh OpenAI trong n8n đang trả về lỗi `Billing hard limit has been reached` do tài khoản không còn quỹ tín dụng (Tiền). 
   - **Cách fix:** Điền nạp tối thiểu $5 vào openai API, HOẶC thay "Node DALL-E" trong n8n bằng "Node Stability AI" (nền tảng free base API).
2. **Setup Cấu hình Node Webhook n8n:** Webhook Endpoint phải chờ sinh ảnh xong mới trả lại kết quả. 
   - **Cách fix (tại n8n UI):** Ở cấu hình cục Webhook, mục **Respond** phải được setup chính xác thành *`Using 'Respond to Webhook' Node`*. Nếu không, n8n sẽ báo chuỗi `{"message": "Workflow started"}` và gãy luồng Json Python.

---

## 5. Dành cho người đến sau (Lưu ý)
- Mọi logic thêm/sửa prompt AI đều nằm gọn tại file `design_agent/prompt_builder.py`.
- Lệnh gọi Endpoint chính cho FrontEnd React sử dụng là: `POST /api/v1/design/generate`.
- Để đổi từ n8n sang API Stable Diffusion thực tế hoặc ComfyUI sau này, Coder chỉ cần cấu hình ở hàm `_call_api_uncached` trong `design_agent/image_client.py` (chỉnh lại schema `payload` tương thích là xong).
- Biến môi trường duy nhất quy định điểm đến này nằm tại: `DESIGN_WEBHOOK_URL` trong `.env`.
