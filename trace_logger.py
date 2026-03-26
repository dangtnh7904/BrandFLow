import json
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path


@dataclass
class TraceLogger:
    root_dir: Path
    goal: str
    budget: int

    def __post_init__(self):
        self.run_id = str(uuid.uuid4())
        self.base_dir = self.root_dir / "trace" / self.run_id
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self._init_file("planner")
        self._init_file("customer")
        self._init_file("cfo")

    def _init_file(self, agent: str) -> None:
        path = self.base_dir / f"{agent}.json"
        if not path.exists():
            payload = {
                "meta": {
                    "run_id": self.run_id,
                    "agent": agent,
                    "goal": self.goal,
                    "budget": self.budget,
                    "created_at": self._now_iso(),
                },
                "messages": [],
            }
            path.write_text(
                json.dumps(payload, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).astimezone().isoformat()

    def read_file(self, agent: str) -> dict:
        path = self.base_dir / f"{agent}.json"
        return json.loads(path.read_text(encoding="utf-8"))

    def log(self, agent: str, role: str, content: str, step: int) -> None:
        try:
            data = self.read_file(agent)
            data["messages"].append({
                "run_id": self.run_id,
                "agent": agent,
                "role": role,
                "content": content,
                "timestamp": self._now_iso(),
                "step": step,
            })
            path = self.base_dir / f"{agent}.json"
            path.write_text(
                json.dumps(data, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception:
            # Do not fail the workflow if logging fails
            pass
