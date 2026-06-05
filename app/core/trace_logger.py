"""
═══════════════════════════════════════════════════════════════════════════════
BrandFlow — Trace Logger (Structured Agent Trace)
═══════════════════════════════════════════════════════════════════════════════
Design doc: docs/plans/2026-03-26-trace-logger-json-design.md

Records full-trace agent messages to JSON files per run:
  outputs/trace/<run_id>/planner.json
  outputs/trace/<run_id>/customer.json
  outputs/trace/<run_id>/cfo.json
  outputs/trace/<run_id>/coo.json
  outputs/trace/<run_id>/sales.json
═══════════════════════════════════════════════════════════════════════════════
"""

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


TRACE_OUTPUT_DIR = os.getenv("BRANDFLOW_TRACE_DIR", "outputs/trace")


class TraceLogger:
    """
    Structured trace logger for multi-agent workflow runs.
    
    Usage:
        logger = TraceLogger(goal="Launch milk tea combo", budget=12000000)
        logger.log("planner", "assistant", "Phase 1 completed: ...", step=1)
        logger.log("cfo", "assistant", "Budget approved: ...", step=2)
        logger.finalize()
    """

    def __init__(
        self,
        goal: str = "",
        budget: int = 0,
        industry: str = "",
        run_id: Optional[str] = None,
    ):
        self.run_id = run_id or str(uuid.uuid4())[:8]
        self.goal = goal
        self.budget = budget
        self.industry = industry
        self.created_at = datetime.now(timezone.utc).isoformat()
        self._messages: dict[str, list] = {}
        self._step_counter = 0

        # Create output directory
        self.output_dir = Path(TRACE_OUTPUT_DIR) / self.run_id
        try:
            self.output_dir.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            print(f"⚠️ [TraceLogger] Cannot create dir {self.output_dir}: {e}")

    def log(
        self,
        agent: str,
        role: str,
        content: str,
        step: Optional[int] = None,
        metadata: Optional[dict] = None,
    ):
        """
        Append a trace message for an agent.
        
        Args:
            agent: Agent name (planner, cfo, customer, coo, sales, intake, etc.)
            role: Message role (system, assistant, user)
            content: The text content (can be long)
            step: Step number (auto-incremented if None)
            metadata: Optional dict of extra data (scores, timing, etc.)
        """
        if step is None:
            self._step_counter += 1
            step = self._step_counter

        if agent not in self._messages:
            self._messages[agent] = []

        entry = {
            "run_id": self.run_id,
            "agent": agent,
            "role": role,
            "content": content[:10000],  # Truncate to 10K chars max per message
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "step": step,
        }
        if metadata:
            entry["metadata"] = metadata

        self._messages[agent].append(entry)

        # Write immediately (append-safe)
        self._write_agent_file(agent)

    def _write_agent_file(self, agent: str):
        """Write/overwrite agent trace file."""
        filepath = self.output_dir / f"{agent}.json"
        data = {
            "meta": {
                "run_id": self.run_id,
                "agent": agent,
                "goal": self.goal,
                "budget": self.budget,
                "industry": self.industry,
                "created_at": self.created_at,
            },
            "messages": self._messages.get(agent, []),
        }
        try:
            filepath.write_text(
                json.dumps(data, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception as e:
            print(f"⚠️ [TraceLogger] Write failed for {filepath}: {e}")

    def finalize(self) -> dict:
        """Write all agent files and return summary."""
        for agent in self._messages:
            self._write_agent_file(agent)

        summary = {
            "run_id": self.run_id,
            "output_dir": str(self.output_dir),
            "agents_traced": list(self._messages.keys()),
            "total_messages": sum(len(msgs) for msgs in self._messages.values()),
        }
        
        # Write summary index
        index_path = self.output_dir / "_index.json"
        try:
            index_path.write_text(
                json.dumps(summary, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception:
            pass

        print(f"📋 [TraceLogger] Run {self.run_id}: {summary['total_messages']} messages across {len(summary['agents_traced'])} agents → {self.output_dir}")
        return summary

    def get_all_messages(self) -> dict:
        """Return all messages grouped by agent (for API response)."""
        return {
            "run_id": self.run_id,
            "agents": {
                agent: msgs for agent, msgs in self._messages.items()
            },
        }
