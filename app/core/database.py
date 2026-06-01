"""
BrandFlow Database Engine
- Dev: SQLite (zero-config, đổi sang PostgreSQL chỉ cần thay DATABASE_URL trong .env)
- Prod: PostgreSQL (scale theo user)
"""
import os
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# ── Connection string ──────────────────────────────────────────────
# Dev  : sqlite:///./brandflow.db  (default, zero-config)
# Prod : postgresql+psycopg2://user:pass@host:5432/brandflow
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "sqlite:///./brandflow.db"
)

# SOC 2 Requirement: Bắt buộc kết nối Database qua SSL/TLS trên Production
if DATABASE_URL.startswith("postgres"):
    if "?" in DATABASE_URL:
        if "sslmode=" not in DATABASE_URL:
            DATABASE_URL += "&sslmode=require"
    else:
        DATABASE_URL += "?sslmode=require"

# ── Engine ─────────────────────────────────────────────────────────
_is_sqlite = DATABASE_URL.startswith("sqlite")

engine = create_engine(
    DATABASE_URL,
    # SQLite cần check_same_thread=False cho FastAPI multi-thread
    connect_args={"check_same_thread": False} if _is_sqlite else {},
    # PostgreSQL pool config cho high concurrency
    pool_size=20 if not _is_sqlite else 5,
    max_overflow=10 if not _is_sqlite else 10,
    pool_timeout=30,
    pool_pre_ping=True,
    echo=False,
)

# ── Bật WAL mode cho SQLite (concurrent reads + writes) ────────────
if _is_sqlite:
    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

# ── Session factory ────────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# ── Base class cho tất cả models ───────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Dependency cho FastAPI ─────────────────────────────────────────
def get_db():
    """Yield a DB session rồi tự đóng khi request xong."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Tạo tất cả bảng nếu chưa có. Gọi 1 lần khi startup."""
    # Import models để đăng ký vào Base.metadata trước khi create_all
    import app.models.models  # noqa: F401
    Base.metadata.create_all(bind=engine, checkfirst=True)
