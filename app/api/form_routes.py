"""
FastAPI Router cho Form Data CRUD.
Prefix: /api/v1/forms

Tenant isolation: Mọi query đều filter theo user_id từ header.
Khi scale lên auth (JWT/OAuth), chỉ cần thay _resolve_user_id().
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.services import form_crud
from app.schemas.form_schemas import (
    UserCreate, UserOut,
    ProjectCreate, ProjectUpdate, ProjectOut, ProjectWithForms,
    FormDataSave, FormDataOut, FormDataBulkSave, AllFormsOut,
)
from app.api.auth_routes import get_current_user

router = APIRouter(prefix="/api/v1/forms", tags=["Form Data"])


# ═══════════════════════════════════════════════════════════════════
# USER ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

@router.post("/users", response_model=UserOut, summary="Tạo hoặc lấy user")
def upsert_user(
    body: UserCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = form_crud.get_or_create_user(
        db, user_id=user_id,
        email=body.email,
        display_name=body.display_name,
        tier=body.tier,
    )
    return user


@router.get("/users/me", response_model=UserOut, summary="Lấy thông tin user hiện tại")
def read_current_user(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = form_crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User chưa tồn tại. Gọi POST /users trước.")
    return user


# ═══════════════════════════════════════════════════════════════════
# PROJECT ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

@router.post("/projects", response_model=ProjectOut, summary="Tạo project mới")
def create_project(
    body: ProjectCreate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Auto-create user nếu chưa có
    form_crud.get_or_create_user(db, user_id=user_id)
    project = form_crud.create_project(
        db, user_id=user_id,
        name=body.name,
        industry=body.industry,
        description=body.description,
    )
    return project


@router.get("/projects", response_model=list[ProjectOut], summary="Danh sách project của user")
def list_projects(
    include_archived: bool = False,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return form_crud.list_projects(db, user_id=user_id, include_archived=include_archived)


@router.get("/projects/{project_id}", response_model=ProjectWithForms, summary="Chi tiết project + progress")
def get_project(
    project_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    filled = form_crud.get_filled_form_keys(db, project_id)
    return ProjectWithForms(
        id=project.id,
        user_id=project.user_id,
        name=project.name,
        industry=project.industry,
        description=project.description,
        is_archived=project.is_archived,
        created_at=project.created_at,
        updated_at=project.updated_at,
        filled_forms=filled,
    )


@router.put("/projects/{project_id}", response_model=ProjectOut, summary="Cập nhật project")
def update_project(
    project_id: str,
    body: ProjectUpdate,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = form_crud.update_project(
        db, project_id, user_id,
        name=body.name,
        industry=body.industry,
        description=body.description,
        is_archived=body.is_archived,
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")
    return project


@router.delete("/projects/{project_id}", summary="Xóa project và tất cả form data")
def delete_project(
    project_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ok = form_crud.delete_project(db, project_id, user_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")
    return {"status": "success", "message": "Đã xóa project và toàn bộ dữ liệu form."}


# ═══════════════════════════════════════════════════════════════════
# FORM DATA ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

@router.put(
    "/projects/{project_id}/forms/{form_key}",
    response_model=FormDataOut,
    summary="Lưu/cập nhật data 1 form (upsert)",
)
def save_form(
    project_id: str,
    form_key: str,
    body: FormDataSave,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Kiểm tra ownership
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    try:
        entry = form_crud.save_form(
            db, project_id, form_key,
            data=body.data,
            expected_version=body.version,
        )
        return entry
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get(
    "/projects/{project_id}/forms/{form_key}",
    response_model=FormDataOut,
    summary="Lấy data 1 form",
)
def get_form(
    project_id: str,
    form_key: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Kiểm tra ownership
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    entry = form_crud.get_form(db, project_id, form_key)
    if not entry:
        raise HTTPException(status_code=404, detail=f"Chưa có data cho form '{form_key}'.")
    return entry


@router.get(
    "/projects/{project_id}/forms",
    response_model=AllFormsOut,
    summary="Lấy tất cả form data của project",
)
def get_all_forms(
    project_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    entries = form_crud.get_all_forms(db, project_id)
    forms_dict = {}
    for entry in entries:
        forms_dict[entry.form_key] = FormDataOut.model_validate(entry)

    return AllFormsOut(
        project_id=project_id,
        forms=forms_dict,
        total_forms=len(forms_dict),
    )


@router.post(
    "/projects/{project_id}/forms/bulk",
    response_model=list[FormDataOut],
    summary="Lưu nhiều form cùng lúc (batch auto-save)",
)
def bulk_save_forms(
    project_id: str,
    body: FormDataBulkSave,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    entries = form_crud.bulk_save_forms(db, project_id, body.forms)
    return entries


@router.delete(
    "/projects/{project_id}/forms/{form_key}",
    summary="Xóa data 1 form",
)
def delete_form(
    project_id: str,
    form_key: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    ok = form_crud.delete_form(db, project_id, form_key)
    if not ok:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy data cho form '{form_key}'.")
    return {"status": "success", "message": f"Đã xóa data form '{form_key}'."}


# ═══════════════════════════════════════════════════════════════════
# BRAND DNA PERSISTENCE
# ═══════════════════════════════════════════════════════════════════

from pydantic import BaseModel as PydanticBaseModel
from typing import Dict, Any

class BrandDNASave(PydanticBaseModel):
    dna_data: Dict[str, Any]
    intake_analysis: Dict[str, Any] = {}
    brand_name: str = ""
    source: str = "wizard"


@router.post("/brand-dna", summary="Lưu Brand DNA")
def save_brand_dna(
    body: BrandDNASave,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Save or update Brand DNA analysis result for the current user."""
    from app.models.models import BrandDNA
    
    # Upsert: update latest or create new
    existing = db.query(BrandDNA).filter(
        BrandDNA.user_id == user_id
    ).order_by(BrandDNA.created_at.desc()).first()
    
    if existing:
        existing.dna_data = body.dna_data
        existing.intake_analysis = body.intake_analysis
        existing.brand_name = body.brand_name or body.dna_data.get("brand_name", "")
        existing.source = body.source
    else:
        existing = BrandDNA(
            user_id=user_id,
            dna_data=body.dna_data,
            intake_analysis=body.intake_analysis,
            brand_name=body.brand_name or body.dna_data.get("brand_name", ""),
            source=body.source,
        )
        db.add(existing)
    
    db.commit()
    db.refresh(existing)
    
    # Update cache
    try:
        from app.core.cache_layer import SmartCache
        SmartCache.instance().set_dna(user_id, body.dna_data)
    except Exception:
        pass
    
    return {
        "status": "success",
        "id": existing.id,
        "brand_name": existing.brand_name,
    }


@router.get("/brand-dna", summary="Lấy Brand DNA đã lưu")
def get_brand_dna(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the latest Brand DNA for current user. Checks cache first."""
    # Check cache
    try:
        from app.core.cache_layer import SmartCache
        cached = SmartCache.instance().get_dna(user_id)
        if cached:
            return {"status": "success", "data": cached, "cached": True}
    except Exception:
        pass
    
    from app.models.models import BrandDNA
    
    entry = db.query(BrandDNA).filter(
        BrandDNA.user_id == user_id
    ).order_by(BrandDNA.created_at.desc()).first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Chưa có Brand DNA. Hoàn thành onboarding trước.")
    
    # Populate cache
    try:
        from app.core.cache_layer import SmartCache
        SmartCache.instance().set_dna(user_id, entry.dna_data)
    except Exception:
        pass
    
    return {
        "status": "success",
        "data": entry.dna_data,
        "intake_analysis": entry.intake_analysis,
        "brand_name": entry.brand_name,
        "source": entry.source,
        "updated_at": entry.updated_at.isoformat() if entry.updated_at else None,
    }

