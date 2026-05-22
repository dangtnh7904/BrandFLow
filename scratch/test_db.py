import sqlite3
import traceback

def check():
    try:
        conn = sqlite3.connect('brandflow.db')
        cur = conn.cursor()
        cur.execute("SELECT email, is_admin FROM users LIMIT 5")
        rows = cur.fetchall()
        print("Users in brandflow.db:", rows)
    except Exception as e:
        print("Error checking brandflow.db:")
        traceback.print_exc()

check()
