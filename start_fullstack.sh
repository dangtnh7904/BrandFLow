#!/bin/bash

# Create temp_uploads if not exists
mkdir -p temp_uploads

# Set local audit token
export BRANDFLOW_AUDIT_ADMIN_TOKEN="brandflow-local-audit-token"

echo "========================================================"
echo "  🚀 KHỞI ĐỘNG HỆ THỐNG BRANDFLOW (Frontend + Backend)  "
echo "========================================================"
echo ""

# Activate virtual environment if exists
if [ -d "venv" ]; then
    echo "Using python virtual environment (venv)..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "Using python virtual environment (.venv)..."
    source .venv/bin/activate
else
    echo "⚠️ Warning: No virtual environment found. Running with global python3..."
fi

# Run Backend
echo "[1/2] Đang khởi động Backend (FastAPI - Port 8000)..."
python main.py > backend.log 2>&1 &
BACKEND_PID=$!

# Run Frontend
echo "[2/2] Đang khởi động Frontend (Next.js - Port 3000)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Đang khởi động..."
echo "- Frontend: http://localhost:3000"
echo "- Backend API Docs: http://localhost:8000/docs"
echo "- Backend Logs: backend.log"
echo "- Frontend Logs: frontend.log"
echo ""
echo "👉 Bấm [Ctrl + C] để dừng toàn bộ hệ thống."
echo ""

# Handle shutdown cleanly
cleanup() {
    echo ""
    echo "🛑 Đang tắt Backend (PID $BACKEND_PID) và Frontend (PID $FRONTEND_PID)..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup INT

# Keep script running to listen for Ctrl+C
wait
