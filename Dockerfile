# Dockerfile cho BrandFlow (Production Ready)
# Tối ưu hóa kích thước và bảo mật
FROM python:3.11-slim

# Ngăn Python sinh file bytecode để nhẹ máy
ENV PYTHONDONTWRITEBYTECODE=1
# Bật cờ không đệm stdout/stderr (Tránh mất log)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Cài đặt các gói phụ thuộc cơ bản (Ví dụ GCC để build một số thư viện C của ChromaDB nếu có)
RUN apt-get update \
    && apt-get install -y build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# Cài requirements gốc
COPY requirements.txt .

# Băm thêm Celery, Redis và Gunicorn vào để chuẩn bị cho kiến trúc chịu tải 10k CCU
RUN pip install --no-cache-dir -r requirements.txt celery redis gunicorn

# Copy toàn bộ mã nguồn vào Container
COPY . .

# Mở cổng giao tiếp
EXPOSE 8000

# Lệnh khởi chạy API với Gunicorn xé nhỏ luồng (Workers)
# Trong môi trường Docker Compose lệnh này sẽ bị override nếu cần
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
