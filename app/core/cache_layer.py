"""
═══════════════════════════════════════════════════════════════════════════════
BrandFlow — Smart Cache Layer (Token Efficiency)
═══════════════════════════════════════════════════════════════════════════════
TTL-based in-memory cache to avoid redundant LLM calls:
  • Trends cache: 1 hour TTL per platform
  • LLM response cache: 30 min TTL, keyed by hash(prompt)
  • Brand DNA cache: per-user, no TTL (persists until restart)
═══════════════════════════════════════════════════════════════════════════════
"""

import hashlib
import time
import threading
from typing import Any, Dict, Optional
from loguru import logger


class CacheEntry:
    """A single cache entry with TTL support."""
    __slots__ = ("value", "created_at", "ttl")

    def __init__(self, value: Any, ttl: float):
        self.value = value
        self.created_at = time.time()
        self.ttl = ttl  # 0 = no expiry

    @property
    def is_expired(self) -> bool:
        if self.ttl <= 0:
            return False
        return (time.time() - self.created_at) > self.ttl

    @property
    def age_seconds(self) -> float:
        return time.time() - self.created_at


class SmartCache:
    """
    Thread-safe in-memory cache with TTL, LRU eviction, and stats.
    
    Usage:
        cache = SmartCache.instance()
        
        # Trends caching
        cache.set_trends("Facebook", [...], ttl=3600)
        trends = cache.get_trends("Facebook")
        
        # LLM response caching
        cache.set_llm(prompt_text, response_json, ttl=1800)
        cached = cache.get_llm(prompt_text)
        
        # Brand DNA caching (no TTL)
        cache.set_dna(user_id, dna_dict)
        dna = cache.get_dna(user_id)
    """

    _instance: Optional["SmartCache"] = None
    _lock = threading.Lock()

    # Max entries per namespace to prevent unbounded memory growth
    MAX_LLM_ENTRIES = 200
    MAX_TRENDS_ENTRIES = 20
    MAX_DNA_ENTRIES = 500

    def __init__(self):
        self._trends: Dict[str, CacheEntry] = {}
        self._llm: Dict[str, CacheEntry] = {}
        self._dna: Dict[str, CacheEntry] = {}
        self._stats = {"hits": 0, "misses": 0, "evictions": 0}
        self._rw_lock = threading.Lock()

    @classmethod
    def instance(cls) -> "SmartCache":
        """Singleton accessor — one cache per process."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
                    logger.info("🗄️ [Cache] SmartCache initialized (singleton)")
        return cls._instance

    # ── Trends Cache ──

    def set_trends(self, platform: str, data: list, ttl: float = 3600):
        """Cache trends data for a platform. Default TTL: 1 hour."""
        with self._rw_lock:
            self._evict_if_full(self._trends, self.MAX_TRENDS_ENTRIES)
            self._trends[platform.lower()] = CacheEntry(data, ttl)
            logger.debug(f"[Cache] SET trends/{platform} ({len(data)} items, TTL={ttl}s)")

    def get_trends(self, platform: str) -> Optional[list]:
        """Get cached trends for a platform. Returns None if expired/missing."""
        with self._rw_lock:
            entry = self._trends.get(platform.lower())
            if entry and not entry.is_expired:
                self._stats["hits"] += 1
                logger.debug(f"[Cache] HIT trends/{platform} (age={entry.age_seconds:.0f}s)")
                return entry.value
            if entry and entry.is_expired:
                del self._trends[platform.lower()]
            self._stats["misses"] += 1
            return None

    # ── LLM Response Cache ──

    @staticmethod
    def _hash_prompt(prompt: str) -> str:
        """Hash a prompt string for cache key (SHA-256 truncated to 16 chars)."""
        return hashlib.sha256(prompt.encode("utf-8")).hexdigest()[:16]

    def set_llm(self, prompt: str, response: Any, ttl: float = 1800):
        """Cache an LLM response. Default TTL: 30 minutes."""
        key = self._hash_prompt(prompt)
        with self._rw_lock:
            self._evict_if_full(self._llm, self.MAX_LLM_ENTRIES)
            self._llm[key] = CacheEntry(response, ttl)
            logger.debug(f"[Cache] SET llm/{key[:8]}... (TTL={ttl}s)")

    def get_llm(self, prompt: str) -> Optional[Any]:
        """Get cached LLM response. Returns None if expired/missing."""
        key = self._hash_prompt(prompt)
        with self._rw_lock:
            entry = self._llm.get(key)
            if entry and not entry.is_expired:
                self._stats["hits"] += 1
                logger.debug(f"[Cache] HIT llm/{key[:8]}... (age={entry.age_seconds:.0f}s)")
                return entry.value
            if entry and entry.is_expired:
                del self._llm[key]
            self._stats["misses"] += 1
            return None

    # ── Brand DNA Cache ──

    def set_dna(self, user_id: str, dna: dict):
        """Cache Brand DNA for a user. No TTL — persists until restart."""
        with self._rw_lock:
            self._evict_if_full(self._dna, self.MAX_DNA_ENTRIES)
            self._dna[user_id] = CacheEntry(dna, ttl=0)
            logger.debug(f"[Cache] SET dna/{user_id[:8]}...")

    def get_dna(self, user_id: str) -> Optional[dict]:
        """Get cached Brand DNA for a user."""
        with self._rw_lock:
            entry = self._dna.get(user_id)
            if entry:
                self._stats["hits"] += 1
                return entry.value
            self._stats["misses"] += 1
            return None

    # ── Eviction ──

    def _evict_if_full(self, store: Dict[str, CacheEntry], max_entries: int):
        """Evict oldest entries if store exceeds max_entries."""
        if len(store) >= max_entries:
            # Remove expired first
            expired_keys = [k for k, v in store.items() if v.is_expired]
            for k in expired_keys:
                del store[k]
                self._stats["evictions"] += 1

            # If still full, remove oldest
            while len(store) >= max_entries:
                oldest_key = min(store, key=lambda k: store[k].created_at)
                del store[oldest_key]
                self._stats["evictions"] += 1

    # ── Stats ──

    def get_stats(self) -> dict:
        """Get cache statistics."""
        with self._rw_lock:
            return {
                **self._stats,
                "hit_rate": (
                    f"{self._stats['hits'] / max(1, self._stats['hits'] + self._stats['misses']) * 100:.1f}%"
                ),
                "entries": {
                    "trends": len(self._trends),
                    "llm": len(self._llm),
                    "dna": len(self._dna),
                },
            }

    def clear(self):
        """Clear all caches."""
        with self._rw_lock:
            self._trends.clear()
            self._llm.clear()
            self._dna.clear()
            self._stats = {"hits": 0, "misses": 0, "evictions": 0}
            logger.info("[Cache] All caches cleared")
