@echo off
title BrandFlow Fullstack Run
echo ==============================================
echo 🚀 Khởi động BrandFlow Fullstack Local
echo ==============================================

if not exist ".env" (
    echo [CANH BAO] Khong tim thay file .env! Vui long copy tu .env.example
    pause
    exit /b
)

echo.
echo [1] Dang chay Backend FastAPI (Tab moi)...
start "BrandFlow Backend" cmd /k "cd /d %~dp0 && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo [2] Dang chay Frontend Next.js (Tab moi)...
start "BrandFlow Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ==============================================
echo ✅ Hoan thanh! Vui long vao trinh duyet:
echo 🌍 Frontend: http://localhost:3000
echo 🔌 Backend (Swagger UI): http://localhost:8000/docs
echo ==============================================
pause
