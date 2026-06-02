"""
═══════════════════════════════════════════════════════════════════════════════
WorkflowExecutor v2 — Anti-Loop + Per-Node Timeout + Retry + Structured Logs
═══════════════════════════════════════════════════════════════════════════════
Fixes:
  - MAX_STEPS hard limit (50) prevents infinite graph traversal
  - Per-node visit counter (max 4 visits per node) catches loop cycles
  - Per-node timeout (90s default) prevents hanging on slow LLM calls
  - Retry with fallback (1 retry) for transient API failures
  - Structured execution log for observability
"""

import json
import time
import traceback
from typing import Any, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError
from app.engine.nodes import FunctionNode, ConditionNode, VariableNode, ParallelNode, QualityGateNode, BaseNode


# ═══════════════════════════════════════════════════════════════════════════════
# SAFETY CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

MAX_STEPS = 50                  # Absolute hard limit on total steps executed
MAX_NODE_VISITS = 4             # Max times a single node can be visited (loop protection)
NODE_TIMEOUT_SECONDS = 90       # Default per-node timeout
NODE_RETRY_COUNT = 1            # Number of retries per node on failure


class WorkflowExecutionError(Exception):
    """Raised when the workflow cannot continue safely."""
    def __init__(self, message: str, node_id: str = "", step: int = 0, logs: list = None):
        super().__init__(message)
        self.node_id = node_id
        self.step = step
        self.logs = logs or []


class WorkflowExecutor:
    """Động cơ thực thi Graph Node-based v2 — với anti-loop và timeout."""
    
    def __init__(self, workflow_json_path: str, initial_state: Dict[str, Any]):
        self.state = initial_state
        self.nodes_config = self._load_workflow(workflow_json_path)
        self.nodes: Dict[str, BaseNode] = {}
        self._initialize_nodes()

    def _load_workflow(self, path: str) -> Dict[str, Any]:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _initialize_nodes(self):
        config_nodes = self.nodes_config.get("nodes", {})
        node_type_map = {
            "FunctionNode": FunctionNode,
            "ConditionNode": ConditionNode,
            "VariableNode": VariableNode,
            "ParallelNode": ParallelNode,
            "QualityGateNode": QualityGateNode,
        }
        for node_id, config in config_nodes.items():
            node_type = config.get("type")
            node_class = node_type_map.get(node_type)
            if node_class is None:
                raise ValueError(f"Unknown node type: {node_type} for node {node_id}")
            self.nodes[node_id] = node_class(node_id, config)

    def _execute_node_with_timeout(self, node: BaseNode, state: Dict[str, Any], timeout: float) -> Optional[str]:
        """Execute a single node with timeout protection."""
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(node.execute, state)
            try:
                return future.result(timeout=timeout)
            except FuturesTimeoutError:
                future.cancel()
                raise TimeoutError(f"Node '{node.node_id}' timed out after {timeout}s")

    def _execute_node_with_retry(self, node: BaseNode, state: Dict[str, Any], timeout: float) -> Optional[str]:
        """Execute node with retry logic. Retries once on failure."""
        last_error = None
        for attempt in range(1 + NODE_RETRY_COUNT):
            try:
                return self._execute_node_with_timeout(node, state, timeout)
            except Exception as e:
                last_error = e
                if attempt < NODE_RETRY_COUNT:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s
                    print(f"   ⚠️ [RETRY] Node '{node.node_id}' failed (attempt {attempt+1}): {e}")
                    print(f"   ⏳ Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                else:
                    print(f"   ❌ [FAIL] Node '{node.node_id}' failed after {attempt+1} attempts: {e}")
        
        # All retries exhausted — raise
        raise last_error

    def run(self, start_node_id: str) -> Dict[str, Any]:
        """
        Thực thi workflow từ start_node_id với full safety guarantees.
        
        Safety mechanisms:
          1. MAX_STEPS (50) — hard limit on total steps
          2. Per-node visit counter — max 4 visits per node  
          3. Per-node timeout (90s) — prevents hanging
          4. Retry with backoff — handles transient failures
          5. Structured execution log — full observability
        """
        current_node_id = start_node_id
        step_count = 0
        node_visit_counts: Dict[str, int] = {}
        execution_log: list = []
        
        print(f"\n{'═' * 70}")
        print(f"🚀 [ENGINE v2] Khởi động Workflow (Anti-Loop + Timeout + Retry)")
        print(f"   MAX_STEPS={MAX_STEPS} | MAX_NODE_VISITS={MAX_NODE_VISITS} | TIMEOUT={NODE_TIMEOUT_SECONDS}s")
        print(f"{'═' * 70}")
        
        # Initialize agent_logs in state
        self.state["agent_logs"] = self.state.get("agent_logs", [])
        self.state["_execution_log"] = execution_log
        
        while current_node_id:
            # ── SAFETY CHECK 1: Max steps ──
            step_count += 1
            if step_count > MAX_STEPS:
                print(f"\n🛑 [ENGINE] HARD STOP — Reached MAX_STEPS ({MAX_STEPS}). Force terminating.")
                self.state["agent_logs"].append({
                    "agent": "SYSTEM",
                    "role": "Safety Guard",
                    "message": f"Pipeline bị dừng tại step {step_count} (MAX_STEPS={MAX_STEPS}) để tránh infinite loop."
                })
                break
            
            # ── SAFETY CHECK 2: Node exists ──
            if current_node_id not in self.nodes:
                print(f"⚠️ [ENGINE] Node '{current_node_id}' không tồn tại. Dừng workflow.")
                break
            
            node = self.nodes[current_node_id]
            
            # ── SAFETY CHECK 3: Per-node visit counter ──
            node_visit_counts[current_node_id] = node_visit_counts.get(current_node_id, 0) + 1
            if node_visit_counts[current_node_id] > MAX_NODE_VISITS:
                print(f"\n🛑 [ENGINE] LOOP DETECTED — Node '{current_node_id}' visited {node_visit_counts[current_node_id]} times (max={MAX_NODE_VISITS}). Breaking loop.")
                self.state["agent_logs"].append({
                    "agent": "SYSTEM",
                    "role": "Loop Guard",
                    "message": f"Node '{current_node_id}' đã chạy {node_visit_counts[current_node_id]} lần, vượt quá giới hạn {MAX_NODE_VISITS}. Pipeline tự động chuyển sang finalize."
                })
                # Try to jump to finalize_export if it exists
                if "finalize_export" in self.nodes and current_node_id != "finalize_export":
                    current_node_id = "finalize_export"
                    continue
                break
            
            # ── EXECUTE NODE ──
            step_log = {
                "step": step_count,
                "node_id": current_node_id,
                "node_type": node.__class__.__name__,
                "visit_count": node_visit_counts[current_node_id],
                "start_time": time.time(),
                "status": "running",
            }
            
            try:
                # Determine timeout for this node
                timeout = node.config.get("timeout", NODE_TIMEOUT_SECONDS)
                
                next_node_id = self._execute_node_with_retry(node, self.state, timeout)
                
                step_log["status"] = "success"
                step_log["end_time"] = time.time()
                step_log["duration_ms"] = int((step_log["end_time"] - step_log["start_time"]) * 1000)
                step_log["next_node"] = next_node_id
                
                # Log for FunctionNode agents
                if isinstance(node, FunctionNode) and "agents_core" in node.config.get("function", ""):
                    self.state["agent_logs"].append({
                        "agent": "SYSTEM", 
                        "role": "Node Engine", 
                        "message": f"✅ Hoàn thành Node: {current_node_id} ({step_log['duration_ms']}ms)"
                    })
                
            except Exception as e:
                step_log["status"] = "error"
                step_log["error"] = str(e)
                step_log["end_time"] = time.time()
                step_log["duration_ms"] = int((step_log["end_time"] - step_log["start_time"]) * 1000)
                
                print(f"   ❌ [ENGINE] Node '{current_node_id}' failed permanently: {e}")
                
                self.state["agent_logs"].append({
                    "agent": "SYSTEM",
                    "role": "Error Handler",
                    "message": f"Node '{current_node_id}' thất bại sau retry: {str(e)[:200]}"
                })
                
                # Try graceful degradation: skip to next node or finalize
                next_node_id = node.config.get("next")
                if next_node_id:
                    print(f"   🔄 [ENGINE] Bỏ qua node lỗi, chuyển sang: {next_node_id}")
                elif "finalize_export" in self.nodes:
                    next_node_id = "finalize_export"
                    print(f"   🔄 [ENGINE] Chuyển sang finalize_export do không có next node.")
                else:
                    print(f"   🛑 [ENGINE] Không thể phục hồi. Dừng workflow.")
                    break
            
            execution_log.append(step_log)
            current_node_id = next_node_id
            
        # ── SUMMARY ──
        total_duration = sum(log.get("duration_ms", 0) for log in execution_log)
        success_count = sum(1 for log in execution_log if log.get("status") == "success")
        error_count = sum(1 for log in execution_log if log.get("status") == "error")
        
        print(f"\n{'═' * 70}")
        print(f"✅ [ENGINE v2] Hoàn tất Workflow.")
        print(f"   📊 Steps: {step_count} | ✅ Success: {success_count} | ❌ Errors: {error_count}")
        print(f"   ⏱️  Total: {total_duration}ms")
        print(f"{'═' * 70}")
        
        self.state["_execution_summary"] = {
            "total_steps": step_count,
            "success_count": success_count,
            "error_count": error_count,
            "total_duration_ms": total_duration,
            "max_steps_reached": step_count > MAX_STEPS,
        }
        
        return self.state
