@echo off
title BrandFlow Runner
echo ==============================================
echo        STARTING BRANDFLOW SERVICES
echo ==============================================
echo.

echo [1/2] Starting Backend Server (FastAPI)...
start "BrandFlow Backend" cmd /k "cd /d "%~dp0" && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) && python main.py"

echo [2/2] Starting Frontend Server (Vite)...
start "BrandFlow Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both services are booting up in separate background windows!
echo - Backend will be available at: http://localhost:8000
echo - Frontend depends on Vite settings, usually at: http://localhost:5173
echo.
pause
