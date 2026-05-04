@echo off
title BrandFlow Fullstack Runner
echo ========================================================
echo   🚀 KHOI DONG HE THONG BRANDFLOW (Frontend + Backend)
echo ========================================================
echo.

REM Kiem tra xem co thu muc temp_uploads khong (tranh loi backend)
if not exist "temp_uploads" mkdir temp_uploads

REM Set local audit token neu chua co
if "%BRANDFLOW_AUDIT_ADMIN_TOKEN%"=="" (
	set "BRANDFLOW_AUDIT_ADMIN_TOKEN=brandflow-local-audit-token"
)

echo [1/2] Dang bat Backend (FastAPI) cong 8000...
start "BrandFlow Backend (FastAPI)" cmd /k "cd /d "%~dp0" && (if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) & python main.py"

echo [2/2] Dang bat Frontend (Next.js) cong 3000...
start "BrandFlow Frontend (Next.js)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ✅ Hoan tat! He thong dang duoc khoi dong...
echo.
echo Dang cho Frontend khoi dong truoc khi tu dong mo trinh duyet...
timeout /t 6 /nobreak > nul
start http://localhost:3000

echo.
echo Ban co the truy cap vao trang:
echo Frontend: http://localhost:3000
echo Backend API Docs: http://localhost:8000/docs
echo.
echo Luu y: De tat he thong, hay dong ca 2 cua so CMD vua duoc bat len.
pause
