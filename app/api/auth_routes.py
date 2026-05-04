from fastapi import APIRouter, Depends, HTTPException, status
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
SECRET_KEY = "SUPER_SECRET_KEY_BRANDFLOW_2026"  # Đổi trong production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Social Auth Config
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID" # Sẽ thay bằng biến môi trường trong production
FACEBOOK_APP_ID = "YOUR_FACEBOOK_APP_ID"

router = APIRouter(prefix="/auth", tags=["Authentication"])

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    email: str

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
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        display_name=user.display_name
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
        "email": new_user.email
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
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "email": db_user.email
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
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": db_user.id,
        "email": db_user.email
    }
