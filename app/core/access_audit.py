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
from typing import Any


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

    def __init__(self, db_path: str | None = None):
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
    def _resolve_ip(headers: dict[str, str], client_host: str | None) -> str:
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
    def _resolve_user_id(headers: dict[str, str]) -> str | None:
        for key in ("x-user-id", "x-user", "x-account-id"):
            value = (headers.get(key, "") or "").strip()
            if value:
                return value
        return None

    @staticmethod
    def _resolve_tier(headers: dict[str, str], tier_hint: str | None) -> str | None:
        if tier_hint and tier_hint.strip():
            return tier_hint.strip().upper()
        for key in ("x-tier", "x-user-tier"):
            value = (headers.get(key, "") or "").strip()
            if value:
                return value.upper()
        return None

    @staticmethod
    def _build_visitor_key(user_id: str | None, ip_address: str, user_agent: str) -> str:
        if user_id:
            return f"uid:{user_id}"
        raw = f"{ip_address}|{user_agent}"
        digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        return f"fp:{digest[:20]}"

    def record_visit(
        self,
        *,
        headers: dict[str, str],
        client_host: str | None,
        method: str,
        path: str,
        status_code: int,
        trace_id: str | None = None,
        tier_hint: str | None = None,
    ) -> None:
        visited_at = _now_iso()
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

    def list_visit_events(self, limit: int = 200, visitor_key: str | None = None) -> list[dict[str, Any]]:
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