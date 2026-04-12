@echo off
echo ========================================================
echo   🚀 KHOI DONG HE THONG BRANDFLOW (Frontend + Backend)
echo ========================================================
echo.

REM Kiem tra xem co thu muc temp_uploads khong (tranh loi backend)
if not exist "temp_uploads" mkdir temp_uploads

echo [1/2] Dang bat Backend (FastAPI) cong 8000...
start "BrandFlow Backend (FastAPI)" cmd /k "python -m uvicorn main:app --host 0.0.0.0 --port 8000"

echo [2/2] Dang bat Frontend (Next.js) cong 3000...
start "BrandFlow Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Hoan tat! 
echo.
echo Ban co the truy cap vao trang:
echo Frontend: http://localhost:3000/planning/a1-mission
echo Backend API Docs: http://localhost:8000/docs
echo.
echo Luu y: De tat he thong, hay dong ca 2 cua so CMD vua duoc bat len.
pause
