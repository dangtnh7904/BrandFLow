import os
import sys
import pandas as pd
import hashlib
import random
import sqlite3
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.access_audit import VisitorAuditStore

def generate_fake_ip(email):
    h = hashlib.md5(email.encode('utf-8')).hexdigest()
    return f"{int(h[0:2], 16)}.{int(h[2:4], 16)}.{int(h[4:6], 16)}.{int(h[6:8], 16)}"

def populate():
    print("Reading excel...")
    try:
        df = pd.read_excel('docs/khảo sát định lượng.xlsx')
    except Exception as e:
        print(f"Error reading excel: {e}")
        return

    email_col = "Email của Anh/Chị:"
    if email_col not in df.columns:
        print("No emails found.")
        return

    emails = df[email_col].dropna().tolist()
    if not emails:
        print("No emails found in the sheet.")
        return

    db_path = os.path.join(os.path.dirname(__file__), '../audit/visitor_audit.db')
    if os.path.exists(db_path):
        os.remove(db_path)
    
    # Try to remove WAL and SHM if they exist
    if os.path.exists(db_path + "-wal"): os.remove(db_path + "-wal")
    if os.path.exists(db_path + "-shm"): os.remove(db_path + "-shm")

    print(f"Found {len(emails)} emails. Populating audit log with 2 weeks fake data...")
    
    store = VisitorAuditStore()
    store.init_db()

    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"
    ]

    now = datetime.now(timezone.utc)
    count = 0
    for idx, email in enumerate(emails):
        email_str = str(email).strip()
        if not email_str or '@' not in email_str:
            email_str = f"user{idx}@example.com"
            
        ip = generate_fake_ip(email_str)
        seed = int(hashlib.md5(email_str.encode('utf-8')).hexdigest()[:8], 16)
        random.seed(seed)
        
        ua = random.choice(user_agents)
        company = email_str.split('@')[1].split('.')[0].upper()
        display_user_id = f"{company} | {email_str}"
        
        headers = {
            "x-real-ip": ip,
            "user-agent": ua,
            "x-user-id": display_user_id
        }
        
        # Determine if this user is a "power user"
        is_power_user = random.random() < 0.2  # 20% are power users
        if is_power_user:
            visits = random.randint(15, 45)
        else:
            visits = random.randint(1, 5)
            
        # Distribute these visits randomly over the past 14 days
        for _ in range(visits):
            days_ago = random.uniform(0, 14)
            fake_time = now - timedelta(days=days_ago)
            override_time = fake_time.astimezone().isoformat()
            
            # Funnel paths, weight them so it makes a realistic funnel
            path_choices = [
                "/api/v1/onboarding/interview",
                "/api/v1/onboarding/interview",
                "/api/v1/onboarding/interview",
                "/api/v1/design/generate-prompts",
                "/api/v1/design/generate-prompts",
                "/api/content-lab/generate",
                "/api/v1/auth/login"
            ]
            path = random.choice(path_choices)
            status = random.choice([200, 200, 200, 200, 201, 400])
            tier = random.choice(["FREE", "PLUS", "PRO"])
            
            store.record_visit(
                headers=headers,
                client_host=ip,
                method="POST" if "generate" in path else "GET",
                path=path,
                status_code=status,
                tier_hint=tier,
                override_time=override_time
            )
            count += 1
            
    print(f"Successfully recorded {count} fake audit events for {len(emails)} users over 14 days.")

if __name__ == '__main__':
    populate()
