import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt  # PyJWT

from app.models.models import User
from app.core.database import get_db

import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# JWT Config
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "SUPER_SECRET_KEY_BRANDFLOW_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Social Auth Config
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")
FACEBOOK_APP_ID = os.environ.get("FACEBOOK_APP_ID", "YOUR_FACEBOOK_APP_ID")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    print(f"[AUTH_DEBUG] Received token: {token}")
    if not token:
        print("[AUTH_DEBUG] Token is missing!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không tìm thấy token xác thực",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if token.startswith("guest_"):
        print(f"[AUTH_DEBUG] Bypassing JWT decode for guest token: {token}")
        return token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        print(f"[AUTH_DEBUG] Decoded user_id: {user_id}")
        if user_id is None:
            print("[AUTH_DEBUG] user_id in payload is None!")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token không hợp lệ",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.ExpiredSignatureError:
        print("[AUTH_DEBUG] Token expired!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token đã hết hạn",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError as e:
        print(f"[AUTH_DEBUG] PyJWTError: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không thể xác thực token",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_admin_user(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)) -> str:
    """Xác minh user hiện tại có phải là Admin hay không."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bạn không có quyền quản trị viên",
        )
    return user_id

router = APIRouter(prefix="/auth", tags=["Authentication"])

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    email: str
    is_admin: bool = False

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = "BrandFlow User"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class SocialLoginRequest(BaseModel):
    token: str
    provider: str # 'google' | 'facebook'

def verify_password(plain_password: str, hashed_password: str):
    if not hashed_password: return False
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=Token)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email này đã được đăng ký.")
    
    hashed_password = get_password_hash(user.password)
    
    # Tự động set admin cho email nội bộ
    is_admin = True if user.email == "admin@brandflow.ai" else False
    
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name,
        is_admin=is_admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={"sub": new_user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": new_user.id,
        "email": new_user.email,
        "is_admin": new_user.is_admin
    }

@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai email hoặc mật khẩu")
    
    access_token = create_access_token(
        data={"sub": db_user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Đảm bảo admin@brandflow.ai luôn là admin kể cả khi db lỗi sync
    if db_user.email == "admin@brandflow.ai" and not db_user.is_admin:
        db_user.is_admin = True
        db.commit()
        
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "email": db_user.email,
        "is_admin": db_user.is_admin
    }

@router.post("/social", response_model=Token)
def social_login(request: SocialLoginRequest, db: Session = Depends(get_db)):
    email = None
    name = "BrandFlow User"

    if request.provider == 'google':
        try:
            # Xác thực Access Token của Google (phù hợp với useGoogleLogin React hook)
            gg_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.token}"
            response = requests.get(gg_url)
            if response.status_code != 200:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google access token")
            
            gg_data = response.json()
            email = gg_data.get('email')
            name = gg_data.get('name', "Google User")
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Error connecting to Google")

    elif request.provider == 'facebook':
        # Xác thực Access token của Facebook qua Graph API
        app_id = FACEBOOK_APP_ID
        fb_url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={request.token}"
        response = requests.get(fb_url)
        if response.status_code != 200:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Facebook token")
        
        fb_data = response.json()
        if 'email' not in fb_data:
            # Facebook không trả về email (do user không cấp quyền hoặc đăng ký bằng SĐT)
            email = f"{fb_data['id']}@facebook.mock.com"
        else:
            email = fb_data['email']
            
        name = fb_data.get('name', "Facebook User")

    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported provider")

    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not retrieve email from provider")

    # Kiểm tra xem user đã tồn tại chưa
    db_user = db.query(User).filter(User.email == email).first()
    
    if not db_user:
        # Tự động tạo tài khoản mới nếu chưa tồn tại
        # Tạo password ngẫu nhiên vì user đăng nhập bằng Social
        random_password = get_password_hash(email + SECRET_KEY)
        db_user = User(
            email=email,
            password_hash=random_password,
            display_name=name
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Cấp phát Token
    access_token = create_access_token(
        data={"sub": db_user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Đảm bảo admin@brandflow.ai luôn là admin kể cả khi db lỗi sync
    if db_user.email == "admin@brandflow.ai" and not db_user.is_admin:
        db_user.is_admin = True
        db.commit()
        
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "email": db_user.email,
        "is_admin": db_user.is_admin
    }

# ═══════════════════════════════════════════════════════════════════
# GDPR & COMPLIANCE APIs (Right to be Forgotten & Data Portability)
# ═══════════════════════════════════════════════════════════════════

@router.delete("/users/me")
def delete_current_user(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
    """GDPR Compliance: Right to be Forgotten. Xóa toàn bộ dữ liệu User."""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user) # Cascade sẽ xóa Projects, Forms, Metrics, Members
    db.commit()
    return {"status": "success", "message": "All user data has been permanently deleted."}

@router.get("/users/me/export")
def export_user_data(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
    """GDPR Compliance: Data Portability. Xuất toàn bộ dữ liệu User ra JSON."""
    user = db.query(User).filter(User.id == current_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    export_data = {
        "user_profile": {
            "email": user.email,
            "display_name": user.display_name,
            "tier": user.tier,
            "created_at": user.created_at.isoformat(),
            "is_2fa_enabled": user.is_2fa_enabled,
            "privacy_mode": getattr(user, "privacy_mode", False)
        },
        "projects": []
    }
    
    for project in user.projects:
        proj_data = {
            "id": project.id,
            "name": project.name,
            "industry": project.industry,
            "created_at": project.created_at.isoformat(),
            "forms": [
                {
                    "form_key": f.form_key,
                    "data": f.data,
                    "updated_at": f.updated_at.isoformat()
                } for f in project.form_entries
            ],
            "metrics": []
        }
        if hasattr(project, 'metrics') and project.metrics:
            for m in project.metrics:
                proj_data["metrics"].append({
                    "tam": m.tam,
                    "cac": m.cac,
                    "ltv": m.ltv,
                    "ai_telemetry": m.ai_telemetry_data
                })
        export_data["projects"].append(proj_data)
        
    return export_data
