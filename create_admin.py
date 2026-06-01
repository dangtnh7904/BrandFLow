from app.core.database import SessionLocal, init_db
from app.models.models import User
import bcrypt

def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_admin():
    # Ensure tables exist
    init_db()
    
    db = SessionLocal()
    try:
        admin_email = "admin@brandflow.ai"
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if existing_admin:
            print(f"Admin {admin_email} already exists.")
            # Update password and admin flag just in case
            existing_admin.password_hash = get_password_hash("dinhmanhcvp2005")
            existing_admin.is_admin = True
            db.commit()
            print("Password reset to 'dinhmanhcvp2005' and is_admin set to True.")
            return

        new_admin = User(
            email=admin_email,
            password_hash=get_password_hash("dinhmanhcvp2005"),
            display_name="Admin BrandFlow",
            is_admin=True
        )
        db.add(new_admin)
        db.commit()
        print(f"Successfully created admin account: {admin_email} / dinhmanhcvp2005")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
