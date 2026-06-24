"""
Pydantic schemas cho Form Data CRUD API.
Tách riêng với ORM models vì input/output API khác cấu trúc DB.
"""
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import datetime


# ── USER ───────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: Optional[str] = None
    display_name: Optional[str] = None
    tier: str = Field("FREE", description="FREE / PLUS / PRO")


class UserOut(BaseModel):
    id: str
    email: Optional[str] = None
    display_name: Optional[str] = None
    tier: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ── PROJECT ────────────────────────────────────────────────────────
class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=500)
    industry: str = Field("General", max_length=100)
    description: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    industry: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    is_archived: Optional[bool] = None


class ProjectOut(BaseModel):
    id: str
    user_id: str
    name: str
    industry: str
    description: Optional[str] = None
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectWithForms(ProjectOut):
    """Project kèm danh sách form_key đã có data."""
    filled_forms: List[str] = []


# ── FORM DATA ──────────────────────────────────────────────────────
class FormDataSave(BaseModel):
    """Body gửi lên khi save 1 form."""
    data: Dict[str, Any] = Field(..., description="JSON data of the form")
    version: Optional[int] = Field(None, description="Current version for optimistic locking")


class FormDataOut(BaseModel):
    id: str
    project_id: str
    form_key: str
    data: Dict[str, Any]
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class FormDataBulkSave(BaseModel):
    """Save nhiều form cùng lúc."""
    forms: Dict[str, Dict[str, Any]] = Field(
        ...,
        description="Dict[form_key, form_data]. VD: {'a1-mission': {...}, 'a2-performance': {...}}"
    )


class AllFormsOut(BaseModel):
    """Tất cả form data của 1 project."""
    project_id: str
    forms: Dict[str, FormDataOut] = {}
    total_forms: int = 0
