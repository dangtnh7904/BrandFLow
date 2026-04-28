"""
BrandFlow ORM Models
Thiết kế phân cấp: User → Project → FormData
Hỗ trợ multi-tenant, mỗi user có nhiều project, mỗi project có 23 form.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Float,
    DateTime, ForeignKey, JSON, UniqueConstraint, Index, Boolean
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


# ═══════════════════════════════════════════════════════════════════
# USER — Tài khoản người dùng (sẵn sàng scale multi-tenant)
# ═══════════════════════════════════════════════════════════════════
class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=_uuid)
    email = Column(String(255), unique=True, nullable=True, index=True)
    display_name = Column(String(255), nullable=True)
    tier = Column(String(10), default="FREE", nullable=False)  # FREE / PLUS / PRO
    password_hash = Column(String(255), nullable=True) # Mật khẩu mã hoá (NẾU ĐĂNG KÝ BẰNG EMAIL)
    avatar_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)

    # Relationships
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email or self.id}>"


# ═══════════════════════════════════════════════════════════════════
# PROJECT — Mỗi user có nhiều project (kế hoạch marketing)
# ═══════════════════════════════════════════════════════════════════
class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(500), nullable=False)
    industry = Column(String(100), default="General")
    description = Column(Text, nullable=True)
    is_archived = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="projects")
    form_entries = relationship("FormData", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project {self.name}>"


# ═══════════════════════════════════════════════════════════════════
# FORM_DATA — Dữ liệu 23 form, mỗi form lưu 1 row JSON
# ═══════════════════════════════════════════════════════════════════
# form_key values:
#   Phase A: a0-overview, a1-mission, a2-performance, a3-revenue,
#            a4-market, a5-swot, a6-portfolio, a7-assumptions,
#            a8-strategies, a9-budget
#   Phase B: b0-overview, b1-objectives, b2-action, b3-budget,
#            b4-contingency, b5-pnl, b6-gantt
#   Phase C: c0-overview, c1-direction, c2-history, c3-issues,
#            c4-dashboard
# ═══════════════════════════════════════════════════════════════════
class FormData(Base):
    __tablename__ = "form_data"

    id = Column(String(36), primary_key=True, default=_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    form_key = Column(String(50), nullable=False)  # e.g. "a1-mission"
    data = Column(JSON, nullable=False, default=dict)  # Flexible JSON per form type
    version = Column(Integer, default=1, nullable=False)  # Optimistic concurrency
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="form_entries")

    # Constraints
    __table_args__ = (
        # 1 project chỉ có 1 entry cho mỗi form_key
        UniqueConstraint("project_id", "form_key", name="uq_project_form"),
        # Index tối ưu query form by project
        Index("ix_form_project_key", "project_id", "form_key"),
    )

    def __repr__(self):
        return f"<FormData {self.form_key} v{self.version}>"

# ═══════════════════════════════════════════════════════════════════
# BUSINESS_METRIC — Dữ liệu phân tích và đánh giá doanh nghiệp (Agent 0)
# ═══════════════════════════════════════════════════════════════════
class BusinessMetric(Base):
    __tablename__ = "business_metrics"

    id = Column(String(36), primary_key=True, default=_uuid)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    # Nhóm 1: Phễu thị trường (Market Funnel) - Ngành
    tam = Column(Float, nullable=True) # Total Addressable Market
    sam = Column(Float, nullable=True) # Serviceable Addressable Market
    som = Column(Float, nullable=True) # Serviceable Obtainable Market
    cagr = Column(Float, nullable=True) # Compound Annual Growth Rate (%)
    
    # Nhóm 2: Sức khỏe Tài chính (Financial Health) - Doanh nghiệp
    cac = Column(Float, nullable=True) # Customer Acquisition Cost
    ltv = Column(Float, nullable=True) # Lifetime Value
    ltv_cac_ratio = Column(Float, nullable=True) # Tỷ lệ LTV/CAC
    roi = Column(Float, nullable=True) # Return on Investment (%)
    
    # Nhóm 3: Cạnh tranh & Xu hướng (Market Position)
    market_share = Column(Float, nullable=True) # Thị phần (%)
    retention_rate = Column(Float, nullable=True) # Tỷ lệ giữ chân (%)
    proxy_nps = Column(Float, nullable=True) # Net Promoter Score giả lập
    
    # Nhóm 4: AI Telemetry (Công nghệ - JSON linh hoạt)
    ai_telemetry_data = Column(JSON, nullable=True, default=dict)
    
    created_at = Column(DateTime, default=_now, nullable=False)
    updated_at = Column(DateTime, default=_now, onupdate=_now, nullable=False)

    # Relationships
    project = relationship("Project", backref="metrics")

    def __repr__(self):
        return f"<BusinessMetric Project: {self.project_id}>"
