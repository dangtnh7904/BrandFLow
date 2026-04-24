import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':

    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

from datetime import date
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request, Response, Depends
from fastapi.responses import HTMLResponse
from typing import Any, Dict, List
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.schemas import (
    PresetRequest,
    InterviewRequest,
    RawInputRequest,
    RefineRequest,
    MicroExecuteRequest,
    OrchestrationMockRequest,
<<<<<<< HEAD
    PlanWizardRequest,
    PlanIntent,
    ExecutionRequest,
)
# ── AI Pipeline imports (optional – may fail if langchain deps missing) ──
_AI_PIPELINE_AVAILABLE = False
try:
    from app.services.memory_rag import inject_industry_presets, generate_guideline_from_qa, analyze_and_extract_dna
    from app.agents.intake.intake_agent import analyze_raw_input, check_required_info, extract_document_summary
    from app.workflows.workflow_graph import (
        build_error_envelope,
        run_plan_wizard_contract,
        run_pipeline,
        run_refinement_pipeline,
        run_week1_orchestration_contract,
    )
    from app.services.document_processor import DocumentIngestor
    _AI_PIPELINE_AVAILABLE = True
except ImportError as _import_err:
    print(f"[WARN] AI pipeline modules unavailable: {_import_err}")
    print("[WARN] Form CRUD and DB features will still work normally.")

from app.core.access_audit import VisitorAuditStore
from app.core.database import init_db as init_form_db
from app.api.form_routes import router as form_router
from app.api.design_routes import router as design_router
=======
    DesignGenerateRequest,
)
from design_agent import generate_brand_identity
from memory_rag import inject_industry_presets, generate_guideline_from_qa, analyze_and_extract_dna
from intake_agent import analyze_raw_input, check_required_info, extract_document_summary
from workflow_graph import (
    build_error_envelope,
    run_pipeline,
    run_refinement_pipeline,
    run_week1_orchestration_contract,
)
from document_processor import DocumentIngestor
>>>>>>> origin/feature/design-logo-generation
from pydantic import BaseModel
import os
import uuid
import asyncio
from app.core.mock_manager import parse_mock_md

app = FastAPI(
    title="BrandFlow APIs",
    description="APIs for BrandFlow Memory and RAG Strategy Engine.",
    version="1.0.0"
)

# Cấu hình CORS chặt chẽ: Đóng chặt cửa, chỉ cho phép luồng chạy từ chính Frontend của bạn.
# Trên Server Riêng, bạn mở file .env và thêm dòng: BRANDFLOW_FRONTEND_URLS=https://ten-mien-frontend-cua-ban.com
raw_origins = os.environ.get("BRANDFLOW_FRONTEND_URLS", "http://localhost:3000,http://localhost:3001")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


WEEK1_QUOTA_POLICY = {
    "FREE": {
        "max_files_per_request": 2,
        "max_files_per_day": 6,
        "max_file_size_mb": 10,
        "max_urls_per_day": 3,
    },
    "PLUS": {
        "max_files_per_request": 5,
        "max_files_per_day": 30,
        "max_file_size_mb": 25,
        "max_urls_per_day": 15,
    },
    "PRO": {
        "max_files_per_request": 15,
        "max_files_per_day": 120,
        "max_file_size_mb": 100,
        "max_urls_per_day": 80,
    },
}

# Week 1 dùng in-memory counter để chốt API boundary. Tuần sau thay bằng DB boundary.
WEEK1_DAILY_USAGE: Dict[str, Dict[str, int]] = {}
WEEK1_PLAN_REGISTRY: Dict[str, Dict[str, Any]] = {}
WEEK1_MODEL_USAGE: Dict[str, Dict[str, Any]] = {}
VISITOR_AUDIT_STORE = VisitorAuditStore()
AUDIT_ADMIN_TOKEN = os.environ.get("BRANDFLOW_AUDIT_ADMIN_TOKEN", "").strip()


@app.on_event("startup")
async def app_startup() -> None:
    """Initialize databases on startup."""
    VISITOR_AUDIT_STORE.init_db()
    # Tạo bảng Users/Projects/FormData nếu chưa có
    init_form_db()
    print("✅ [DB] Form database initialized.")


# ── Đăng ký Form Data CRUD Router ─────────────────────────────────
app.include_router(form_router)

# ── Đăng ký Design Module Router ──────────────────────────────────
app.include_router(design_router)


@app.middleware("http")
async def visitor_audit_middleware(request: Request, call_next):
    """Persist access history for evidence of who entered the app."""
    trace_id = (request.headers.get("X-Trace-Id") or "").strip() or None
    tier_hint = (request.headers.get("X-Tier") or "").strip() or None
    client_host = request.client.host if request.client else None

    try:
        response = await call_next(request)
    except Exception:
        try:
            VISITOR_AUDIT_STORE.record_visit(
                headers=dict(request.headers),
                client_host=client_host,
                method=request.method,
                path=request.url.path,
                status_code=500,
                trace_id=trace_id,
                tier_hint=tier_hint,
            )
        except Exception as audit_error:
            print(f"[AUDIT] Failed to record error visit: {audit_error}")
        raise

    try:
        VISITOR_AUDIT_STORE.record_visit(
            headers=dict(request.headers),
            client_host=client_host,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            trace_id=trace_id,
            tier_hint=tier_hint,
        )
    except Exception as audit_error:
        print(f"[AUDIT] Failed to record visit: {audit_error}")

    return response


def _normalize_tier(raw_tier: str) -> str:
    tier = (raw_tier or "FREE").strip().upper()
    if tier not in WEEK1_QUOTA_POLICY:
        return "FREE"
    return tier


def _resolve_trace_id(http_request: Request) -> str:
    incoming = (http_request.headers.get("X-Trace-Id") or "").strip()
    if incoming:
        return incoming
    return str(uuid.uuid4())


def _require_audit_admin_token(request: Request) -> None:
    expected = (AUDIT_ADMIN_TOKEN or "").strip()
    trace_id = _resolve_trace_id(request)

    if not expected:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="AUDIT_TOKEN_NOT_CONFIGURED",
            message="Audit admin token chưa được cấu hình trên server.",
            status_code=503,
            node_name="api_audit_auth",
            retryable=False,
            details={"required_header": "X-Audit-Admin-Token"},
        )
        raise HTTPException(status_code=503, detail=detail)

    provided = (request.headers.get("X-Audit-Admin-Token") or "").strip()
    if provided != expected:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="AUDIT_FORBIDDEN",
            message="Bạn không có quyền truy cập audit API.",
            status_code=403,
            node_name="api_audit_auth",
            retryable=False,
            details={"required_header": "X-Audit-Admin-Token"},
        )
        raise HTTPException(status_code=403, detail=detail)


def _build_usage_key(user_id: str, tier: str) -> str:
    return f"{date.today().isoformat()}::{user_id}::{tier}"


def _default_model_usage_bucket() -> dict:
    return {
        "runs_today": 0,
        "total_tokens_est": 0,
        "total_estimated_cost_usd": 0.0,
        "route_counts": {},
        "provider_breakdown": {
            "local": {
                "runs": 0,
                "tokens": 0,
                "estimated_cost_usd": 0.0,
            },
            "cloud": {
                "runs": 0,
                "tokens": 0,
                "estimated_cost_usd": 0.0,
            },
            "unknown": {
                "runs": 0,
                "tokens": 0,
                "estimated_cost_usd": 0.0,
            },
        },
        "last_trace_id": None,
        "last_route_decision": "unknown",
        "last_route_reason_code": "UNKNOWN_REASON",
        "last_primary_model": {
            "provider": "unknown",
            "model": "unknown",
        },
    }


def _record_model_usage(
    *,
    user_id: str,
    tier: str,
    trace_id: str,
    result_payload: dict,
) -> dict:
    usage_key = _build_usage_key(user_id, tier)
    usage_bucket = WEEK1_MODEL_USAGE.setdefault(usage_key, _default_model_usage_bucket())

    usage_telemetry = dict(result_payload.get("usage_telemetry", {}) or {})
    model_router = dict(result_payload.get("model_router", {}) or {})
    primary_model = dict(model_router.get("primary", {}) or {})

    total_tokens = int(usage_telemetry.get("total_tokens_est", 0) or 0)
    estimated_cost_usd = float(usage_telemetry.get("estimated_cost_usd", 0.0) or 0.0)
    route_decision = str(result_payload.get("route_decision", "unknown") or "unknown")
    route_reason_code = str(result_payload.get("route_reason_code", "UNKNOWN_REASON") or "UNKNOWN_REASON")

    provider = str(primary_model.get("provider", "unknown") or "unknown").lower()
    if provider not in usage_bucket["provider_breakdown"]:
        provider = "unknown"

    usage_bucket["runs_today"] += 1
    usage_bucket["total_tokens_est"] += total_tokens
    usage_bucket["total_estimated_cost_usd"] = round(
        float(usage_bucket["total_estimated_cost_usd"]) + estimated_cost_usd,
        8,
    )

    usage_bucket["route_counts"][route_decision] = int(usage_bucket["route_counts"].get(route_decision, 0)) + 1

    provider_bucket = usage_bucket["provider_breakdown"][provider]
    provider_bucket["runs"] += 1
    provider_bucket["tokens"] += total_tokens
    provider_bucket["estimated_cost_usd"] = round(float(provider_bucket["estimated_cost_usd"]) + estimated_cost_usd, 8)

    usage_bucket["last_trace_id"] = trace_id
    usage_bucket["last_route_decision"] = route_decision
    usage_bucket["last_route_reason_code"] = route_reason_code
    usage_bucket["last_primary_model"] = {
        "provider": primary_model.get("provider", "unknown"),
        "model": primary_model.get("model", "unknown"),
    }

    return {
        "usage_date": date.today().isoformat(),
        "user_id": user_id,
        "tier": tier,
        "runs_today": usage_bucket["runs_today"],
        "total_tokens_est": usage_bucket["total_tokens_est"],
        "total_estimated_cost_usd": usage_bucket["total_estimated_cost_usd"],
        "route_counts": dict(usage_bucket["route_counts"]),
        "provider_breakdown": usage_bucket["provider_breakdown"],
        "last_trace_id": usage_bucket["last_trace_id"],
        "last_route_decision": usage_bucket["last_route_decision"],
        "last_route_reason_code": usage_bucket["last_route_reason_code"],
        "last_primary_model": usage_bucket["last_primary_model"],
    }


def _get_model_usage_summary(user_id: str, tier: str) -> dict:
    usage_key = _build_usage_key(user_id, tier)
    usage_bucket = WEEK1_MODEL_USAGE.get(usage_key)
    if usage_bucket is None:
        usage_bucket = _default_model_usage_bucket()

    return {
        "usage_date": date.today().isoformat(),
        "user_id": user_id,
        "tier": tier,
        "runs_today": usage_bucket["runs_today"],
        "total_tokens_est": usage_bucket["total_tokens_est"],
        "total_estimated_cost_usd": usage_bucket["total_estimated_cost_usd"],
        "route_counts": dict(usage_bucket["route_counts"]),
        "provider_breakdown": usage_bucket["provider_breakdown"],
        "last_trace_id": usage_bucket["last_trace_id"],
        "last_route_decision": usage_bucket["last_route_decision"],
        "last_route_reason_code": usage_bucket["last_route_reason_code"],
        "last_primary_model": usage_bucket["last_primary_model"],
    }


def _raise_quota_error(
    trace_id: str,
    tier: str,
    status_code: int,
    code: str,
    message: str,
    limit: dict,
    usage: dict,
    retryable: bool,
) -> None:
    detail = build_error_envelope(
        trace_id=trace_id,
        code=code,
        message=message,
        status_code=status_code,
        node_name="api_quota_guard",
        retryable=retryable,
        details={
            "tier": tier,
            "limit": limit,
            "usage": usage,
        },
    )
    raise HTTPException(status_code=status_code, detail=detail)


def _enforce_week1_quota(request: OrchestrationMockRequest, tier: str, trace_id: str) -> None:
    policy = WEEK1_QUOTA_POLICY[tier]

    if request.file_size_mb > policy["max_file_size_mb"]:
        _raise_quota_error(
            trace_id=trace_id,
            tier=tier,
            status_code=413,
            code="QUOTA_FILE_SIZE_EXCEEDED",
            message="Dung lượng file vượt giới hạn tier.",
            limit={"max_file_size_mb": policy["max_file_size_mb"]},
            usage={"file_size_mb": request.file_size_mb},
            retryable=False,
        )

    if request.files_count > policy["max_files_per_request"]:
        _raise_quota_error(
            trace_id=trace_id,
            tier=tier,
            status_code=413,
            code="QUOTA_FILES_PER_REQUEST_EXCEEDED",
            message="Số lượng file trong request vượt giới hạn tier.",
            limit={"max_files_per_request": policy["max_files_per_request"]},
            usage={"files_count": request.files_count},
            retryable=False,
        )

    usage_key = _build_usage_key(request.user_id, tier)
    current_usage = WEEK1_DAILY_USAGE.setdefault(
        usage_key,
        {
            "files_today": 0,
            "urls_today": 0,
        },
    )

    projected_files_today = current_usage["files_today"] + request.files_count
    if projected_files_today > policy["max_files_per_day"]:
        _raise_quota_error(
            trace_id=trace_id,
            tier=tier,
            status_code=429,
            code="QUOTA_FILES_PER_DAY_EXCEEDED",
            message="Số lượng file/ngày đã vượt quota tier.",
            limit={"max_files_per_day": policy["max_files_per_day"]},
            usage={"files_today": projected_files_today},
            retryable=True,
        )

    projected_urls_today = current_usage["urls_today"] + request.urls_count
    if projected_urls_today > policy["max_urls_per_day"]:
        _raise_quota_error(
            trace_id=trace_id,
            tier=tier,
            status_code=429,
            code="QUOTA_URLS_PER_DAY_EXCEEDED",
            message="Số lượng URL/ngày đã vượt quota tier.",
            limit={"max_urls_per_day": policy["max_urls_per_day"]},
            usage={"urls_today": projected_urls_today},
            retryable=True,
        )

    current_usage["files_today"] = projected_files_today
    current_usage["urls_today"] = projected_urls_today


def _resolve_registered_plan_or_raise(plan_hash: str, trace_id: str) -> dict:
    resolved_hash = (plan_hash or "").strip()
    if not resolved_hash:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_REQUIRED",
            message="Thiếu plan_hash. Chính sách no-plan-no-run đang bật.",
            status_code=400,
            node_name="api_plan_guard",
            retryable=False,
            details={"required_field": "plan_hash"},
        )
        raise HTTPException(status_code=400, detail=detail)

    plan_entry = WEEK1_PLAN_REGISTRY.get(resolved_hash)
    if not plan_entry:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_HASH_NOT_FOUND",
            message="Không tìm thấy plan_hash hợp lệ. Vui lòng submit wizard trước.",
            status_code=400,
            node_name="api_plan_guard",
            retryable=False,
            details={"plan_hash": resolved_hash},
        )
        raise HTTPException(status_code=400, detail=detail)

    return plan_entry


def _enforce_plan_ownership(plan_intent: dict, user_id: str, tier: str, trace_id: str) -> None:
    intent_user = (plan_intent.get("user_id") or "anonymous").strip() or "anonymous"
    request_user = (user_id or "anonymous").strip() or "anonymous"
    if intent_user != request_user:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_FORBIDDEN",
            message="plan_hash không thuộc user hiện tại.",
            status_code=403,
            node_name="api_plan_guard",
            retryable=False,
            details={
                "plan_user_id": intent_user,
                "request_user_id": request_user,
            },
        )
        raise HTTPException(status_code=403, detail=detail)

    intent_tier = _normalize_tier(str(plan_intent.get("tier", "FREE")))
    if intent_tier != tier:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_TIER_MISMATCH",
            message="Tier hiện tại không khớp tier đã compile trong plan_intent.",
            status_code=403,
            node_name="api_plan_guard",
            retryable=False,
            details={
                "plan_tier": intent_tier,
                "request_tier": tier,
            },
        )
        raise HTTPException(status_code=403, detail=detail)


def _store_plan_intent(plan_hash: str, plan_intent: dict, trace_id: str) -> dict:
    safe_hash = (plan_hash or "").strip()
    sanitized_intent = dict(plan_intent or {})
    sanitized_intent.pop("plan_hash", None)

    validated_plan_intent = PlanIntent(plan_hash=safe_hash, **sanitized_intent).model_dump()
    WEEK1_PLAN_REGISTRY[safe_hash] = {
        "plan_intent": validated_plan_intent,
        "trace_id": trace_id,
    }
    return validated_plan_intent


def _apply_clarification_answers(plan_intent: dict, clarification_answers: Dict[str, str]) -> dict:
    if not clarification_answers:
        return plan_intent

    updated_intent = dict(plan_intent)
    for key in ("target_audience", "constraints"):
        value = clarification_answers.get(key)
        if value is None:
            continue
        normalized = str(value).strip()
        if normalized:
            updated_intent[key] = normalized

    return updated_intent


def _assert_no_sub_agent_user_questions(agent_logs: list[dict], trace_id: str) -> None:
    violations = []
    for log in agent_logs or []:
        if not bool(log.get("ask_user", False)):
            continue

        agent_name = str(log.get("agent", "")).strip().upper()
        if agent_name in {"SYSTEM", "MAIN", "ORCHESTRATOR"}:
            continue

        violations.append(
            {
                "agent": log.get("agent", "UNKNOWN"),
                "message": log.get("message", ""),
            }
        )

    if violations:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="SUB_AGENT_ASK_USER_BLOCKED",
            message="Sub-agent không được phép hỏi user trong multi-step run.",
            status_code=400,
            node_name="api_execute_policy_guard",
            retryable=False,
            details={
                "violations": violations,
                "policy": "sub_agent_user_question_allowed=false",
            },
        )
        raise HTTPException(status_code=400, detail=detail)

@app.get("/", response_class=HTMLResponse)
async def home():
    html_content = """
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>BrandFlow PDF Tester</title>
        <style>
            body { font-family: Inter, Arial, sans-serif; margin: 40px; background-color: #f4f4f9; }
            .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            h2 { color: #333; text-align: center; }
            input[type="file"] { margin: 15px 0; font-size: 16px; }
            button { background: #4CAF50; color: white; padding: 12px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; width: 100%; transition: 0.3s; }
            button:hover { background: #45a049; }
            pre { background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; max-height: 500px; overflow-y: auto; font-size: 15px; line-height: 1.5; }
            .loader { display: none; margin-top: 15px; color: #ff5722; font-weight: bold; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🚀 Trình Kiểm Tra Đọc PDF</h2>
            <p style="text-align: center; color: #666;">Tải lên các file PDF của bạn để xem code đọc chữ được đến đâu.</p>
            <form id="uploadForm">
                <input type="file" id="fileInput" name="files" multiple accept=".pdf,.txt,.docx" required />
                <br />
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="flex: 1;">🔍 Chỉ đọc thử Text</button>
                    <button type="button" id="btnStore" style="flex: 1; background: #ff9800;">💾 Lưu vào Bộ não (ChromaDB)</button>
                </div>
            </form>

            <div style="margin-top: 20px; padding: 10px; background: #e3f2fd; border-radius: 5px; border: 1px solid #90caf9; font-size: 14px;">
                <b>📊 Trạng thái Database:</b> <span id="dbStats">Đang tải...</span>
            </div>


            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;" />
            <h3 style="text-align: center; color: #333;">🔗 Hoặc Lấy Dữ Liệu Từ Website</h3>
            <form id="urlForm">
                <input type="url" id="urlInput" placeholder="Nhập link web (vd: https://vnexpress.net)" style="width: 100%; padding: 12px; font-size: 16px; margin: 10px 0; box-sizing: border-box; border-radius: 5px; border: 1px solid #ccc;" required />
                <button type="submit" style="background: #2196F3;">Tải dữ liệu Web</button>
            </form>

            <div class="loader" id="loader">⏳ Đang xử lý dữ liệu...</div>
            <h3 style="margin-top: 30px;">Kết quả:</h3>
            <pre id="result">Chưa có thông tin</pre>
        </div>
        <script>
            async function refreshStats() {
                try {
                    const response = await fetch('/api/v1/onboarding/stats');
                    const data = await response.json();
                    document.getElementById('dbStats').textContent = `${data.count} mảnh trí nhớ (Chunks)`;
                } catch (e) {
                    document.getElementById('dbStats').textContent = 'Lỗi';
                }
            }
            refreshStats();

            // Xử lý nốt Store
            document.getElementById('btnStore').addEventListener('click', async () => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length === 0) return alert('Chọn file trước!');
                
                const formData = new FormData();
                for (let file of fileInput.files) formData.append('files', file);

                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang băm nhỏ và lưu vào ChromaDB dùng Ollama...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/upload', { method: 'POST', body: formData });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    refreshStats();
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi: ' + error.message;
                }
            });

            document.getElementById('uploadForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length === 0) return;
                
                const formData = new FormData();
                for (let file of fileInput.files) {
                    formData.append('files', file);
                }

                
                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang chờ máy chủ xử lý...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/test-upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    if(data.data) {
                        document.getElementById('result').textContent = JSON.stringify(data.data, null, 2);
                    } else {
                        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi kết nối: ' + error.message;
                }
            });

            document.getElementById('urlForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const urlInput = document.getElementById('urlInput').value.trim();
                if (!urlInput) return;
                
                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang tải trang web và thu thập dữ liệu...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/test-url', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({urls: [urlInput]})
                    });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    if(data.data) {
                        document.getElementById('result').textContent = JSON.stringify(data.data, null, 2);
                    } else {
                        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi kết nối: ' + error.message;
                }
            });
        </script>
    </body>
    </html>
    """
    return html_content


@app.get("/api/v1/audit/visitors/summary")
def get_audit_visitors_summary(_: None = Depends(_require_audit_admin_token)):
    """Thống kê tổng quan người đã vào app."""
    try:
        return {
            "status": "success",
            "data": VISITOR_AUDIT_STORE.get_summary(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy thống kê audit: {str(e)}")


@app.get("/api/v1/audit/visitors")
def list_audit_visitors(limit: int = 100, _: None = Depends(_require_audit_admin_token)):
    """Danh sách visitor đã truy cập (ưu tiên lượt gần nhất)."""
    try:
        return {
            "status": "success",
            "data": VISITOR_AUDIT_STORE.list_visitors(limit=limit),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy danh sách visitor: {str(e)}")


@app.get("/api/v1/audit/visits")
def list_audit_visits(limit: int = 200, visitor_key: str | None = None, _: None = Depends(_require_audit_admin_token)):
    """Lịch sử truy cập theo event để làm minh chứng."""
    try:
        return {
            "status": "success",
            "data": VISITOR_AUDIT_STORE.list_visit_events(limit=limit, visitor_key=visitor_key),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy lịch sử truy cập: {str(e)}")

@app.post("/api/v1/onboarding/interview")
async def onboarding_interview(request: InterviewRequest):
    """
    Sinh ra quy tắc marketing (Brand Guidelines) từ kết quả phỏng vấn và lưu vào hệ thống (ChromaDB).
    """
    try:
        result = generate_guideline_from_qa(request.answers)
        if result.get("status") == "error":
             raise HTTPException(status_code=400, detail=result.get("message"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/v1/onboarding/test-upload")
async def test_upload_extract_only(
    files: List[UploadFile] = File(...),
    force_ai: bool = Form(False)
):
    """
    API test: Nhận file (PDF, DOCX, TXT, CSV, XLSX...) và trả về text trích xuất.
    KHÔNG lưu ChromaDB, KHÔNG gọi AI (tránh tốn token).
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    ingestor = DocumentIngestor()
    results = {}

    for file in files:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_file_path = os.path.join(temp_dir, unique_filename)

        try:
            content = await file.read()
            with open(temp_file_path, "wb") as buf:
                buf.write(content)

            parse_result = ingestor.parse_file(temp_file_path)
            if parse_result.success:
                cleaned = ingestor.clean_text(parse_result.text)
                results[file.filename] = {
                    "status": "success",
                    "method": parse_result.method,
                    "char_count": parse_result.char_count,
                    "pages": parse_result.page_count or None,
                    "sheets": parse_result.sheet_count or None,
                    "cleaned_text": cleaned[:5000],  # preview 5000 ký tự đầu
                    "truncated": len(cleaned) > 5000,
                }
            else:
                results[file.filename] = {
                    "status": "error",
                    "method": parse_result.method,
                    "error": parse_result.error,
                }
        except Exception as e:
            results[file.filename] = {"status": "error", "error": str(e)}
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    return {"status": "success", "data": results}

class UrlRequestCustom(BaseModel):
    urls: List[str]

@app.post("/api/v1/onboarding/test-url")
def test_url_extract_only(request: UrlRequestCustom):
    """
    API test: Nhận URL và trả về text thu thập được từ trang đích.
    """
    if not request.urls:
        raise HTTPException(status_code=400, detail="Không có URL nào được gửi lên.")

    try:
        ingestor = DocumentIngestor()
        results = {}
        for url in request.urls:
            raw_text = ingestor.ingest_url(url)
            cleaned_text = ingestor.clean_text(raw_text)
            results[url] = {
                "cleaned_text": cleaned_text
            }
        return {"status": "success", "data": results}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý URL: {str(e)}")

@app.post("/api/v1/onboarding/upload-url")
def onboarding_upload_url(request: UrlRequestCustom):
    """
    Nhận tập hợp URL, bóc tách nội dung HTML và lưu vào ChromaDB.
    Trả về kết quả chi tiết từng URL, tiếp tục xử lý dù có URL lỗi.
    """
    if not request.urls:
        raise HTTPException(status_code=400, detail="Không có URL nào gửi lên.")

    ingestor = DocumentIngestor()
    results = []
    ok_count = 0
    fail_count = 0

    for url in request.urls:
        try:
            raw_text = ingestor.ingest_url(url)
            cleaned = ingestor.clean_text(raw_text)
            ingestor.process_and_store_text(raw_text=cleaned, filename=url, category="brand_guidelines")
            results.append({
                "url": url,
                "status": "success",
                "char_count": len(cleaned),
            })
            ok_count += 1
        except Exception as e:
            results.append({
                "url": url,
                "status": "error",
                "error": str(e),
            })
            fail_count += 1

    status = "success" if fail_count == 0 else ("partial" if ok_count > 0 else "error")
    message = (
        f"Đã thu thập và lưu thành công {ok_count}/{len(request.urls)} trang web vào ChromaDB."
        if ok_count > 0
        else f"Tất cả {fail_count} URL đều thất bại."
    )
    return {"status": status, "message": message, "results": results}


@app.post("/api/v1/onboarding/upload")
async def onboarding_upload(files: List[UploadFile] = File(...), tenant_id: str = Form("default")):
    """
    Nhận file (PDF, DOCX, TXT, CSV, XLSX, HTML...), băm nhỏ và lưu vào ChromaDB.
    Trả về kết quả chi tiết từng file, bao gồm lỗi nếu có.
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    ingestor = DocumentIngestor(tenant_id=tenant_id)

    results = []
    ok_count = 0
    fail_count = 0

    for file in files:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_file_path = os.path.join(temp_dir, unique_filename)

        # Ghi file tạm
        try:
            content = await file.read()
            with open(temp_file_path, "wb") as buf:
                buf.write(content)
        except Exception as e:
            results.append({"filename": file.filename, "status": "error", "error": f"Không ghi được file tạm: {e}"})
            fail_count += 1
            continue

        try:
            # Parse đa định dạng
            parse_result = ingestor.parse_file(temp_file_path)

            if not parse_result.success:
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": parse_result.error,
                    "method": parse_result.method,
                })
                fail_count += 1
            else:
                # Lưu vào ChromaDB
                ingestor.process_and_store_text(
                    raw_text=parse_result.text,
                    filename=file.filename,
                    category="brand_guidelines",
                )
                results.append({
                    "filename": file.filename,
                    "status": "success",
                    "char_count": parse_result.char_count,
                    "method": parse_result.method,
                    "pages": parse_result.page_count or None,
                    "sheets": parse_result.sheet_count or None,
                })
                ok_count += 1
        except Exception as e:
            results.append({"filename": file.filename, "status": "error", "error": str(e)})
            fail_count += 1
        finally:
            # Zero-Data Retention: tiêu hủy file tạm ngay lập tức
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    status = "success" if fail_count == 0 else ("partial" if ok_count > 0 else "error")
    message = (
        f"Đã lưu thành công {ok_count}/{len(files)} tài liệu vào ChromaDB."
        if ok_count > 0
        else f"Tất cả {fail_count} file đều thất bại."
    )
    return {"status": status, "message": message, "results": results}

@app.post("/api/v1/onboarding/extract-summary")
async def onboarding_extract_summary(files: List[UploadFile] = File(...), tenant_id: str = Form("default")):
    """
    Nhận file, đọc nội dung và trả về tóm tắt ngắn gọn thông qua Gemini.
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    try:
        temp_dir = "./temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        from app.services.document_processor import DocumentIngestor
        ingestor = DocumentIngestor(tenant_id=tenant_id)
        
        combined_text = ""
        for file in files:
            unique_filename = f"{uuid.uuid4()}_{file.filename}"
            temp_file_path = os.path.join(temp_dir, unique_filename)
            
            with open(temp_file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            try:
                raw_text = ingestor.ingest_file(temp_file_path)
                combined_text += raw_text + "\n"
            finally:
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                
        # Phân tích qua LLM Gemini
        summary_data = extract_document_summary(combined_text)
        return {"status": "success", "data": summary_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/planning/contracts/week1")
def get_planning_contract_week1():
    """Công bố contract tuần 1 để frontend/backend/test dùng chung."""
    return {
        "status": "success",
        "contract_version": "week1-v1",
        "trace_header": "X-Trace-Id",
        "tier_default": "FREE",
        "quota_policy": WEEK1_QUOTA_POLICY,
        "error_convention": {
            "413": [
                "QUOTA_FILE_SIZE_EXCEEDED",
                "QUOTA_FILES_PER_REQUEST_EXCEEDED",
            ],
            "429": [
                "QUOTA_FILES_PER_DAY_EXCEEDED",
                "QUOTA_URLS_PER_DAY_EXCEEDED",
            ],
            "500": [
                "ORCH_RUNTIME_ERROR",
                "OUTPUT_ARTIFACT_JSON_INVALID",
                "OUTPUT_ARTIFACT_JSON_MISSING_FIELDS",
                "OUTPUT_PLAN_INVALID",
                "OUTPUT_ARTIFACT_TXT_INVALID",
                "OUTPUT_ARTIFACT_JSON_SERIALIZATION_FAILED",
            ],
            "502": [
                "PROVIDER_ROUTER_INVALID",
                "PROVIDER_MODEL_MISSING",
            ],
        },
        "orchestration_nodes": [
            "plan_wizard",
            "plan_compiler",
            "intake_context",
            "clarification_guard",
            "gateway_router",
            "finalize_output",
        ],
        "stage_a_endpoints": {
            "wizard_submit": "POST /api/v1/planning/wizard/submit",
            "wizard_validate": "POST /api/v1/planning/wizard/validate",
            "execute": "POST /api/v1/planning/execute",
        },
        "stage_c_endpoints": {
            "usage_telemetry": "GET /api/v1/planning/telemetry/usage?user_id=...&tier=...",
        },
        "stage_d_contract": {
            "output_artifacts": {
                "required": ["json", "txt"],
                "json_string_included": True,
                "validator": "output_reliability_v1",
            },
            "error_scope": ["graph", "runtime", "provider"],
        },
        "legacy_endpoints": {
            "POST /api/v1/planning/orchestration/mock-run": {
                "status": "disabled",
                "http_status": 410,
                "replaced_by": "POST /api/v1/planning/execute",
            }
        },
        "plan_policy": {
            "no_plan_no_run": True,
            "required_execute_field": "plan_hash",
            "clarification_guard": {
                "max_rounds": 1,
                "dedupe_key": "question_signature",
                "sub_agent_user_question_allowed": False,
            },
            "tier_model_router": {
                "FREE": "local-first",
                "PLUS": "cloud-standard",
                "PRO": "cloud-premium",
                "fallback": "deterministic_by_route",
            },
        },
    }


@app.get("/api/v1/planning/telemetry/usage")
def get_planning_telemetry_usage(user_id: str = "anonymous", tier: str = "FREE"):
    """Truy xuất usage telemetry + cost tracking theo user/tier trong ngày hiện tại."""
    normalized_tier = _normalize_tier(tier)
    safe_user_id = (user_id or "anonymous").strip() or "anonymous"
    summary = _get_model_usage_summary(user_id=safe_user_id, tier=normalized_tier)

    return {
        "status": "success",
        "data": summary,
    }


@app.post("/api/v1/planning/wizard/submit")
async def planning_wizard_submit(
    request: PlanWizardRequest,
    http_request: Request,
    response: Response,
):
    """Giai đoạn A: nhận wizard answers và compile thành plan_intent + plan_hash."""
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    tier = _normalize_tier(request.tier)

    wizard_payload = request.model_dump()
    wizard_payload["tier"] = tier
    result = run_plan_wizard_contract(
        request_payload=wizard_payload,
        trace_id=trace_id,
        tier=tier,
    )

    if result.get("status") == "error":
        error_list = result.get("errors", [])
        error_payload = error_list[0] if error_list else build_error_envelope(
            trace_id=trace_id,
            code="PLAN_COMPILER_INTERNAL_ERROR",
            message="Không xác định được lỗi plan compiler.",
            status_code=500,
            node_name="api_plan_wizard",
            retryable=False,
            details={},
        )
        status_code = error_payload.get("error", {}).get("http_status", 500)
        raise HTTPException(status_code=status_code, detail=error_payload)

    compiled = result.get("result", {})
    plan_hash = compiled.get("plan_hash", "")
    plan_intent = compiled.get("plan_intent", {})

    validated_plan_intent = plan_intent
    if plan_hash:
        validated_plan_intent = _store_plan_intent(plan_hash, plan_intent, trace_id)

    return {
        "status": "success",
        "trace_id": trace_id,
        "contract_version": result.get("contract_version"),
        "plan_hash": plan_hash,
        "plan_intent": validated_plan_intent,
        "node_outputs": result.get("node_outputs", []),
        "message": "Plan intent đã được compile. Dùng plan_hash cho bước execute.",
    }


@app.post("/api/v1/planning/wizard/validate")
async def planning_wizard_validate(
    request: ExecutionRequest,
    http_request: Request,
    response: Response,
):
    """Kiểm tra plan_hash có hợp lệ cho user/tier hiện tại không."""
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    tier = _normalize_tier(request.tier)

    plan_entry = _resolve_registered_plan_or_raise(request.plan_hash, trace_id=trace_id)
    plan_intent = plan_entry.get("plan_intent", {})

    intent_user = (plan_intent.get("user_id") or "anonymous").strip() or "anonymous"
    request_user = (request.user_id or "anonymous").strip() or "anonymous"
    intent_tier = _normalize_tier(str(plan_intent.get("tier", "FREE")))

    is_valid = intent_user == request_user and intent_tier == tier
    return {
        "status": "success",
        "trace_id": trace_id,
        "plan_hash": request.plan_hash,
        "is_valid": is_valid,
        "checks": {
            "user_match": intent_user == request_user,
            "tier_match": intent_tier == tier,
            "no_plan_no_run": True,
        },
        "plan_intent": plan_intent,
    }


@app.post("/api/v1/planning/execute")
async def planning_execute(
    request: ExecutionRequest,
    http_request: Request,
    response: Response,
):
    """Giai đoạn B: execute với no-plan-no-run + clarification guard + anti-loop policy."""
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    tier = _normalize_tier(request.tier)

    plan_entry = _resolve_registered_plan_or_raise(request.plan_hash, trace_id=trace_id)
    plan_intent = dict(plan_entry.get("plan_intent", {}))
    plan_intent = _apply_clarification_answers(plan_intent, request.clarification_answers)
    _enforce_plan_ownership(plan_intent, user_id=request.user_id, tier=tier, trace_id=trace_id)

    quota_request = OrchestrationMockRequest(
        goal=plan_intent.get("goal", ""),
        industry=plan_intent.get("industry", "General"),
        budget=int(plan_intent.get("budget", 0) or 0),
        target_audience=plan_intent.get("target_audience", ""),
        constraints=plan_intent.get("constraints", ""),
        tier=tier,
        user_id=request.user_id,
        files_count=request.files_count,
        file_size_mb=request.file_size_mb,
        urls_count=request.urls_count,
        mock_mode=request.mock_mode,
    )
    _enforce_week1_quota(request=quota_request, tier=tier, trace_id=trace_id)

    orchestration_input = {
        "goal": plan_intent.get("goal", ""),
        "industry": plan_intent.get("industry", "General"),
        "budget": int(plan_intent.get("budget", 0) or 0),
        "target_audience": plan_intent.get("target_audience", ""),
        "constraints": plan_intent.get("constraints", ""),
        "route_decision": plan_intent.get("route_decision", "balanced"),
        "route_reason_code": plan_intent.get("route_reason_code", "USER_ROUTE_PREFERENCE"),
        "clarification_count": int(plan_intent.get("clarification_count", 0) or 0),
        "question_signatures": list(plan_intent.get("question_signatures", []) or []),
        "sub_agent_user_question_allowed": bool(plan_intent.get("sub_agent_user_question_allowed", False)),
    }

    result = run_week1_orchestration_contract(
        request_payload=orchestration_input,
        trace_id=trace_id,
        tier=tier,
        mock_mode=request.mock_mode,
    )

    if result.get("status") == "error":
        error_list = result.get("errors", [])
        error_payload = error_list[0] if error_list else build_error_envelope(
            trace_id=trace_id,
            code="ORCH_INTERNAL_ERROR",
            message="Không xác định được lỗi orchestration.",
            status_code=500,
            node_name="api_planning_execute",
            retryable=False,
            details={},
        )
        status_code = error_payload.get("error", {}).get("http_status", 500)
        raise HTTPException(status_code=status_code, detail=error_payload)

    if result.get("status") == "clarification_needed":
        clarification_result = result.get("result", {})
        plan_intent["clarification_count"] = int(clarification_result.get("clarification_count", 0) or 0)
        plan_intent["question_signatures"] = list(clarification_result.get("question_signatures", []) or [])

        validated_plan_intent = _store_plan_intent(request.plan_hash, plan_intent, trace_id)
        return {
            **result,
            "plan_hash": request.plan_hash,
            "plan_intent": validated_plan_intent,
        }

    result_payload = result.get("result", {})
    _assert_no_sub_agent_user_questions(result_payload.get("agent_logs", []), trace_id=trace_id)

    usage_telemetry_summary = _record_model_usage(
        user_id=(request.user_id or "anonymous").strip() or "anonymous",
        tier=tier,
        trace_id=trace_id,
        result_payload=result_payload,
    )

    clarification_state = result_payload.get("clarification", {})
    plan_intent["clarification_count"] = int(clarification_state.get("count", plan_intent.get("clarification_count", 0)) or 0)
    plan_intent["question_signatures"] = list(clarification_state.get("question_signatures", plan_intent.get("question_signatures", [])) or [])
    plan_intent["route_reason_code"] = result_payload.get("route_reason_code", plan_intent.get("route_reason_code", "USER_ROUTE_PREFERENCE"))

    validated_plan_intent = _store_plan_intent(request.plan_hash, plan_intent, trace_id)

    return {
        **result,
        "plan_hash": request.plan_hash,
        "plan_intent": validated_plan_intent,
        "usage_telemetry_summary": usage_telemetry_summary,
    }


@app.post("/api/v1/planning/orchestration/mock-run")
async def planning_orchestration_mock_run(
    request: OrchestrationMockRequest,
    http_request: Request,
    response: Response,
):
    """
    Endpoint legacy đã bị khóa để cưỡng chế no-plan-no-run toàn hệ thống.
    """
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    detail = build_error_envelope(
        trace_id=trace_id,
        code="LEGACY_ENDPOINT_DISABLED",
        message="Endpoint mock-run cũ đã bị khóa. Dùng submit -> validate -> execute.",
        status_code=410,
        node_name="api_orchestration_boundary",
        retryable=False,
        details={
            "disabled_endpoint": "POST /api/v1/planning/orchestration/mock-run",
            "required_flow": [
                "POST /api/v1/planning/wizard/submit",
                "POST /api/v1/planning/wizard/validate",
                "POST /api/v1/planning/execute",
            ],
            "policy": "no-plan-no-run",
            "ignored_request_fields": sorted(list(request.model_dump().keys())),
        },
    )
    raise HTTPException(status_code=410, detail=detail)

@app.post("/api/v1/planning/intake")
async def process_intake(request: RawInputRequest):
    """
    Intake Agent: Bóc tách ngôn ngữ tự nhiên, kiểm tra ràng buộc ngân sách/ngành hàng.
    Nếu đủ thì chạy Multi-Agent AI (Planner -> CFO -> Persona).
    """
    try:
        raw_text = request.raw_text
        tenant_id = request.tenant_id
        
        # Inject comprehensive_form data into raw_text if provided
        comp_form = request.comprehensive_form or {}
        if comp_form:
            form_context = f"\n[DỮ LIỆU TỪ BỘ CÂU HỎI TRẮC NGHIỆM CHI TIẾT ĐỂ LẬP CHIẾN LƯỢC QUAN TRỌNG]\n{json.dumps(comp_form, ensure_ascii=False)}\n[HẾT DỮ LIỆU CÂU HỎI]"
            raw_text += form_context

        # --- SECRET MOCK MODE INTERCEPTOR ---
        secret_keywords = ["hương viên trà quán", "mã demo 1"]
        if any(keyword in raw_text.lower() for keyword in secret_keywords):
            print("🕵️‍♂️ [MOCK MODE] Kích hoạt dữ liệu giả lập an toàn do có nhắc tới từ khóa...")
            await asyncio.sleep(5)  # Trễ 5s giả lập AI thinking để hiện Loading Spinner trên UI
            
            mock_file = "mock_data/huong_vien_tra.md"
            mock_result = parse_mock_md(mock_file)
            
            plan = mock_result["final_plan"]
            
            if isinstance(plan, str):
                import json
                try:
                    plan = json.loads(plan)
                except json.JSONDecodeError:
                    plan = {}
            
            # Tính lại cost thực tế theo plan mock
            actual_cost = 0
            for phase in plan.get("activity_and_financial_breakdown", []):
                for act in phase.get("activities", []):
                    actual_cost += int(act.get("cost_vnd", 0))
                    
            print("✅ Đủ thông tin, bắt đầu gọi MasterPlanner (MOCK MODE)...")
            
            campaign_name = plan.get("executive_summary", {}).get("campaign_name", "Chiến dịch (Mock)")
            full_mock_logs = [
                {"agent": "CMO", "role": "Giám đốc Marketing", "message": f"Chào các vị lãnh đạo và khách hàng! Giám đốc Marketing xin phép trình bày tóm tắt kế hoạch '{campaign_name}'.\n\nChiến dịch sẽ đi qua 3 giai đoạn: Khơi Hương (Teasing), Tỏa Trà (Traffic), và Lưu Phai (Loyalty). Trọng tâm lớn nhất nằm ở tháng 6, chúng ta sẽ mạnh tay book 3 Mega-TikToker tới thưởng trà và làm video review. Mức đầu tư cho riêng hạng mục KOL này là 30 triệu đồng. Tổng ngân sách tôi xin duyệt là {actual_cost + 5000000:,} VND. Mọi người có ý kiến gì không?"},
                {"agent": "SYSTEM", "role": "Hệ thống Kiểm toán", "message": f"Cảnh báo tự động: Hệ thống ghi nhận ngân sách Marketing đề xuất đã cao hơn so với hạn mức hiện tại. Cần các sếp và đại diện khách hàng vào phiên tòa phản biện để điều chỉnh lại cấu trúc vốn."}
            ]
            full_mock_logs.extend(mock_result["agent_logs"])

            return {
                "status": "success",
                "is_approved": True,
                "iteration_count": 2,
                "actual_total_cost": actual_cost,
                "plan": plan,
                "agent_logs": full_mock_logs
            }
        # ------------------------------------

        # 1. Bóc tách
        parsed_data = analyze_raw_input(raw_text)
        
        # Override budget nếu Frontend gửi lên giá trị cố định
        if request.budget and request.budget >= 1000000:
            parsed_data["budget"] = request.budget
        
        # 2. Kiểm tra
        check_result = check_required_info(parsed_data)
        
        # 3. Trả về câu hỏi nếu thiếu thông tin
        if check_result.get("status") == "clarification_needed":
            return check_result
            
        # 4. Đủ thông tin -> Gọi Pipeline tuyến tính (v7)
        print("✅ Đủ thông tin, bắt đầu gọi Pipeline Deterministic...")
        
        result = run_pipeline(
            goal=parsed_data.get("goal", request.raw_text),
            industry=parsed_data.get("industry", "General"),
            budget=parsed_data.get("budget", 0),
            csfs=parsed_data.get("csfs", []),
            resources=parsed_data.get("resources", ""),
        )
        
        return {
            "status": "success",
            "is_approved": True,
            "iteration_count": 1,
            "actual_total_cost": result.get("actual_total_cost", 0),
            "plan": result["final_plan"],
            "agent_logs": result["agent_logs"]
        }
    except TimeoutError as e:
        print(f"🔴 [INTAKE] Timeout pipeline: {e}")
        raise HTTPException(status_code=504, detail={
            "status": "error",
            "message": "Yeu cau AI qua thoi gian cho phep. Vui long thu lai.",
            "debug_info": str(e)
        })
    except Exception as e:
        print(f"🔴 [INTAKE] Lỗi hệ thống nghiêm trọng: {e}")
        # Trả về payload JSON chuẩn để Frontend xử lý được (tắt loading, hiện thông báo lỗi)
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "Hệ thống AI đang quá tải hoặc gặp sự cố, vui lòng thử lại sau giây lát.",
            "debug_info": str(e)
        })

@app.post("/api/v1/planning/refine")
async def process_refine(request: RefineRequest):
    """
    Endpoint mới: Nhận phản hồi từ user và plan cũ, chạy lại refinement pipeline.
    """
    try:
        print(f"\n[REFINE API] Receive feedback: {request.feedback}")
        tenant_id = request.tenant_id
        
        result = run_refinement_pipeline(
            previous_plan=request.previous_plan,
            feedback=request.feedback,
            budget=request.budget
        )
        
        return {
            "status": "success",
            "is_approved": True,
            "actual_total_cost": result.get("actual_total_cost", 0),
            "plan": result["final_plan"],
            "agent_logs": result["agent_logs"]
        }
    except TimeoutError as e:
        print(f"🔴 [REFINE API] Timeout pipeline: {e}")
        raise HTTPException(status_code=504, detail={
            "status": "error",
            "message": "Yeu cau AI qua thoi gian cho phep. Vui long thu lai.",
            "debug_info": str(e)
        })
    except Exception as e:
        print(f"🔴 [REFINE API] Lỗi xử lý feedback: {e}")
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "AI gặp sự cố khi đang phân tích lại kế hoạch. Vui lòng thử lại.",
            "debug_info": str(e)
        })

@app.post("/api/v1/planning/micro-execute")
async def process_micro_execute(request: MicroExecuteRequest):
    """
    Giai đoạn 4: Sản xuất Content Đơn lẻ (Micro-execution).
    """
    try:
        # Missing implementation: from agents_core import run_cmo_micro_execution, run_customer_agent_feedback
        raise NotImplementedError("agents_core is not implemented yet")
        
        # cmo_content = run_cmo_micro_execution(request.brand_dna, request.usp, request.command)
        
        # persona_feedback = run_customer_agent_feedback(
        #     request.persona_prompt,
        #     "Cần viết theo Tone of Voice phù hợp",
        #     [cmo_content.get("content", "")]
        # )
        
        # return {
        #     "status": "success",
        #     "content": cmo_content.get("content", ""),
        #     "persona_feedback": persona_feedback
        # }
    except Exception as e:
        raise HTTPException(status_code=500, detail={"status": "error", "message": "Lỗi AI sinh nội dung.", "debug_info": str(e)})

@app.get("/api/v1/onboarding/stats")
def get_db_stats():
    """Lấy thống kê số lượng bản ghi trong database."""
    try:
        from app.services.document_processor import DocumentIngestor
        ingestor = DocumentIngestor()
        from langchain_chroma import Chroma
        vectorstore = Chroma(
            collection_name="brandflow_memory",
            embedding_function=ingestor.embeddings,
            persist_directory=ingestor.persist_directory
        )
        return {"status": "success", "count": vectorstore._collection.count()}
    except Exception as e:
        return {"status": "error", "message": str(e), "count": 0}

# =====================================================================
# HỆ THỐNG ASYNC POLLING (CHỊU TẢI 10K CCU VỚI CELERY + REDIS)
# =====================================================================
from pydantic import BaseModel

class AsyncPlanRequest(BaseModel):
    plan_hash: str
    answers: dict = {}

@app.post("/api/v1/tasks/dispatch-plan")
def dispatch_async_task(request: AsyncPlanRequest):
    """
    Thay vì đợi AI chạy 30s-1m có thể đứt request, 
    nhảy luôn vào hàng đợi Redis và nhả ID ra cho Frontend ngay tức thì.
    """
    try:
        from app.core.celery_worker import execute_heavy_ai_plan
        task = execute_heavy_ai_plan.delay({"plan_hash": request.plan_hash, "answers": request.answers})
        return {"status": "success", "task_id": task.id, "message": "Đã xếp hàng vào Background Queue."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lưu ý: Bạn chưa chạy Redis/Celery. {str(e)}")

@app.get("/api/v1/tasks/{task_id}/status")
def get_task_status(task_id: str):
    """
    Frontend dùng ID để hỏi thăm (Polling) 3 giây / lần.
    """
    try:
        from app.core.celery_worker import celery
        task = celery.AsyncResult(task_id)
        if task.state == 'PENDING':
            return {"task_status": "pending", "progress": 0, "message": "Task đang chờ Worker bốc để xử lý."}
        elif task.state == 'PROGRESS':
            return {"task_status": "in_progress", "progress": task.info.get('progress', 0), "message": task.info.get('message', '')}
        elif task.state == 'SUCCESS':
            return {"task_status": "completed", "result": task.result}
        elif task.state == 'FAILURE':
            return {"task_status": "failed", "error": str(task.info)}
        return {"task_status": task.state, "info": str(task.info)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/design/generate")
async def design_generate(request: DesignGenerateRequest):
    """
    Sinh bộ tài sản nhận diện thương hiệu (Brand Identity):
    Logo, Banner, Fanpage concept — dựa trên Brand DNA trong ChromaDB.
    """
    try:
        print(f"\\n🎨 [DESIGN API] Nhận yêu cầu sinh Brand Identity: {request.brand_name}")

        result = generate_brand_identity(
            brand_name=request.brand_name,
            goal=request.goal,
            industry=request.industry,
            target_audience=request.target_audience,
        )

        return {
            "status": "success",
            "logo_url": result["logo_url"],
            "banner_url": result["banner_url"],
            "fanpage_concept": result["fanpage_concept"],
            "design_language": result["design_language"],
            "prompts": result.get("prompts", {}),
        }
    except Exception as e:
        print(f"🔴 [DESIGN API] Lỗi sinh Brand Identity: {e}")
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "AI gặp sự cố khi sinh tài sản thương hiệu. Vui lòng thử lại.",
            "debug_info": str(e)
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True, 
        reload_excludes=["./temp_uploads/*", "./chroma_db/*"]
    )
