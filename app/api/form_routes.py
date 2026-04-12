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

router = APIRouter(prefix="/api/v1/forms", tags=["Form Data"])


# ── User Resolution ───────────────────────────────────────────────
# Hiện tại dùng header X-User-Id (đơn giản cho dev).
# Khi scale lên auth, thay bằng JWT decode → user_id.
def _resolve_user_id(x_user_id: str = Header("anonymous", alias="X-User-Id")) -> str:
    return (x_user_id or "anonymous").strip() or "anonymous"


# ═══════════════════════════════════════════════════════════════════
# USER ENDPOINTS
# ═══════════════════════════════════════════════════════════════════

@router.post("/users", response_model=UserOut, summary="Tạo hoặc lấy user")
def upsert_user(
    body: UserCreate,
    user_id: str = Depends(_resolve_user_id),
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
def get_current_user(
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
    db: Session = Depends(get_db),
):
    return form_crud.list_projects(db, user_id=user_id, include_archived=include_archived)


@router.get("/projects/{project_id}", response_model=ProjectWithForms, summary="Chi tiết project + progress")
def get_project(
    project_id: str,
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
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
    user_id: str = Depends(_resolve_user_id),
    db: Session = Depends(get_db),
):
    project = form_crud.get_project(db, project_id, user_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project không tồn tại hoặc không thuộc user này.")

    ok = form_crud.delete_form(db, project_id, form_key)
    if not ok:
        raise HTTPException(status_code=404, detail=f"Không tìm thấy data cho form '{form_key}'.")
    return {"status": "success", "message": f"Đã xóa data form '{form_key}'."}
