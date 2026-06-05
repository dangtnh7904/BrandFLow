"""
═══════════════════════════════════════════════════════════════════════════════
BrandFlow — Final Output Writer
═══════════════════════════════════════════════════════════════════════════════
Design doc: docs/plans/2026-03-26-final-output-files-design.md

Writes clean final output after each workflow run:
  outputs/final/final-<run_id>.json  — Machine-readable full payload
  outputs/final/final-<run_id>.txt   — Human-readable executive summary
═══════════════════════════════════════════════════════════════════════════════
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


FINAL_OUTPUT_DIR = os.getenv("BRANDFLOW_FINAL_DIR", "outputs/final")


class FinalOutputWriter:
    """
    Writes structured final output files after each workflow run.
    
    Usage:
        writer = FinalOutputWriter(run_id="abc123")
        writer.write(
            goal="Launch milk tea combo",
            budget=12000000,
            approved=True,
            plan={...},
            scores={...},
            customer_feedback=[...],
            cfo_decision={...},
            rounds=2,
            customer_rounds=1,
        )
    """

    def __init__(self, run_id: str):
        self.run_id = run_id
        self.output_dir = Path(FINAL_OUTPUT_DIR)
        try:
            self.output_dir.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            print(f"⚠️ [FinalOutput] Cannot create dir: {e}")

    def write(
        self,
        goal: str = "",
        budget: int = 0,
        industry: str = "",
        approved: bool = True,
        plan: Optional[dict] = None,
        scores: Optional[dict] = None,
        customer_feedback: Optional[list] = None,
        cfo_decision: Optional[dict] = None,
        review_board: Optional[dict] = None,
        rounds: int = 1,
        customer_rounds: int = 0,
    ) -> dict:
        """Write both JSON and TXT final output files."""
        timestamp = datetime.now(timezone.utc).isoformat()

        # ── JSON output ────────────────────────────────────────────
        json_data = {
            "meta": {
                "run_id": self.run_id,
                "goal": goal,
                "industry": industry,
                "budget": budget,
                "approved": approved,
                "rounds": rounds,
                "customer_rounds": customer_rounds,
                "timestamp": timestamp,
            },
            "plan": plan or {},
            "scores": scores or {},
            "customer_feedback": customer_feedback or [],
            "cfo_decision": cfo_decision or {},
            "review_board": review_board or {},
        }

        json_path = self.output_dir / f"final-{self.run_id}.json"
        try:
            json_path.write_text(
                json.dumps(json_data, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
        except Exception as e:
            print(f"⚠️ [FinalOutput] JSON write failed: {e}")

        # ── TXT output (human-readable) ────────────────────────────
        txt_lines = self._generate_txt_summary(
            goal=goal,
            budget=budget,
            industry=industry,
            approved=approved,
            plan=plan or {},
            scores=scores or {},
            customer_feedback=customer_feedback or [],
            cfo_decision=cfo_decision or {},
            review_board=review_board or {},
            rounds=rounds,
            customer_rounds=customer_rounds,
            timestamp=timestamp,
        )

        txt_path = self.output_dir / f"final-{self.run_id}.txt"
        try:
            txt_path.write_text(
                "\n".join(txt_lines),
                encoding="utf-8",
            )
        except Exception as e:
            print(f"⚠️ [FinalOutput] TXT write failed: {e}")

        result = {
            "json_path": str(json_path),
            "txt_path": str(txt_path),
            "run_id": self.run_id,
        }
        print(f"📄 [FinalOutput] Written: {json_path.name} + {txt_path.name}")
        return result

    def _generate_txt_summary(self, **kwargs) -> list:
        """Generate human-readable executive summary."""
        lines = []
        lines.append("═" * 70)
        lines.append("  BRANDFLOW — KẾ HOẠCH MARKETING CHIẾN LƯỢC")
        lines.append("  Final Output Report")
        lines.append("═" * 70)
        lines.append("")
        lines.append(f"  Run ID      : {self.run_id}")
        lines.append(f"  Timestamp   : {kwargs.get('timestamp', 'N/A')}")
        lines.append(f"  Goal        : {kwargs.get('goal', 'N/A')}")
        lines.append(f"  Industry    : {kwargs.get('industry', 'N/A')}")
        lines.append(f"  Budget      : {kwargs.get('budget', 0):,.0f} VND")
        lines.append(f"  Status      : {'✅ APPROVED' if kwargs.get('approved') else '⚠️ PENDING REVIEW'}")
        lines.append(f"  Rounds      : {kwargs.get('rounds', 0)} planning, {kwargs.get('customer_rounds', 0)} customer reviews")
        lines.append("")

        # ── Scores ──
        scores = kwargs.get("scores", {})
        if scores:
            lines.append("─" * 40)
            lines.append("  📊 SCORES")
            lines.append("─" * 40)
            for key, val in scores.items():
                lines.append(f"  {key:25s}: {val}")
            lines.append("")

        # ── Plan Phases ──
        plan = kwargs.get("plan", {})
        if plan:
            lines.append("─" * 40)
            lines.append("  📋 MARKETING PLAN SUMMARY")
            lines.append("─" * 40)
            
            # Extract phases/activities from plan structure
            phases = plan.get("phases", plan.get("tactical_plan", plan.get("activities", [])))
            if isinstance(phases, list):
                for i, phase in enumerate(phases, 1):
                    if isinstance(phase, dict):
                        name = phase.get("name", phase.get("phase_name", f"Phase {i}"))
                        cost = phase.get("cost", phase.get("budget", "N/A"))
                        kpi = phase.get("kpi", phase.get("success_metric", "N/A"))
                        priority = phase.get("priority", "")
                        lines.append(f"  {i}. {name}")
                        if cost != "N/A":
                            cost_str = f"{cost:,.0f} VND" if isinstance(cost, (int, float)) else str(cost)
                            lines.append(f"     Budget: {cost_str} | Priority: {priority} | KPI: {kpi}")
                    else:
                        lines.append(f"  {i}. {phase}")
            elif isinstance(phases, dict):
                for key, val in phases.items():
                    lines.append(f"  • {key}: {str(val)[:100]}")
            lines.append("")

        # ── Review Board ──
        review_board = kwargs.get("review_board", {})
        if review_board:
            lines.append("─" * 40)
            lines.append("  🏛️ REVIEW BOARD VERDICTS")
            lines.append("─" * 40)
            for reviewer, verdict in review_board.items():
                if isinstance(verdict, dict):
                    score = verdict.get("score", verdict.get("approval_score", "N/A"))
                    summary = verdict.get("summary", verdict.get("reasoning", ""))[:100]
                    lines.append(f"  {reviewer:20s}: Score {score} — {summary}")
                else:
                    lines.append(f"  {reviewer:20s}: {str(verdict)[:100]}")
            lines.append("")

        # ── Customer Feedback ──
        feedback_list = kwargs.get("customer_feedback", [])
        if feedback_list:
            lines.append("─" * 40)
            lines.append("  👤 CUSTOMER FEEDBACK")
            lines.append("─" * 40)
            for fb in feedback_list[-3:]:  # Last 3 feedbacks
                if isinstance(fb, dict):
                    lines.append(f"  Round {fb.get('round', '?')}: Score {fb.get('score', 'N/A')} — {fb.get('feedback', '')[:100]}")
                else:
                    lines.append(f"  • {str(fb)[:100]}")
            lines.append("")

        # ── CFO Decision ──
        cfo = kwargs.get("cfo_decision", {})
        if cfo:
            lines.append("─" * 40)
            lines.append("  💰 CFO DECISION")
            lines.append("─" * 40)
            decision = cfo.get("decision", cfo.get("verdict", "N/A"))
            risk = cfo.get("risk_level", "N/A")
            lines.append(f"  Decision: {decision}")
            lines.append(f"  Risk Level: {risk}")
            cuts = cfo.get("cuts", cfo.get("cut_items", []))
            if cuts:
                lines.append(f"  Items Cut: {', '.join(str(c) for c in cuts[:5])}")
            lines.append("")

        lines.append("═" * 70)
        lines.append("  Generated by BrandFlow AI Multi-Agent Strategy Engine v2.0")
        lines.append("═" * 70)
        return lines


def list_final_outputs(limit: int = 20) -> list:
    """List all final output files (for history API)."""
    output_dir = Path(FINAL_OUTPUT_DIR)
    if not output_dir.exists():
        return []

    results = []
    for json_file in sorted(output_dir.glob("final-*.json"), reverse=True)[:limit]:
        try:
            data = json.loads(json_file.read_text(encoding="utf-8"))
            meta = data.get("meta", {})
            results.append({
                "run_id": meta.get("run_id", ""),
                "goal": meta.get("goal", ""),
                "budget": meta.get("budget", 0),
                "approved": meta.get("approved", False),
                "timestamp": meta.get("timestamp", ""),
                "json_file": str(json_file),
            })
        except Exception:
            continue

    return results
