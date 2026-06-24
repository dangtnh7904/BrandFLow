"""
CRUD Service Layer cho Form Data.
Tách logic DB ra khỏi API route để dễ test + tái sử dụng.
"""
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.models import User, Project, FormData


# ═══════════════════════════════════════════════════════════════════
# USER CRUD
# ═══════════════════════════════════════════════════════════════════

def get_or_create_user(
    db: Session,
    user_id: str,
    email: Optional[str] = None,
    display_name: Optional[str] = None,
    tier: str = "FREE",
) -> User:
    """Lấy user theo ID, tạo mới nếu chưa có (upsert-like)."""
    user = db.get(User, user_id)
    if user:
        return user

    user = User(
        id=user_id,
        email=email,
        display_name=display_name,
        tier=tier,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user(db: Session, user_id: str) -> Optional[User]:
    return db.get(User, user_id)


# ═══════════════════════════════════════════════════════════════════
# PROJECT CRUD
# ═══════════════════════════════════════════════════════════════════

def create_project(
    db: Session,
    user_id: str,
    name: str,
    industry: str = "General",
    description: Optional[str] = None,
) -> Project:
    project = Project(
        user_id=user_id,
        name=name,
        industry=industry,
        description=description,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def get_project(db: Session, project_id: str, user_id: str) -> Optional[Project]:
    """Lấy project chỉ khi thuộc đúng user (tenant isolation)."""
    stmt = select(Project).where(
        Project.id == project_id,
        Project.user_id == user_id,
    )
    return db.execute(stmt).scalar_one_or_none()


def list_projects(db: Session, user_id: str, include_archived: bool = False) -> List[Project]:
    stmt = select(Project).where(Project.user_id == user_id)
    if not include_archived:
        stmt = stmt.where(Project.is_archived == False)
    stmt = stmt.order_by(Project.updated_at.desc())
    return list(db.execute(stmt).scalars().all())


def update_project(
    db: Session,
    project_id: str,
    user_id: str,
    **kwargs,
) -> Optional[Project]:
    project = get_project(db, project_id, user_id)
    if not project:
        return None

    for key, value in kwargs.items():
        if value is not None and hasattr(project, key):
            setattr(project, key, value)

    project.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: str, user_id: str) -> bool:
    project = get_project(db, project_id, user_id)
    if not project:
        return False
    db.delete(project)
    db.commit()
    return True


# ═══════════════════════════════════════════════════════════════════
# FORM DATA CRUD
# ═══════════════════════════════════════════════════════════════════

def save_form(
    db: Session,
    project_id: str,
    form_key: str,
    data: Dict[str, Any],
    expected_version: Optional[int] = None,
) -> FormData:
    """
    Upsert form data cho 1 form_key trong 1 project.
    Hỗ trợ optimistic locking qua expected_version.
    """
    stmt = select(FormData).where(
        FormData.project_id == project_id,
        FormData.form_key == form_key,
    )
    existing = db.execute(stmt).scalar_one_or_none()

    if existing:
        # Optimistic lock: nếu client gửi version cũ, reject
        if expected_version is not None and existing.version != expected_version:
            raise ValueError(
                f"Version conflict: expected {expected_version}, "
                f"but DB has {existing.version}. "
                f"Someone else updated this form."
            )
        existing.data = data
        existing.version += 1
        existing.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    # Tạo mới
    form_entry = FormData(
        project_id=project_id,
        form_key=form_key,
        data=data,
        version=1,
    )
    db.add(form_entry)
    db.commit()
    db.refresh(form_entry)
    return form_entry


def get_form(db: Session, project_id: str, form_key: str) -> Optional[FormData]:
    stmt = select(FormData).where(
        FormData.project_id == project_id,
        FormData.form_key == form_key,
    )
    return db.execute(stmt).scalar_one_or_none()


def get_all_forms(db: Session, project_id: str) -> List[FormData]:
    """Lấy toàn bộ form data của 1 project."""
    stmt = (
        select(FormData)
        .where(FormData.project_id == project_id)
        .order_by(FormData.form_key)
    )
    return list(db.execute(stmt).scalars().all())


def get_filled_form_keys(db: Session, project_id: str) -> List[str]:
    """Chỉ lấy danh sách form_key đã có data (cho progress tracking)."""
    stmt = (
        select(FormData.form_key)
        .where(FormData.project_id == project_id)
        .order_by(FormData.form_key)
    )
    return list(db.execute(stmt).scalars().all())


def bulk_save_forms(
    db: Session,
    project_id: str,
    forms: Dict[str, Dict[str, Any]],
) -> List[FormData]:
    """Save nhiều form cùng lúc (cho auto-save batch)."""
    results = []
    for form_key, form_data in forms.items():
        entry = save_form(db, project_id, form_key, form_data)
        results.append(entry)
    return results


def delete_form(db: Session, project_id: str, form_key: str) -> bool:
    form_entry = get_form(db, project_id, form_key)
    if not form_entry:
        return False
    db.delete(form_entry)
    db.commit()
    return True
