"""
AI Form Generator Service
=========================
Pipeline: PDF text → Groq Analysis → Gap Detection → 23 Form Data Generation

4 Nhóm Dữ liệu Framework:
1. Strategic Context & Major Events
2. Competitive Intelligence & Key Issues  
3. Financial Data & Narrative Commentary
4. Execution Mapping & Contingency

REFACTORED: Batched generation (4 lần gọi AI, mỗi lần 3-7 forms)
+ 3 lớp bảo vệ: Batch → Retry → Single form fallback
"""

import os
import json
import time
from typing import Any, Dict, List, Optional

# ── Groq API (Llama 3) ──
try:
    from langchain_groq import ChatGroq
    from langchain_core.messages import HumanMessage
    _GROQ_AVAILABLE = True
except ImportError:
    _GROQ_AVAILABLE = False

# ── Form Schemas ──
FORM_SCHEMAS = {
    "a1-mission": {
        "group": 1,
        "title": "Sứ mệnh & Định nghĩa",
        "fields": {
            "role": "Vai trò của doanh nghiệp",
            "business_def": "Định nghĩa kinh doanh / Giá trị mang lại",
            "purpose": "Mục đích (Brand Purpose)",
            "competency": "Năng lực cốt lõi khác biệt",
            "directions": "Danh sách định hướng [{type: 'will_do'|'might_do'|'never_do', text: '...'}]"
        }
    },
    "a2-performance": {
        "group": 3,
        "title": "Hiệu suất SBU (3 Năm)",
        "fields": {"items": "[{metric, y3, y2, y1, reason}] — Khối lượng, Doanh thu, Biên LN..."}
    },
    "a3-revenue": {
        "group": 3,
        "title": "Dự phóng Doanh thu & Tài chính",
        "fields": {"items": "[{metric, t0, t1, t2, t3, source}] — Doanh thu, LN gộp, nguồn tăng trưởng (Ansoff)"}
    },
    "a4-market": {
        "group": 1,
        "title": "Bản đồ Thị trường",
        "fields": {"items": "[{segment, size, share, growth, desc}] — Phân khúc, quy mô, thị phần"}
    },
    "a5-swot": {
        "group": 2,
        "title": "SWOT & Năng lực cạnh tranh",
        "fields": {"items": "[{ksf, weight, our_score, comp_score, issue}] — CSFs, điểm chấm, vấn đề then chốt"}
    },
    "a6-portfolio": {
        "group": 2,
        "title": "Ma trận Danh mục Sản phẩm",
        "fields": {"items": "[{product, category, position, action, rationale}]"}
    },
    "a7-assumptions": {
        "group": 1,
        "title": "Danh sách Giả định cốt lõi",
        "fields": {"items": "[{id, assumption, category, impact, probability}]"}
    },
    "a8-strategies": {
        "group": 1,
        "title": "Chiến lược Tổng thể",
        "fields": {"items": "[{strategy, objective, kpi, timeline}]"}
    },
    "a9-budget": {
        "group": 3,
        "title": "Ngân sách Chiến lược (3-5 Năm)",
        "fields": {"items": "[{category, y1, y2, y3, total, note}]"}
    },
    "b1-objectives": {
        "group": 4,
        "title": "Mục tiêu Vận hành (1 Năm)",
        "fields": {"items": "[{pair, vol, margin, strategy, budget}] — Cặp SP/Phân khúc, chiến lược chính"}
    },
    "b2-action": {
        "group": 4,
        "title": "Kế hoạch Hành động Chi tiết",
        "fields": {"items": "[{obj, tactic, owner, deadline, cost}] — Mục tiêu phụ → Chiến thuật → Người chịu TN"}
    },
    "b3-budget": {
        "group": 3,
        "title": "Ngân sách Marketing Chi tiết",
        "fields": {"items": "[{item, past, now, next}] — So sánh chi phí 3 năm"}
    },
    "b4-contingency": {
        "group": 4,
        "title": "Kế hoạch Dự phòng",
        "fields": {"items": "[{risk, level, impact, trigger, action}] — Rủi ro, Giả định bị phá vỡ, Trigger, Backup"}
    },
    "b5-pnl": {
        "group": 3,
        "title": "Báo cáo Lãi Lỗ (P&L)",
        "fields": {"items": "[{item, val, ratio}] — Doanh thu, Biên LN, Chi phí MKT, LNHĐ"}
    },
    "b6-gantt": {
        "group": 4,
        "title": "Gantt Chart Chiến thuật",
        "fields": {"items": "[{task, m1, m2, m3, m4, m5, m6, owner}] — Timeline 6 tháng"}
    },
    "c1-direction": {
        "group": 1,
        "title": "Định hướng Chiến lược Dài hạn",
        "fields": {"items": "[{direction, priority, horizon, rationale}]"}
    },
    "c2-history": {
        "group": 3,
        "title": "Lịch sử & Danh mục (BCG Portfolio)",
        "fields": {"items": "[{bcg, sbu, rev, target}] — Phân loại BCG, doanh thu hiện tại, mục tiêu"}
    },
    "c3-issues": {
        "group": 2,
        "title": "Phân tích Vấn đề Then chốt",
        "fields": {"items": "[{sbu, market, comp, issue}] — Gap Analysis, Key Issues"}
    },
    "c4-dashboard": {
        "group": 3,
        "title": "Bảng Điều khiển KPI",
        "fields": {"items": "[{kpi, current, target, trend, action}]"}
    },
}

# Overview forms (generated summaries, no table data needed)
OVERVIEW_FORMS = ["a0-overview", "b0-overview", "c0-overview", "b3-action", "b5-contingency", "b7-gantt", "c2-matrix"]

# ═══════════════════════════════════════════════════════════════════
# BATCHED GENERATION CONFIG
# ═══════════════════════════════════════════════════════════════════
FORM_BATCHES = [
    {
        "name": "Nhom 1: Nen tang va Dinh huong",
        "forms": ["a1-mission", "a4-market", "a7-assumptions", "a8-strategies", "c1-direction"]
    },
    {
        "name": "Nhom 2: Canh tranh va Phan tich",
        "forms": ["a5-swot", "a6-portfolio", "c3-issues"]
    },
    {
        "name": "Nhom 3: Tai chinh va Kinh doanh",
        "forms": ["a2-performance", "a3-revenue", "a9-budget", "b3-budget", "b5-pnl", "c2-history", "c4-dashboard"]
    },
    {
        "name": "Nhom 4: Thuc thi va Rui ro",
        "forms": ["b1-objectives", "b2-action", "b4-contingency", "b6-gantt"]
    },
]

# Per-form JSON schema examples
FORM_SCHEMA_PROMPTS = {
    "a1-mission": """**a1-mission** (Su menh):
{{ "role": "string", "business_def": "string", "purpose": "string", "competency": "string", "directions": [{{"type": "will_do|might_do|never_do", "text": "string"}}] }}""",

    "a2-performance": """**a2-performance** (Hieu suat 3 nam):
{{ "items": [{{"metric": "string", "y3": "string", "y2": "string", "y1": "string", "reason": "string"}}] }}
It nhat 4 rows: Khoi luong ban, Doanh thu thuan, Ty suat LN gop, Bien LN gop""",

    "a3-revenue": """**a3-revenue** (Du phong Tai chinh):
{{ "items": [{{"metric": "string", "t0": "string", "t1": "string", "t2": "string", "t3": "string", "source": "string"}}] }}""",

    "a4-market": """**a4-market** (Ban do Thi truong):
{{ "items": [{{"segment": "string", "size": "string", "share": "string", "growth": "string", "desc": "string"}}] }}""",

    "a5-swot": """**a5-swot** (SWOT va CSFs):
{{ "items": [{{"ksf": "string", "weight": "string", "our_score": "number", "comp_score": "number", "issue": "string"}}] }}
3-5 rows, tong weight = 100%""",

    "a6-portfolio": """**a6-portfolio** (Danh muc SP):
{{ "items": [{{"product": "string", "category": "string", "position": "string", "action": "string", "rationale": "string"}}] }}""",

    "a7-assumptions": """**a7-assumptions** (Gia dinh):
{{ "items": [{{"id": "string", "assumption": "string", "category": "string", "impact": "string", "probability": "string"}}] }}""",

    "a8-strategies": """**a8-strategies** (Chien luoc):
{{ "items": [{{"strategy": "string", "objective": "string", "kpi": "string", "timeline": "string"}}] }}""",

    "a9-budget": """**a9-budget** (Ngan sach 3-5 nam):
{{ "items": [{{"category": "string", "y1": "string", "y2": "string", "y3": "string", "total": "string", "note": "string"}}] }}""",

    "b1-objectives": """**b1-objectives** (Muc tieu 1 nam):
{{ "items": [{{"pair": "string", "vol": "string", "margin": "string", "strategy": "string", "budget": "string"}}] }}""",

    "b2-action": """**b2-action** (Ke hoach Hanh dong):
{{ "items": [{{"obj": "string", "tactic": "string", "owner": "string", "deadline": "string", "cost": "string"}}] }}""",

    "b3-budget": """**b3-budget** (Ngan sach MKT):
{{ "items": [{{"item": "string", "past": "string", "now": "string", "next": "string"}}] }}""",

    "b4-contingency": """**b4-contingency** (Du phong):
{{ "items": [{{"risk": "string", "level": "string", "impact": "string", "trigger": "string", "action": "string"}}] }}""",

    "b5-pnl": """**b5-pnl** (PnL):
{{ "items": [{{"item": "string", "val": "string", "ratio": "string"}}] }}
4 rows: Doanh thu thuan, Bien LN Gop, Chi phi Marketing, Loi nhuan hoat dong""",

    "b6-gantt": """**b6-gantt** (Gantt Chart):
{{ "items": [{{"task": "string", "m1": "string", "m2": "string", "m3": "string", "m4": "string", "m5": "string", "m6": "string", "owner": "string"}}] }}""",

    "c1-direction": """**c1-direction** (Dinh huong dai han):
{{ "items": [{{"direction": "string", "priority": "string", "horizon": "string", "rationale": "string"}}] }}""",

    "c2-history": """**c2-history** (BCG Portfolio):
{{ "items": [{{"bcg": "string", "sbu": "string", "rev": "string", "target": "string"}}] }}""",

    "c3-issues": """**c3-issues** (Van de Then chot):
{{ "items": [{{"sbu": "string", "market": "string", "comp": "string", "issue": "string"}}] }}""",

    "c4-dashboard": """**c4-dashboard** (KPI Dashboard):
{{ "items": [{{"kpi": "string", "current": "string", "target": "string", "trend": "string", "action": "string"}}] }}""",
}


# ═══════════════════════════════════════════════════════════════════
# PROMPTS
# ═══════════════════════════════════════════════════════════════════

GAP_ANALYSIS_PROMPT = """Ban la chuyen gia Marketing Planning (B2B/B2C). 
Phan tich noi dung tai lieu duoi day va so sanh voi 4 NHOM DU LIEU yeu cau:

## 4 NHOM DU LIEU CAN CO:

### Nhom 1: Du lieu Nen tang, Dinh huong va Bien dong
- Dinh vi thuong hieu va Su menh (vai tro, dinh nghia kinh doanh, muc dich, nang luc cot loi)
- Pham vi thi truong (ranh gioi, ban do phan phoi, chan dung phan khuc)
- Danh sach Gia dinh cot loi (Assumptions)
- Dinh huong dai han (se lam, co the lam, khong bao gio lam)
- Su kien va Bien dong lon (Major Events)

### Nhom 2: Du lieu Canh tranh va Phan tich Van de
- Yeu to thanh cong then chot (CSFs) - 3-5 tieu chi quyet dinh mua hang va Trong so
- Diem danh gia va Ma tran SWOT
- Van de then chot (Key Issues) - Gap Analysis

### Nhom 3: Du lieu Tai chinh va Lap luan Kinh doanh
- Du lieu Dinh luong (Doanh thu, Loi nhuan, Khoi luong, ROI, ROS)
- Binh luan Giai trinh Lich su
- Dong luc Tang truong Tuong lai (Ansoff)

### Nhom 4: Du lieu Thuc thi, Lien ket va Rui ro
- Chuoi Lien ket Thuc thi (Muc tieu -> Chien luoc -> Chien thuat -> Nguoi chiu TN -> Timeline -> Ngan sach)  
- Khop noi Rui ro va Gia dinh (Contingency vs. Assumptions)

---

## NOI DUNG TAI LIEU:
{document_text}

---

## YEU CAU:
Phan tich va tra ve JSON voi 2 phan:
1. "found_data": Tom tat nhung gi TIM THAY trong tai lieu, group theo 4 nhom
2. "missing_gaps": Danh sach nhung gi THIEU, moi gap co:
   - "group": So nhom (1-4)
   - "field": Ten field thieu
   - "question": Cau hoi tieng Viet de hoi nguoi dung bo sung
   - "priority": "critical" | "important" | "optional"

CHI liet ke cac gap "critical" va "important". Bo qua "optional".
Tra ve JSON thuan, KHONG markdown code block.
"""

BATCH_GENERATION_PROMPT = """Ban la chuyen gia Chief Marketing Officer voi 20 nam kinh nghiem. Dua tren noi dung tai lieu va cac thong tin bo sung, hay tao DU LIEU CHI TIET cho nhom form duoi day.

## NOI DUNG TAI LIEU GOC:
{document_text}

## THONG TIN BO SUNG TU NGUOI DUNG:
{gap_answers}

## NGUYEN TAC XU LY DU LIEU THIEU:
1. Neu tai lieu CO du lieu -> su dung truc tiep (uu tien cao nhat)
2. Neu tai lieu THIEU hoac KHONG DE CAP -> BAT BUOC phai tu suy luan va de xuat du lieu hop ly dua tren:
   - Nganh nghe va quy mo doanh nghiep duoc mo ta trong tai lieu
   - Benchmark trung binh cua nganh tuong tu tai Viet Nam
   - Kinh nghiem tu van chien luoc thuc te
3. Du lieu do AI de xuat phai ghi prefix "[AI de xuat]" truoc gia tri de nguoi dung biet can review
   Vi du: "[AI de xuat] 2.5 Ty VND" hoac "[AI de xuat] Tang 15% YoY"
4. TUYET DOI KHONG duoc ghi "Can cap nhat" hay de trong — moi o deu phai co du lieu

## YEU CAU:
Tao du lieu JSON cho CAC FORM sau day ({batch_name}).
Moi form phai co du lieu cu the, chi tiet, day du.
Moi form dang bang phai co IT NHAT 3-5 rows du lieu.

### DANH SACH FORM CAN TAO:

{form_schemas}

---

Tra ve JSON object voi key la form_key (vi du "a1-mission") va value la data object tuong ung.
CHI tra ve JSON thuan, KHONG markdown code block, KHONG giai thich, KHONG them text ngoai JSON.
"""

SINGLE_FORM_PROMPT = """Ban la chuyen gia Chief Marketing Officer voi 20 nam kinh nghiem.
Dua tren noi dung tai lieu, hay tao DU LIEU CHI TIET cho form duoi day.

## NOI DUNG TAI LIEU GOC:
{document_text}

## THONG TIN BO SUNG:
{gap_answers}

## NGUYEN TAC:
- Neu du lieu CO trong tai lieu -> dung truc tiep
- Neu THIEU -> Suy luan va de xuat dua tren nganh nghe, ghi prefix "[AI de xuat]"
- TUYET DOI KHONG ghi "Can cap nhat" hay de trong
- Bang phai co IT NHAT 3 rows

## FORM CAN TAO:
{form_schema}

---
CHI tra ve JSON data object cho form nay (KHONG wrap trong key).
Vi du dung: {{"items": [...]}}
Tra ve JSON thuan, KHONG markdown code block.
"""


# ═══════════════════════════════════════════════════════════════════
# CORE FUNCTIONS
# ═══════════════════════════════════════════════════════════════════

def _get_groq_model(temperature: float = 0.2, model_name: str = "llama-3.3-70b-versatile"):
    """Initialize Groq model."""
    if not _GROQ_AVAILABLE:
        raise RuntimeError("langchain-groq package not installed")
    
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY not set in .env")
    
    return ChatGroq(
        api_key=api_key, 
        model=model_name, 
        temperature=temperature,
        max_tokens=8000,
        max_retries=2
    )


def _clean_json_response(text: str) -> str:
    """Remove markdown code blocks from AI response."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


def analyze_gaps(document_text: str) -> Dict[str, Any]:
    """
    Step 1: Analyze document against 4-group framework.
    Returns found data and missing gaps with questions.
    """
    model = _get_groq_model(temperature=0.2)
    
    max_chars = 33000
    truncated = document_text[:max_chars] if len(document_text) > max_chars else document_text
    
    prompt = GAP_ANALYSIS_PROMPT.format(document_text=truncated)
    
    try:
        response = model.invoke([HumanMessage(content=prompt)])
        raw_text = response.content
        cleaned = _clean_json_response(raw_text)
        result = json.loads(cleaned)
    except Exception as e:
        print(f"[MOCK MODE] Loi goi API AI ({e}). Tu dong dung MOCK DATA de test workflow.")
        result = {
            "found_data": {
                "group_1": "Da tim thay Thong tin San pham va mot it co cau to chuc.",
                "group_3": "Chua co du lieu tai chinh loi nhuan."
            },
            "missing_gaps": [
                {
                    "group": 3,
                    "field": "financial_performance",
                    "question": "Trong tai lieu khong thay nhac den So lieu Tai chinh (Doanh thu/Loi nhuan) 3 nam gan day. Vui long cung cap so bo.",
                    "priority": "critical"
                },
                {
                    "group": 1,
                    "field": "core_competency",
                    "question": "Dau la Nang luc cot loi khac biet nhat cua doanh nghiep so voi doi thu?",
                    "priority": "critical"
                },
                {
                    "group": 4,
                    "field": "marketing_budget",
                    "question": "Ngan sach Marketing du kien cho chien dich toi la bao nhieu (VND)?",
                    "priority": "important"
                }
            ]
        }
    
    return result


# ═══════════════════════════════════════════════════════════════════
# 3-LAYER FORM GENERATION SYSTEM
# Lop 1: Batch generation (4 nhom)
# Lop 2: Retry batch that bai
# Lop 3: Generate tung form don le cho forms con thieu
# ═══════════════════════════════════════════════════════════════════

def _is_valid_form_data(form_key: str, data: Any) -> bool:
    """Kiểm tra xem schema do AI sinh ra có đúng chuẩn không, nếu không đúng Drop/Fallback."""
    if not isinstance(data, dict): return False
    if form_key == "a1-mission":
        for k in ["role", "business_def", "purpose", "competency", "directions"]:
            if k not in data: return False
        return True
    if "items" not in data or not isinstance(data["items"], list) or len(data["items"]) == 0:
        return False
    return True

def _generate_batch(batch_name: str, form_keys: list, document_text: str, answers_text: str) -> Dict[str, Any]:
    """Generate forms for a single batch group using multiple models on rate limit."""
    fallback_models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768"]
    
    schema_parts = [FORM_SCHEMA_PROMPTS[k] for k in form_keys if k in FORM_SCHEMA_PROMPTS]
    schemas = "\n\n".join(schema_parts)
    
    prompt = BATCH_GENERATION_PROMPT.format(
        document_text=document_text,
        gap_answers=answers_text,
        batch_name=batch_name,
        form_schemas=schemas
    )
    
    for model_name in fallback_models:
        try:
            model = _get_groq_model(temperature=0.3, model_name=model_name)
            response = model.invoke([HumanMessage(content=prompt)])
            raw_text = response.content
            cleaned = _clean_json_response(raw_text)
            result = json.loads(cleaned)
            return result
        except json.JSONDecodeError as e:
            try:
                last_brace = cleaned.rfind("}")
                if last_brace > 0:
                    truncated_json = cleaned[:last_brace + 1]
                    open_count = truncated_json.count("{") - truncated_json.count("}")
                    truncated_json += "}" * open_count
                    return json.loads(truncated_json)
            except:
                pass
            print(f"  [WARN] Batch '{batch_name}' JSON format error with {model_name}, trying next model.")
        except Exception as e:
            err_msg = str(e).lower()
            if "rate limit" in err_msg or "rate_limit_exceeded" in err_msg or "429" in err_msg:
                print(f"  [WARN] Rate limit on {model_name}, switching to next model...")
                time.sleep(1)
                continue
            print(f"  [WARN] Batch '{batch_name}' error with {model_name}: {e}")
            break
            
    return {}


def _generate_single_form(form_key: str, document_text: str, answers_text: str) -> Optional[Dict[str, Any]]:
    """Lop 3: Generate 1 form don le khi batch that bai."""
    if form_key not in FORM_SCHEMA_PROMPTS:
        return None
    
    fallback_models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768"]
    schema = FORM_SCHEMA_PROMPTS[form_key]
    
    prompt = SINGLE_FORM_PROMPT.format(
        document_text=document_text[:20000],
        gap_answers=answers_text,
        form_schema=schema
    )
    
    for model_name in fallback_models:
        try:
            model = _get_groq_model(temperature=0.3, model_name=model_name)
            response = model.invoke([HumanMessage(content=prompt)])
            raw_text = response.content
            cleaned = _clean_json_response(raw_text)
            result_dict = json.loads(cleaned)
            valid_results = {}
            for k, v in result_dict.items():
                if _is_valid_form_data(k, v):
                    valid_results[k] = v
                else:
                    print(f"    [WARN] Batch invalid data schema for {k}")
            return valid_results
        except Exception as e:
            err_msg = str(e).lower()
            if "rate limit" in err_msg or "rate_limit_exceeded" in err_msg or "429" in err_msg:
                print(f"    [WARN] Rate limit on {model_name} for {form_key}, retrying...")
                continue
            print(f"    [WARN] Single form '{form_key}' failed with {model_name}: {e}")
            break
            
    return None

import re

def _generate_mock_data_for_schema(form_key: str) -> Dict[str, Any]:
    """Generates schema-compliant placeholder data if AI completely fails."""
    if form_key == "a1-mission":
        return {
            "role": "[AI de xuat] Can cap nhat",
            "business_def": "[AI de xuat] Can cap nhat",
            "purpose": "[AI de xuat] Can cap nhat",
            "competency": "[AI de xuat] Can cap nhat",
            "directions": [{"type": "will_do", "text": "[AI de xuat] Can cap nhat"}]
        }
    
    schema_str = FORM_SCHEMA_PROMPTS.get(form_key, "")
    match = re.search(r'\[\{\{(.*?)\}\}\]', schema_str)
    
    if not match:
        return {"items": [{"metric": "[AI de xuat] Can cap nhat", "note": "[AI de xuat] Can cap nhat"}]}
        
    keys_part = match.group(1)
    keys = re.findall(r'"([a-zA-Z0-9_]+)"\s*:', keys_part)
    
    if not keys:
         return {"items": [{"metric": "[AI de xuat] Can cap nhat", "note": "[AI de xuat] Can cap nhat"}]}
         
    items = []
    for i in range(3):
        item = {}
        for k in keys:
            if "score" in k or k in ["val", "ratio", "our_score", "comp_score"]:
                item[k] = 0
            else:
                item[k] = f"[AI de xuat] Hang muc {i+1}"
        items.append(item)
        
    return {"items": items}


def generate_all_forms(document_text: str, gap_answers: Dict[str, str]) -> Dict[str, Any]:
    """
    Step 2: Generate ALL 19 forms with 3-layer protection.
    
    Lop 1: Batch generation (4 nhom, moi nhom 3-7 forms)
    Lop 2: Retry batch that bai (cho 3s roi goi lai)
    Lop 3: Generate tung form don le cho forms con thieu
    """
    max_chars = 33000
    truncated = document_text[:max_chars] if len(document_text) > max_chars else document_text
    answers_text = "\n".join([f"- {k}: {v}" for k, v in gap_answers.items()]) if gap_answers else "Khong co thong tin bo sung."
    
    all_forms = {}
    
    # == LOP 1 & 2: Batch generation voi retry ==
    for i, batch in enumerate(FORM_BATCHES):
        batch_name = batch["name"]
        form_keys = batch["forms"]
        
        print(f"\n[{i+1}/{len(FORM_BATCHES)}] Dang tao {batch_name} ({len(form_keys)} forms)...")
        
        if i > 0:
            time.sleep(2)
        
        # Lop 1: Goi batch lan 1
        batch_result = _generate_batch(batch_name, form_keys, truncated, answers_text)
        
        if batch_result:
            all_forms.update(batch_result)
            missing_in_batch = [k for k in form_keys if k not in batch_result]
            print(f"  [OK] Hoan thanh: {list(batch_result.keys())}")
            if missing_in_batch:
                print(f"  [WARN] Thieu trong batch: {missing_in_batch}")
        else:
            print(f"  [FAIL] Batch that bai lan 1, retry sau 3s...")
            
            # Lop 2: Retry sau 3 giay
            time.sleep(3)
            batch_result = _generate_batch(batch_name, form_keys, truncated, answers_text)
            
            if batch_result:
                all_forms.update(batch_result)
                print(f"  [OK] Retry thanh cong: {list(batch_result.keys())}")
            else:
                print(f"  [FAIL] Batch that bai lan 2, chuyen Lop 3...")
    
    # == LOP 3: Generate tung form don le cho forms con thieu ==
    missing_forms = [key for key in FORM_SCHEMAS.keys() if key not in all_forms]
    
    if missing_forms:
        print(f"\n[Lop 3] Dang generate {len(missing_forms)} forms don le: {missing_forms}")
        for j, form_key in enumerate(missing_forms):
            print(f"  [{j+1}/{len(missing_forms)}] Generating: {form_key}...")
            if j > 0:
                time.sleep(1)
            
            single_result = _generate_single_form(form_key, truncated, answers_text)
            if single_result and _is_valid_form_data(form_key, single_result):
                all_forms[form_key] = single_result
                print(f"    [OK] {form_key} thanh cong!")
            else:
                # Fallback cuoi cung (cuc ky hiem khi xay ra hoac do API rate limit)
                print(f"    [FAIL] {form_key} fallback placeholder")
                all_forms[form_key] = _generate_mock_data_for_schema(form_key)
    
    print(f"\n[DONE] Tong ket: {len(all_forms)}/{len(FORM_SCHEMAS)} forms da duoc tao.")
    return all_forms


def save_forms_to_db(project_id: str, user_id: str, forms_data: Dict[str, Any]) -> int:
    """
    Step 3: Save generated form data to database.
    Returns number of forms saved.
    """
    from app.services.form_crud import save_form
    from app.core.database import SessionLocal
    from app.models.models import Project, User
    
    db = SessionLocal()
    
    # Auto-create User and Project if not exist to prevent ForeignKeyViolation
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(id=user_id, email=f"{user_id}@example.com", display_name="Default User")
            db.add(user)
            db.commit()
            print(f"  [CREATE] User {user_id} automatically created.")
            
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            project = Project(id=project_id, user_id=user_id, name="Default Project")
            db.add(project)
            db.commit()
            print(f"  [CREATE] Project {project_id} automatically created.")
    except Exception as e:
        db.rollback()
        print(f"  [WARN] Failed to auto-create user/project schemas: {e}")
        
    count = 0
    try:
        for form_key, form_data in forms_data.items():
            if form_key in FORM_SCHEMAS or form_key in OVERVIEW_FORMS:
                try:
                    save_form(db, project_id, form_key, form_data)
                    count += 1
                    print(f"  [SAVED] {form_key}")
                except Exception as e:
                    db.rollback() # Khôi phục session cho phiên bị lỗi
                    print(f"  [FAIL] {form_key}: {e}")
    finally:
        db.close()
    
    return count
