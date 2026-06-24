import os
import time
from celery import Celery

# Hệ thống lấy địa chỉ Redis từ file docker-compose.yml hoặc .env (nếu chạy local)
broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

# Khởi tạo Công nhân (Celery Worker)
celery = Celery(
    "brandflow_workers",
    broker=broker_url,
    backend=result_backend
)

# Cấu hình để Celery biết nó có thể nhận những loại kết quả serialize JSON (bảo mật)
celery.conf.update(
    task_serializer='json',
    accept_content=['json'], 
    result_serializer='json',
    timezone='Asia/Ho_Chi_Minh',
    enable_utc=True,
)

# =========================================================
# ĐÂY LÀ NƠI CHỨA CÁC "NÚT THẮT CỔ CHAI" CỦA AI.
# Những Request mất 3 giây, 10 giây hay 1 phút của Langchain
# sẽ được bứng từ main.py vứt vào đây.
# =========================================================

@celery.task(name="execute_heavy_ai_plan", bind=True)
def execute_heavy_ai_plan(self, payload: dict):
    """
    Worker sẽ bốc gói hàng này từ Redis ra xử lý.
    Nếu hàm này chạy mất 1 tiếng thì API Webserver ở main.py vẫn rảnh rang đón luồng mượt mà.
    """
    try:
        # THAY THẾ CHỖ NÀY BẰNG: run_plan_wizard_contract(payload["plan_hash"], payload["answers"], ...)
        # Mô phỏng AI đang phân tích dữ liệu rất nặng (tốn 10 giây).
        print(f"[Worker {self.request.id}] Đang vắt óc suy nghĩ gói hàng: {payload.get('plan_hash')}...")
        
        # Nhá hàng tiến độ cho Frontend (Polling progress 50%)
        self.update_state(state='PROGRESS', meta={'progress': 50, 'message': 'Đang cào dữ liệu từ Internet'})
        time.sleep(5)
        
        self.update_state(state='PROGRESS', meta={'progress': 80, 'message': 'Đang nạp vào LLM...'})
        time.sleep(5)
        
        # Kết thúc và lưu kết quả vào Database hoặc thẳng Redis Backend.
        return {
            "status": "success",
            "message": "Chiến lược đã hoạch định xong tuyệt đối!",
            "ai_output": f"Đây là Brand Guidelines rút ra từ {payload.get('plan_hash', 'unknown_hash')}.",
            "tokens_used": 1500
        }
    except Exception as exc:
        print(f"[Worker Error] {str(exc)}")
        # Cập nhật trạng thái Thất bại để UI Frontend biết mà báo đỏ.
        self.update_state(state='FAILURE', meta={'error': str(exc)})
        raise exc
