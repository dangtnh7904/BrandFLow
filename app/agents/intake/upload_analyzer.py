import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate

class UploadAnalyzer:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0,
        )
        
    def extract_answers(self, text: str) -> dict:
        """
        Reads the uploaded text and tries to answer the core questions.
        """
        prompt = PromptTemplate.from_template('''
Bạn là một chuyên gia phân tích dữ liệu đầu vào.
Nhiệm vụ của bạn là đọc nội dung văn bản dưới đây (được trích xuất từ tài liệu của người dùng) và cố gắng điền vào các câu hỏi khảo sát.

CÁC CÂU HỎI VÀ ĐÁP ÁN:
1. ID: product_1
Câu hỏi: Chân dung khách hàng mục tiêu mang lại nhiều doanh thu nhất hiện tại là ai?
Đáp án có thể chọn (Checkbox - chọn nhiều):
- Giới trẻ, Gen Z thích trải nghiệm mới.
- Dân văn phòng, thu nhập ổn định.
- Gia đình, phụ huynh quan tâm đến sức khỏe/chất lượng.
- Khách hàng doanh nghiệp (B2B), ưu tiên hiệu quả.
- Khách hàng phổ thông, nhạy cảm về giá.

2. ID: product_2
Câu hỏi: Sản phẩm/dịch vụ cốt lõi của anh/chị có điểm khác biệt lớn nhất là gì?
Đáp án có thể chọn (Radio - CHỈ CHỌN 1):
- Chất lượng vượt trội, nguyên liệu/công nghệ tốt nhất.
- Giá cả cạnh tranh nhất trong phân khúc.
- Trải nghiệm dịch vụ và chăm sóc khách hàng xuất sắc.
- Thiết kế, bao bì hoặc hình ảnh thương hiệu độc đáo.
- Tiện lợi, dễ mua, dễ sử dụng.

3. ID: product_3
Câu hỏi: Kênh truyền thông hoặc bán hàng nào đang hiệu quả nhất?
Đáp án có thể chọn (Checkbox - chọn nhiều):
- Mạng xã hội (Facebook, TikTok, Instagram).
- Tìm kiếm (Google SEO, Ads).
- Sàn Thương mại điện tử (Shopee, Lazada, Tiki).
- Truyền miệng, khách hàng cũ giới thiệu.
- Điểm bán trực tiếp (Cửa hàng, mặt bằng).
- Đội ngũ Sales trực tiếp (Telesale, B2B Sales).

NỘI DUNG VĂN BẢN:
{text}

YÊU CẦU:
Dựa VÀO NỘI DUNG VĂN BẢN, hãy trả về kết quả dưới dạng JSON hợp lệ (không chứa markdown markdown block ```json).
Nếu văn bản KHÔNG chứa thông tin đủ để trả lời một câu hỏi, hãy bỏ qua ID đó (không đưa vào JSON).
Định dạng JSON yêu cầu:
{{
  "product_1": ["đáp án 1", "đáp án 2"],
  "product_2": "đáp án 1",
  "product_3": ["đáp án 1"]
}}

LƯU Ý: 
- Đối với câu hỏi Checkbox, value phải là một List (mảng) các chuỗi.
- Đối với câu hỏi Radio, value phải là một chuỗi.
- Phải copy CHÍNH XÁC text của đáp án ở trên. Không bịa ra đáp án.
        ''')
        
        # limit text to 15000 chars to avoid token limit
        chain = prompt | self.llm
        try:
            res = chain.invoke({
                "text": text[:15000]
            })
            content = res.content.strip()
            if content.startswith("```json"):
                content = content[7:-3].strip()
            if content.startswith("```"):
                content = content[3:-3].strip()
            parsed = json.loads(content)
            return parsed
        except Exception as e:
            print("Error in UploadAnalyzer:", e)
            return {}
