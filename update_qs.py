import json
import re

# Read the file
with open('frontend/src/components/workspace/phase1/industryQuestions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# The content is a TS export, so it's roughly "export const industryQuestions: Record<string, any> = { ... };"
# Let's extract the JSON part
json_str = content.replace('export const industryQuestions: Record<string, any> = ', '').strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

product_questions = [
    {
        "id": "product_1",
        "question": "Chân dung khách hàng mục tiêu mang lại nhiều doanh thu nhất hiện tại là ai?",
        "type": "checkbox",
        "options": [
            "Giới trẻ, Gen Z thích trải nghiệm mới.",
            "Dân văn phòng, thu nhập ổn định.",
            "Gia đình, phụ huynh quan tâm đến sức khỏe/chất lượng.",
            "Khách hàng doanh nghiệp (B2B), ưu tiên hiệu quả.",
            "Khách hàng phổ thông, nhạy cảm về giá."
        ]
    },
    {
        "id": "product_2",
        "question": "Sản phẩm/dịch vụ cốt lõi của anh/chị có điểm khác biệt lớn nhất là gì?",
        "type": "radio",
        "options": [
            "Chất lượng vượt trội, nguyên liệu/công nghệ tốt nhất.",
            "Giá cả cạnh tranh nhất trong phân khúc.",
            "Trải nghiệm dịch vụ và chăm sóc khách hàng xuất sắc.",
            "Thiết kế, bao bì hoặc hình ảnh thương hiệu độc đáo.",
            "Tiện lợi, dễ mua, dễ sử dụng."
        ]
    },
    {
        "id": "product_3",
        "question": "Kênh truyền thông hoặc bán hàng nào đang hiệu quả nhất?",
        "type": "checkbox",
        "options": [
            "Mạng xã hội (Facebook, TikTok, Instagram).",
            "Tìm kiếm (Google SEO, Ads).",
            "Sàn Thương mại điện tử (Shopee, Lazada, Tiki).",
            "Truyền miệng, khách hàng cũ giới thiệu.",
            "Điểm bán trực tiếp (Cửa hàng, mặt bằng).",
            "Đội ngũ Sales trực tiếp (Telesale, B2B Sales)."
        ]
    }
]

for ind in data.keys():
    # deep copy the questions to modify IDs
    import copy
    p_qs = copy.deepcopy(product_questions)
    for q in p_qs:
        q['id'] = f"{ind}_{q['id']}"
    data[ind]['product'] = p_qs

new_content = "export const industryQuestions: Record<string, any> = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n"

with open('frontend/src/components/workspace/phase1/industryQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated successfully!")
