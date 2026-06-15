import sqlite3, sys, os
sys.stdout.reconfigure(encoding='utf-8')

db_path = os.path.join(os.path.dirname(__file__), '..', 'audit', 'visitor_audit.db')
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

print('=== AUDIT DB VERIFICATION ===')
print()

profiles = conn.execute('SELECT COUNT(*) as c FROM visitor_profiles').fetchone()['c']
events = conn.execute('SELECT COUNT(*) as c FROM visit_events').fetchone()['c']
print(f'Total visitor profiles: {profiles}')
print(f'Total visit events: {events}')
print()

# Churned (<=3 visits)
churned = conn.execute('SELECT visitor_key, latest_user_id, visits_count FROM visitor_profiles WHERE visits_count <= 3 ORDER BY visits_count').fetchall()
print(f'--- CHURNED (<=3 visits): {len(churned)} enterprises ---')
for r in churned:
    print(f'  {r["latest_user_id"]} -- {r["visits_count"]} visits')
print()

# AMEKA & KITE LABS
power = conn.execute(
    "SELECT visitor_key, latest_user_id, visits_count, first_seen_at, last_seen_at "
    "FROM visitor_profiles WHERE latest_user_id LIKE '%AMEKA%' OR latest_user_id LIKE '%KITE%' "
    "ORDER BY visits_count DESC"
).fetchall()
print(f'--- POWER USERS (AMEKA + KITE LABS): {len(power)} profiles ---')
for r in power:
    print(f'  {r["latest_user_id"]} -- {r["visits_count"]} visits | {r["first_seen_at"][:10]} to {r["last_seen_at"][:10]}')
print()

# Dropped after 1 month
dropped = conn.execute(
    "SELECT visitor_key, latest_user_id, visits_count, last_seen_at "
    "FROM visitor_profiles WHERE visits_count BETWEEN 10 AND 25 "
    "AND last_seen_at < datetime('now', '-10 days') "
    "ORDER BY last_seen_at"
).fetchall()
print(f'--- DROPPED (no activity last 10 days, 10-25 visits): {len(dropped)} ---')
for r in dropped[:10]:
    print(f'  {r["latest_user_id"]} -- {r["visits_count"]} visits | last: {r["last_seen_at"][:16]}')
print()

# Date range
date_range = conn.execute('SELECT MIN(visited_at) as mn, MAX(visited_at) as mx FROM visit_events').fetchone()
print(f'Date range: {date_range["mn"][:10]} to {date_range["mx"][:10]}')
print()

# Daily distribution
print('--- DAILY EVENT DISTRIBUTION ---')
daily = conn.execute(
    "SELECT DATE(visited_at) as day, COUNT(*) as cnt, COUNT(DISTINCT visitor_key) as users "
    "FROM visit_events GROUP BY day ORDER BY day"
).fetchall()
for d in daily:
    bar = '#' * (d['cnt'] // 5)
    print(f'  {d["day"]} | {d["cnt"]:4d} events | {d["users"]:3d} users | {bar}')

print()

# Tier distribution
print('--- TIER DISTRIBUTION ---')
tiers = conn.execute(
    "SELECT latest_tier, COUNT(*) as cnt FROM visitor_profiles GROUP BY latest_tier ORDER BY cnt DESC"
).fetchall()
for t in tiers:
    print(f'  {t["latest_tier"]}: {t["cnt"]} profiles')

conn.close()
