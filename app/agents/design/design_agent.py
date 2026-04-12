import sys
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from app.schemas.schemas import DesignGenerateRequest, DesignOutput, DesignReviseRequest
from app.agents.design.image_client import DalleClient
import asyncio

class BrandDesigner:
    """
    Agent chuyên biên dịch Brand DNA thành ngôn ngữ thiết kế (Visual Language)
    và sinh Prompt Text-to-Image tiêu chuẩn cho DALL-E / Midjourney.
    """
    
    def __init__(self):
        # Sử dụng cấu hình LLM giống với hệ thống hiện tại
        self.llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
        self.output_parser = JsonOutputParser(pydantic_object=DesignOutput)
        
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", 
             """Bạn là Giám đốc Nghệ thuật (Art Director) chuyên nghiệp.
Nhiệm vụ của bạn là đọc "Brand DNA" của khách hàng, sau đó:
1. Tổng hợp ra Ngôn ngữ thị giác (Mã màu HEX, Hình khối, Cảm giác).
2. Viết 3 câu lệnh (Prompt) TIẾNG ANH siêu chi tiết dành cho DALL-E 3 hoặc Midjourney để vẽ: Logo, Banner, và Fanpage Avatar.

LUẬT QUAN TRỌNG KHI VIẾT PROMPT:
- KHÔNG BAVO GIỜ chứa chữ viết (text) bên trong hình ảnh vì AI hay giất chính tả. Ngoại lệ: Nếu thực sự phải có, hãy yêu cầu "no text layout", "blank space for copy". (Doanh nghiệp: {industry}).
- Banner phải có tỷ lệ 16:9 (aspect ratio 16:9).
- BẢO ĐẢM 100% tuân thủ các quy tắc cấm kỵ (Strict Rules). Nếu có quy định cấm màu nào, cấm chi tiết nào, hãy thêm rào cản vào prompt.

CHỈ TRẢ VỀ CHUỖI JSON HỢP LỆ THEO ĐỊNH DẠNG SAU, KHÔNG XUẤT RA BẤT KỲ CHỮ NÀO KHÁC BÊN NGOÀI JSON:
{format_instructions}
"""),
            ("human", 
             """Brand DNA của khách hàng:
Ngành hàng: {industry}
USPs cốt lõi: {core_usps}
Khách hàng mục tiêu: {audience}
Giọng điệu (Tone): {tone}
Các Luật Bắt Buộc (Strict Rules - KHÔNG ĐƯỢC LÀM TRÁI): {rules}

Dựa vào thông tin trên, hãy suy luận ra Visual Language và sinh Prompt thiết kế thật chuyên nghiệp.""")
        ])
        
    def generate_design_prompts(self, request: DesignGenerateRequest) -> dict:
        """
        Dịch DNA sang Visual Language và Prompts. Cấy ngầm (Inject) các rules vào Negative Format.
        """
        # Quy hoạch strict rules
        formatted_rules = "\n".join([f"- {rule}" for rule in request.strict_rules]) if request.strict_rules else "Không có ràng buộc đặc biệt."
        
        chain = self.prompt_template | self.llm | self.output_parser
        
        try:
            print(f"🎨 [Brand Designer] Đang suy diễn ngôn ngữ thiết kế cho ngành {request.industry}...")
            result = chain.invoke({
                "industry": request.industry,
                "core_usps": ", ".join(request.core_usps),
                "audience": ", ".join(request.target_audience_insights),
                "tone": request.tone_of_voice,
                "rules": formatted_rules,
                "format_instructions": self.output_parser.get_format_instructions()
            })
            
            # Post-processing: Ép các Strict Rules vào đuôi Prompt để chắc chắn DALL-E lắng nghe (Guardrails)
            guardrails_suffix = ""
            if request.strict_rules:
                guardrails_suffix = " CRITICAL CONSTRAINTS (DO NOT VIOLATE): " + " & ".join(request.strict_rules)
            
            # Append guardrails to the prompts explicitly outside of LLM to ensure hard boundary
            if guardrails_suffix:
                result["logo_prompt"] = f"{result['logo_prompt']} | {guardrails_suffix}"
                result["banner_prompt"] = f"{result['banner_prompt']} | {guardrails_suffix}"
                result["fanpage_avatar_prompt"] = f"{result['fanpage_avatar_prompt']} | {guardrails_suffix}"
            
            print(f"   ✅ [Brand Designer] Biên dịch thiết kế thành công!")
            return {
                "status": "success",
                "data": result
            }
            
        except Exception as e:
            print(f"   🔴 [Brand Designer] Lỗi trong quá trình suy luận thiết kế: {e}")
            return {
                "status": "error",
                "message": str(e)
            }

    async def generate_final_assets(self, request: DesignGenerateRequest) -> dict:
        """
        Thực thi toàn bộ pipeline: Sinh Prompt (LLM) -> Gọi DALL-E (OpenAI) sinh ảnh.
        """
        # Bước 1: Sinh Prompt
        prompt_result = self.generate_design_prompts(request)
        if prompt_result.get("status") == "error":
            return prompt_result
            
        data = prompt_result["data"]
        
        # Bước 2: Khởi tạo client DALL-E và chạy đồng thời 3 tasks
        client = DalleClient()
        
        logo_task = client.generate_image(data["logo_prompt"], size="1024x1024", quality="standard")
        # DALL-E 3 hỗ trợ các size 1024x1024, 1024x1792, or 1792x1024
        banner_task = client.generate_image(data["banner_prompt"], size="1792x1024", quality="standard")
        avatar_task = client.generate_image(data["fanpage_avatar_prompt"], size="1024x1024", quality="standard")
        
        print("🚀 [Brand Designer] Đang gửi 3 request song song tới DALL-E 3...")
        logo_url, banner_url, avatar_url = await asyncio.gather(logo_task, banner_task, avatar_task)
        
        data["logo_url"] = logo_url
        data["banner_url"] = banner_url
        data["avatar_url"] = avatar_url
        
        print("✅ [Brand Designer] Hoàn tất quá trình sinh thiết kế bằng DALL-E 3!")
        
        return {
            "status": "success",
            "data": data
        }

    def revise_design_prompts(self, request: DesignReviseRequest) -> dict:
        """
        Dựa vào Output cũ và Feedback của khách hàng để sinh ra bộ Prompt mới.
        """
        revise_prompt = ChatPromptTemplate.from_messages([
            ("system", 
             """Bạn là Giám đốc Nghệ thuật (Art Director) đang nhận Phản hồi (Feedback) từ khách hàng để sửa lại bộ nhận diện.
Bạn được cung cấp bộ "Visual Language" và các "Prompts" đã tạo trước đó, cùng với ĐÓNG GÓP của khách.
Nhiệm vụ của bạn:
1. Sửa lại Visual Language (nếu cần thiết dựa trên góp ý của khách).
2. Viết lại 3 câu lệnh (Prompt) TIẾNG ANH cho Logo, Banner, Fanpage Avatar tuân thủ đúng định hướng mới.

LUẬT QUAN TRỌNG KHI VIẾT PROMPT:
- KHÔNG BAO GIỜ chứa chữ viết (text) bên trong hình ảnh. 
- Banner phải có tỷ lệ 16:9.
- LUÔN LUÔN tuân thủ các quy tắc cấm kỵ (Strict Rules) gốc của thương hiệu, cộng thêm quy tắc khách mới đưa ra trong feedback (nếu có).

CHỈ TRẢ VỀ CHUỖI JSON HỢP LỆ THEO ĐỊNH DẠNG SAU:
{format_instructions}
"""),
            ("human", 
             """--- DNA GỐC ---
Brand DNA: {dna}

--- KẾT QUẢ CŨ ĐÃ TẠO ---
Kết quả thiết kế cũ: {old_output}

--- PHẢN HỒI MỚI CỦA KHÁCH HÀNG ---
Góp ý (Feedback): {feedback}

Hãy đóng vai Art Director, tiếp thu góp ý trên và đưa ra bộ Visual Language cùng Prompts mới hoàn hảo hơn.""")
        ])
        
        chain = revise_prompt | self.llm | self.output_parser
        
        try:
            print(f"🔄 [Brand Designer] Đang phân tích feedback của khách: '{request.user_feedback}'...")
            result = chain.invoke({
                "dna": str(request.original_request.dict()),
                "old_output": str(request.original_output.dict()),
                "feedback": request.user_feedback,
                "format_instructions": self.output_parser.get_format_instructions()
            })
            
            # Post-processing: Ép Strict Rules vào
            guardrails_suffix = ""
            if request.original_request.strict_rules:
                guardrails_suffix = " CRITICAL CONSTRAINTS (DO NOT VIOLATE): " + " & ".join(request.original_request.strict_rules)
            
            if guardrails_suffix:
                result["logo_prompt"] = f"{result['logo_prompt']} | {guardrails_suffix}"
                result["banner_prompt"] = f"{result['banner_prompt']} | {guardrails_suffix}"
                result["fanpage_avatar_prompt"] = f"{result['fanpage_avatar_prompt']} | {guardrails_suffix}"
            
            print(f"   ✅ [Brand Designer] Cập nhật Prompt thành công!")
            return {
                "status": "success",
                "data": result
            }
            
        except Exception as e:
            print(f"   🔴 [Brand Designer] Lỗi trong quá trình sửa đổi: {e}")
            return {
                "status": "error",
                "message": str(e)
            }

    async def revise_final_assets(self, request: DesignReviseRequest) -> dict:
        """
        Thực thi pipeline sửa đổi: Revision Prompt (LLM) -> Gọi DALL-E (OpenAI) sinh ảnh lại.
        """
        prompt_result = self.revise_design_prompts(request)
        if prompt_result.get("status") == "error":
            return prompt_result
            
        data = prompt_result["data"]
        
        client = DalleClient()
        
        logo_task = client.generate_image(data["logo_prompt"], size="1024x1024", quality="standard")
        banner_task = client.generate_image(data["banner_prompt"], size="1792x1024", quality="standard")
        avatar_task = client.generate_image(data["fanpage_avatar_prompt"], size="1024x1024", quality="standard")
        
        print("🚀 [Brand Designer] Đang gửi yêu cầu vẽ lại tới DALL-E 3...")
        logo_url, banner_url, avatar_url = await asyncio.gather(logo_task, banner_task, avatar_task)
        
        data["logo_url"] = logo_url
        data["banner_url"] = banner_url
        data["avatar_url"] = avatar_url
        
        print("✅ [Brand Designer] Hoàn tất quá trình vẽ lại!")
        
        return {
            "status": "success",
            "data": data
        }
