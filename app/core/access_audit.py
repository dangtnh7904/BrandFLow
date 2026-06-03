"""Visitor access audit store for BrandFlow.

Stores both:
1) Unique visitor profiles (first/last seen, visits count)
2) Visit events (per request)

This is intended as evidence data for who entered the app.
"""

from __future__ import annotations

import hashlib
import os
import sqlite3
from datetime import datetime, timezone
from threading import Lock
from typing import Any, Optional, Union


def _now_iso() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat()


def _sanitize_limit(limit: int, min_value: int, max_value: int) -> int:
    if limit < min_value:
        return min_value
    if limit > max_value:
        return max_value
    return limit


class VisitorAuditStore:
    """SQLite storage for visitor proof and access history."""

    def __init__(self, db_path: Optional[str] = None):
        resolved = db_path or os.environ.get("BRANDFLOW_AUDIT_DB_PATH", "./audit/visitor_audit.db")
        self.db_path = resolved
        self._lock = Lock()

    def init_db(self) -> None:
        os.makedirs(os.path.dirname(os.path.abspath(self.db_path)), exist_ok=True)
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            try:
                conn.execute("PRAGMA journal_mode=WAL")
                conn.execute("PRAGMA foreign_keys=ON")
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS visitor_profiles (
                        visitor_key TEXT PRIMARY KEY,
                        first_seen_at TEXT NOT NULL,
                        last_seen_at TEXT NOT NULL,
                        visits_count INTEGER NOT NULL DEFAULT 0,
                        ip_address TEXT,
                        user_agent TEXT,
                        latest_user_id TEXT,
                        latest_tier TEXT,
                        latest_trace_id TEXT
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS visit_events (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        visited_at TEXT NOT NULL,
                        visitor_key TEXT NOT NULL,
                        ip_address TEXT,
                        user_agent TEXT,
                        user_id TEXT,
                        tier TEXT,
                        trace_id TEXT,
                        method TEXT,
                        path TEXT,
                        status_code INTEGER,
                        FOREIGN KEY(visitor_key) REFERENCES visitor_profiles(visitor_key)
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE INDEX IF NOT EXISTS idx_visit_events_visited_at
                    ON visit_events(visited_at DESC)
                    """
                )
                conn.execute(
                    """
                    CREATE INDEX IF NOT EXISTS idx_visit_events_visitor_key
                    ON visit_events(visitor_key)
                    """
                )
                conn.commit()
            finally:
                conn.close()

    @staticmethod
    def _resolve_ip(headers: dict[str, str], client_host: Optional[str]) -> str:
        forwarded = headers.get("x-forwarded-for", "").strip()
        if forwarded:
            first_hop = forwarded.split(",")[0].strip()
            if first_hop:
                return first_hop
        real_ip = headers.get("x-real-ip", "").strip()
        if real_ip:
            return real_ip
        return (client_host or "unknown").strip() or "unknown"

    @staticmethod
    def _resolve_user_agent(headers: dict[str, str]) -> str:
        return (headers.get("user-agent", "") or "unknown").strip() or "unknown"

    @staticmethod
    def _resolve_user_id(headers: dict[str, str]) -> Optional[str]:
        for key in ("x-user-id", "x-user", "x-account-id"):
            value = (headers.get(key, "") or "").strip()
            if value:
                return value
        return None

    @staticmethod
    def _resolve_tier(headers: dict[str, str], tier_hint: Optional[str]) -> Optional[str]:
        if tier_hint and tier_hint.strip():
            return tier_hint.strip().upper()
        for key in ("x-tier", "x-user-tier"):
            value = (headers.get(key, "") or "").strip()
            if value:
                return value.upper()
        return None

    @staticmethod
    def _build_visitor_key(user_id: Optional[str], ip_address: str, user_agent: str) -> str:
        if user_id:
            return f"uid:{user_id}"
        raw = f"{ip_address}|{user_agent}"
        digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        return f"fp:{digest[:20]}"

    def record_visit(
        self,
        *,
        headers: dict[str, str],
        client_host: Optional[str],
        method: str,
        path: str,
        status_code: int,
        trace_id: Optional[str] = None,
        tier_hint: Optional[str] = None,
        override_time: Optional[str] = None,
    ) -> None:
        visited_at = override_time if override_time else _now_iso()
        ip_address = self._resolve_ip(headers, client_host)
        user_agent = self._resolve_user_agent(headers)
        user_id = self._resolve_user_id(headers)
        tier = self._resolve_tier(headers, tier_hint)
        visitor_key = self._build_visitor_key(user_id, ip_address, user_agent)
        safe_trace_id = (trace_id or "").strip() or None

        with self._lock:
            conn = sqlite3.connect(self.db_path)
            try:
                conn.execute(
                    """
                    INSERT INTO visit_events (
                        visited_at, visitor_key, ip_address, user_agent,
                        user_id, tier, trace_id, method, path, status_code
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        visited_at,
                        visitor_key,
                        ip_address,
                        user_agent,
                        user_id,
                        tier,
                        safe_trace_id,
                        method,
                        path,
                        status_code,
                    ),
                )

                conn.execute(
                    """
                    INSERT INTO visitor_profiles (
                        visitor_key,
                        first_seen_at,
                        last_seen_at,
                        visits_count,
                        ip_address,
                        user_agent,
                        latest_user_id,
                        latest_tier,
                        latest_trace_id
                    )
                    VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)
                    ON CONFLICT(visitor_key)
                    DO UPDATE SET
                        last_seen_at = excluded.last_seen_at,
                        visits_count = visitor_profiles.visits_count + 1,
                        ip_address = excluded.ip_address,
                        user_agent = excluded.user_agent,
                        latest_user_id = COALESCE(excluded.latest_user_id, visitor_profiles.latest_user_id),
                        latest_tier = COALESCE(excluded.latest_tier, visitor_profiles.latest_tier),
                        latest_trace_id = COALESCE(excluded.latest_trace_id, visitor_profiles.latest_trace_id)
                    """,
                    (
                        visitor_key,
                        visited_at,
                        visited_at,
                        ip_address,
                        user_agent,
                        user_id,
                        tier,
                        safe_trace_id,
                    ),
                )

                conn.commit()
            finally:
                conn.close()

    def get_summary(self) -> dict[str, Any]:
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                unique_visitors = conn.execute("SELECT COUNT(*) AS c FROM visitor_profiles").fetchone()["c"]
                total_visits = conn.execute("SELECT COUNT(*) AS c FROM visit_events").fetchone()["c"]

                window_row = conn.execute(
                    """
                    SELECT
                        MIN(first_seen_at) AS first_seen_at,
                        MAX(last_seen_at) AS last_seen_at
                    FROM visitor_profiles
                    """
                ).fetchone()

                return {
                    "unique_visitors": int(unique_visitors or 0),
                    "total_visits": int(total_visits or 0),
                    "first_seen_at": window_row["first_seen_at"] if window_row else None,
                    "last_seen_at": window_row["last_seen_at"] if window_row else None,
                    "db_path": self.db_path,
                }
            finally:
                conn.close()

    def list_visitors(self, limit: int = 100) -> list[dict[str, Any]]:
        safe_limit = _sanitize_limit(limit, 1, 1000)
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                rows = conn.execute(
                    """
                    SELECT
                        visitor_key,
                        first_seen_at,
                        last_seen_at,
                        visits_count,
                        ip_address,
                        user_agent,
                        latest_user_id,
                        latest_tier,
                        latest_trace_id
                    FROM visitor_profiles
                    ORDER BY last_seen_at DESC
                    LIMIT ?
                    """,
                    (safe_limit,),
                ).fetchall()

                return [dict(row) for row in rows]
            finally:
                conn.close()

    def list_visit_events(self, limit: int = 200, visitor_key: Optional[str] = None) -> list[dict[str, Any]]:
        safe_limit = _sanitize_limit(limit, 1, 2000)
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                if visitor_key:
                    rows = conn.execute(
                        """
                        SELECT
                            id,
                            visited_at,
                            visitor_key,
                            ip_address,
                            user_agent,
                            user_id,
                            tier,
                            trace_id,
                            method,
                            path,
                            status_code
                        FROM visit_events
                        WHERE visitor_key = ?
                        ORDER BY id DESC
                        LIMIT ?
                        """,
                        (visitor_key, safe_limit),
                    ).fetchall()
                else:
                    rows = conn.execute(
                        """
                        SELECT
                            id,
                            visited_at,
                            visitor_key,
                            ip_address,
                            user_agent,
                            user_id,
                            tier,
                            trace_id,
                            method,
                            path,
                            status_code
                        FROM visit_events
                        ORDER BY id DESC
                        LIMIT ?
                        """,
                        (safe_limit,),
                    ).fetchall()

                return [dict(row) for row in rows]
            finally:
                conn.close()

    def get_funnel_stats(self) -> list[dict[str, Any]]:
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                rows = conn.execute(
                    """
                    SELECT path, COUNT(*) as usage_count
                    FROM visit_events
                    GROUP BY path
                    ORDER BY usage_count DESC
                    """
                ).fetchall()
                return [dict(row) for row in rows]
            finally:
                conn.close()

    # ═══════════════════════════════════════════════════════════════════════
    # ENHANCED ANALYTICS — Investor-grade metrics from real data
    # ═══════════════════════════════════════════════════════════════════════

    def get_daily_growth(self, days: int = 30) -> list[dict[str, Any]]:
        """Daily new users + total visits for growth chart."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                # New users per day
                new_users = conn.execute(
                    """
                    SELECT DATE(first_seen_at) as day, COUNT(*) as new_users
                    FROM visitor_profiles
                    GROUP BY DATE(first_seen_at)
                    ORDER BY day DESC
                    LIMIT ?
                    """, (days,)
                ).fetchall()

                # Visits per day
                visits = conn.execute(
                    """
                    SELECT DATE(visited_at) as day, COUNT(*) as visits,
                           COUNT(DISTINCT visitor_key) as active_users
                    FROM visit_events
                    GROUP BY DATE(visited_at)
                    ORDER BY day DESC
                    LIMIT ?
                    """, (days,)
                ).fetchall()

                new_users_map = {r["day"]: r["new_users"] for r in new_users}
                result = []
                for v in visits:
                    result.append({
                        "day": v["day"],
                        "visits": v["visits"],
                        "active_users": v["active_users"],
                        "new_users": new_users_map.get(v["day"], 0),
                    })
                return result
            finally:
                conn.close()

    def get_hourly_heatmap(self) -> list[dict[str, Any]]:
        """Activity distribution by hour of day (0-23)."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                rows = conn.execute(
                    """
                    SELECT
                        CAST(strftime('%H', visited_at) AS INTEGER) as hour,
                        COUNT(*) as count
                    FROM visit_events
                    GROUP BY hour
                    ORDER BY hour
                    """
                ).fetchall()
                return [dict(row) for row in rows]
            finally:
                conn.close()

    def get_feature_categories(self) -> list[dict[str, Any]]:
        """Group API paths into business feature categories for investors."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                rows = conn.execute(
                    """
                    SELECT path, COUNT(*) as count
                    FROM visit_events
                    WHERE path LIKE '/api/%'
                    GROUP BY path
                    """
                ).fetchall()

                categories: dict[str, int] = {}
                category_map = {
                    "onboarding": "🚀 Onboarding",
                    "auth": "🔐 Authentication",
                    "design": "🎨 Design Studio",
                    "content-lab": "✍️ Content Lab",
                    "research": "🔍 Market Research",
                    "agent": "🤖 AI Agents",
                    "audit": "📊 Analytics",
                    "form": "📝 Forms & Data",
                    "strategy": "📈 Strategy",
                }
                for row in rows:
                    path = row["path"]
                    matched = False
                    for key, label in category_map.items():
                        if key in path:
                            categories[label] = categories.get(label, 0) + row["count"]
                            matched = True
                            break
                    if not matched and "/api/" in path:
                        categories["⚙️ Other API"] = categories.get("⚙️ Other API", 0) + row["count"]

                return sorted(
                    [{"category": k, "count": v} for k, v in categories.items()],
                    key=lambda x: x["count"], reverse=True
                )
            finally:
                conn.close()

    def get_engagement_stats(self) -> dict[str, Any]:
        """Power user metrics and engagement statistics."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                total_users = conn.execute("SELECT COUNT(*) as c FROM visitor_profiles").fetchone()["c"]
                total_visits = conn.execute("SELECT COUNT(*) as c FROM visit_events").fetchone()["c"]

                # Average visits per user
                avg_visits = round(total_visits / max(total_users, 1), 1)

                # Power users (>10 visits)
                power_users = conn.execute(
                    "SELECT COUNT(*) as c FROM visitor_profiles WHERE visits_count > 10"
                ).fetchone()["c"]

                # New users today
                new_today = conn.execute(
                    "SELECT COUNT(*) as c FROM visitor_profiles WHERE DATE(first_seen_at) = DATE('now')"
                ).fetchone()["c"]

                # New users this week
                new_this_week = conn.execute(
                    "SELECT COUNT(*) as c FROM visitor_profiles WHERE first_seen_at >= DATE('now', '-7 days')"
                ).fetchone()["c"]

                # Returning users (visited more than once)
                returning = conn.execute(
                    "SELECT COUNT(*) as c FROM visitor_profiles WHERE visits_count > 1"
                ).fetchone()["c"]

                # Active today (distinct visitors today)
                active_today = conn.execute(
                    "SELECT COUNT(DISTINCT visitor_key) as c FROM visit_events WHERE DATE(visited_at) = DATE('now')"
                ).fetchone()["c"]

                # Peak hour
                peak = conn.execute(
                    """
                    SELECT CAST(strftime('%H', visited_at) AS INTEGER) as hour, COUNT(*) as c
                    FROM visit_events
                    GROUP BY hour ORDER BY c DESC LIMIT 1
                    """
                ).fetchone()

                # Most used feature
                top_feature = conn.execute(
                    """
                    SELECT path, COUNT(*) as c FROM visit_events
                    WHERE path LIKE '/api/%'
                    GROUP BY path ORDER BY c DESC LIMIT 1
                    """
                ).fetchone()

                return {
                    "total_users": total_users,
                    "total_visits": total_visits,
                    "avg_visits_per_user": avg_visits,
                    "power_users": power_users,
                    "power_user_pct": round((power_users / max(total_users, 1)) * 100, 1),
                    "new_today": new_today,
                    "new_this_week": new_this_week,
                    "returning_users": returning,
                    "returning_pct": round((returning / max(total_users, 1)) * 100, 1),
                    "active_today": active_today,
                    "peak_hour": peak["hour"] if peak else None,
                    "peak_hour_count": peak["c"] if peak else 0,
                    "top_feature": top_feature["path"] if top_feature else None,
                    "top_feature_count": top_feature["c"] if top_feature else 0,
                }
            finally:
                conn.close()

    def get_growth_metrics(self) -> dict[str, Any]:
        """Week-over-week growth calculations for investors."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            try:
                # This week vs last week users
                this_week = conn.execute(
                    "SELECT COUNT(*) as c FROM visitor_profiles WHERE first_seen_at >= DATE('now', '-7 days')"
                ).fetchone()["c"]
                last_week = conn.execute(
                    "SELECT COUNT(*) as c FROM visitor_profiles WHERE first_seen_at >= DATE('now', '-14 days') AND first_seen_at < DATE('now', '-7 days')"
                ).fetchone()["c"]

                wow_growth = round(((this_week - last_week) / max(last_week, 1)) * 100, 1) if last_week > 0 else 100.0

                # This week visits vs last week
                this_week_visits = conn.execute(
                    "SELECT COUNT(*) as c FROM visit_events WHERE visited_at >= DATE('now', '-7 days')"
                ).fetchone()["c"]
                last_week_visits = conn.execute(
                    "SELECT COUNT(*) as c FROM visit_events WHERE visited_at >= DATE('now', '-14 days') AND visited_at < DATE('now', '-7 days')"
                ).fetchone()["c"]

                visit_growth = round(((this_week_visits - last_week_visits) / max(last_week_visits, 1)) * 100, 1) if last_week_visits > 0 else 100.0

                # Cumulative user count
                cumulative = conn.execute(
                    """
                    SELECT DATE(first_seen_at) as day, COUNT(*) as new_users
                    FROM visitor_profiles
                    GROUP BY day
                    ORDER BY day
                    """
                ).fetchall()

                running_total = 0
                cumulative_data = []
                for row in cumulative:
                    running_total += row["new_users"]
                    cumulative_data.append({"day": row["day"], "total": running_total})

                return {
                    "new_users_this_week": this_week,
                    "new_users_last_week": last_week,
                    "wow_user_growth_pct": wow_growth,
                    "visits_this_week": this_week_visits,
                    "visits_last_week": last_week_visits,
                    "wow_visit_growth_pct": visit_growth,
                    "cumulative_users": cumulative_data[-10:] if cumulative_data else [],
                }
            finally:
                conn.close()