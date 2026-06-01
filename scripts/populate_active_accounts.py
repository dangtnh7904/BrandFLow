import os
import sys
import pandas as pd
import sqlite3
import uuid
import bcrypt
from datetime import datetime, timezone
import random

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import User

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def _now() -> datetime:
    return datetime.now(timezone.utc)

def main():
    # Ensure database exists
    db = SessionLocal()
    
    excel_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "khảo sát định lượng.xlsx")
    
    if not os.path.exists(excel_path):
        print(f"Error: Could not find {excel_path}")
        return
        
    print(f"Loading data from {excel_path}...")
    df = pd.read_excel(excel_path)
    
    # We will use the email column or generate fake ones if not present
    email_col = "Email của Anh/Chị:"
    role_col = "1. Vai trò hiện tại của Anh/Chị trong tổ chức là gì?"
    
    count = 0
    default_password = get_password_hash("dinhmanhcvp2005")
    seen_emails = set()
    
    for idx, row in df.iterrows():
        email = row.get(email_col)
        role = row.get(role_col)
        
        # Ensure email is valid
        if pd.isna(email) or not isinstance(email, str) or '@' not in email:
            # generate fake email based on role if possible
            base_name = f"user_{idx+1}"
            if not pd.isna(role) and isinstance(role, str):
                safe_role = "".join(c if c.isalnum() else "" for c in role.lower().replace(" ", "_"))
                base_name = f"{safe_role}_{idx+1}"
            email = f"{base_name}@example.com"
        
        email = email.lower().strip()
        
        if email in seen_emails:
            continue
        seen_emails.add(email)
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            # Make sure they are active
            if not existing_user.is_active:
                existing_user.is_active = True
                db.commit()
                print(f"Activated existing user: {email}")
            continue
            
        # Create new user
        new_user = User(
            id=str(uuid.uuid4()),
            email=email,
            display_name=f"Khách hàng {idx+1}",
            tier="FREE" if idx % 3 != 0 else ("PRO" if idx % 5 == 0 else "PLUS"),
            password_hash=default_password,
            is_active=True,
            created_at=_now(),
            updated_at=_now()
        )
        db.add(new_user)
        count += 1
        
    db.commit()
    print(f"Successfully added {count} fake active users based on survey data!")
    
    # Now let's tie them to audit logs just to make it richer
    users = db.query(User).filter(User.is_active == True).all()
    user_ids = [u.id for u in users]
    user_emails = [u.email for u in users]
    user_tiers = [u.tier for u in users]
    
    db.close()
    
    # Update some visitor profiles in audit log with these user IDs
    audit_db_path = os.environ.get("BRANDFLOW_AUDIT_DB_PATH", "./audit/visitor_audit.db")
    if os.path.exists(audit_db_path):
        conn = sqlite3.connect(audit_db_path)
        try:
            # Get existing visitor keys
            rows = conn.execute("SELECT visitor_key FROM visitor_profiles").fetchall()
            visitor_keys = [r[0] for r in rows]
            
            updates = 0
            for i, key in enumerate(visitor_keys):
                # Pick a random user
                if user_ids:
                    u_idx = random.randint(0, len(user_ids) - 1)
                    conn.execute(
                        """
                        UPDATE visitor_profiles 
                        SET latest_user_id = ?, latest_tier = ?
                        WHERE visitor_key = ?
                        """,
                        (user_ids[u_idx], user_tiers[u_idx], key)
                    )
                    
                    conn.execute(
                        """
                        UPDATE visit_events
                        SET user_id = ?, tier = ?
                        WHERE visitor_key = ?
                        """,
                        (user_ids[u_idx], user_tiers[u_idx], key)
                    )
                    updates += 1
            
            conn.commit()
            print(f"Updated {updates} visitor profiles in audit log to link with active accounts.")
        finally:
            conn.close()

if __name__ == "__main__":
    main()
