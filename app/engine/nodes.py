"""
═══════════════════════════════════════════════════════════════════════════════
nodes.py v2 — Node Types for BrandFlow Workflow Engine
═══════════════════════════════════════════════════════════════════════════════
Node types:
  - FunctionNode:     Gọi một Python function
  - ConditionNode:    Rẽ nhánh (SAFE evaluator, không dùng eval raw)
  - VariableNode:     Gán biến vào state
  - ParallelNode:     Chạy nhiều function đồng thời (CFO + Persona)
  - QualityGateNode:  Validate output trước khi forward
═══════════════════════════════════════════════════════════════════════════════
"""

import importlib
import operator
import re
from typing import Any, Dict, Optional, List
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeoutError


# ═══════════════════════════════════════════════════════════════════════════════
# BASE NODE
# ═══════════════════════════════════════════════════════════════════════════════

class BaseNode:
    def __init__(self, node_id: str, config: Dict[str, Any]):
        self.node_id = node_id
        self.config = config

    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        """
        Thực thi node và thay đổi state in-place.
        Trả về next_node_id (str) hoặc None (nếu kết thúc).
        """
        raise NotImplementedError

    def _resolve_inputs(self, state: Dict[str, Any], inputs_mapping: Dict[str, Any]) -> Dict[str, Any]:
        """Biến đổi mapping (VD: $budget) thành giá trị thực từ state."""
        kwargs = {}
        for kwarg, state_key in inputs_mapping.items():
            if isinstance(state_key, str) and state_key == "$":
                kwargs[kwarg] = state
            elif isinstance(state_key, str) and state_key.startswith("$"):
                keys = state_key[1:].split(".")
                val = state
                try:
                    for k in keys:
                        if isinstance(val, dict):
                            val = val.get(k)
                        else:
                            val = getattr(val, k)
                    kwargs[kwarg] = val
                except Exception:
                    kwargs[kwarg] = None
            else:
                kwargs[kwarg] = state_key
        return kwargs


# ═══════════════════════════════════════════════════════════════════════════════
# FUNCTION NODE — Gọi Python function
# ═══════════════════════════════════════════════════════════════════════════════

class FunctionNode(BaseNode):
    """Node gọi một Python function bất kỳ."""
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        func_path = self.config.get("function")
        inputs_mapping = self.config.get("inputs", {})
        output_key = self.config.get("output_key")
        
        module_name, func_name = func_path.rsplit(".", 1)
        module = importlib.import_module(module_name)
        func = getattr(module, func_name)
        
        kwargs = self._resolve_inputs(state, inputs_mapping)
        
        print(f"▶️ [NODE] Chạy {self.node_id} ({func_name})")
        result = func(**kwargs)
        
        if output_key:
            state[output_key] = result
            
        return self.config.get("next")


# ═══════════════════════════════════════════════════════════════════════════════
# CONDITION NODE — Safe boolean evaluator (NO raw eval)
# ═══════════════════════════════════════════════════════════════════════════════

class ConditionNode(BaseNode):
    """
    Node đánh giá biểu thức boolean để rẽ nhánh.
    Sử dụng safe evaluator thay vì raw eval().
    """
    
    # Allowed operators for safe evaluation
    SAFE_OPERATORS = {
        ">=": operator.ge,
        "<=": operator.le,
        ">": operator.gt,
        "<": operator.lt,
        "==": operator.eq,
        "!=": operator.ne,
    }
    
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        condition_expr = self.config.get("condition", "")
        
        print(f"🔀 [NODE] Đánh giá điều kiện: {condition_expr}")
        
        try:
            is_true = self._safe_evaluate(condition_expr, state)
            
            if is_true:
                target = self.config.get("on_true")
                print(f"   ↳ TRUE → {target}")
                return target
            else:
                target = self.config.get("on_false")
                print(f"   ↳ FALSE → {target}")
                return target
                
        except Exception as e:
            print(f"⚠️ [NODE] Lỗi condition '{condition_expr}': {e}")
            # On error, default to on_true (safer: proceed to finalize)
            fallback = self.config.get("on_true")
            print(f"   ↳ FALLBACK (error) → {fallback}")
            return fallback
    
    def _safe_evaluate(self, expr: str, state: Dict[str, Any]) -> bool:
        """
        Safe evaluation of condition expressions.
        
        Supports:
          - "X >= Y or A >= B"  (OR conditions)
          - "X >= Y and A >= B" (AND conditions) 
          - "dict.get('key', default) >= value"
          - Simple comparisons: "variable >= number"
        """
        expr = expr.strip()
        
        # Handle OR conditions
        if " or " in expr:
            parts = expr.split(" or ")
            return any(self._safe_evaluate(part.strip(), state) for part in parts)
        
        # Handle AND conditions
        if " and " in expr:
            parts = expr.split(" and ")
            return all(self._safe_evaluate(part.strip(), state) for part in parts)
        
        # Parse single comparison: "left_expr OP right_expr"
        for op_str in sorted(self.SAFE_OPERATORS.keys(), key=len, reverse=True):
            if op_str in expr:
                parts = expr.split(op_str, 1)
                if len(parts) == 2:
                    left_val = self._resolve_value(parts[0].strip(), state)
                    right_val = self._resolve_value(parts[1].strip(), state)
                    op_func = self.SAFE_OPERATORS[op_str]
                    return op_func(left_val, right_val)
        
        # Fallback: try to resolve as truthy value
        val = self._resolve_value(expr, state)
        return bool(val)
    
    def _resolve_value(self, token: str, state: Dict[str, Any]) -> Any:
        """Resolve a token to its actual value from state."""
        token = token.strip()
        
        # Pure numeric
        try:
            if "." in token:
                return float(token)
            return int(token)
        except ValueError:
            pass
        
        # Boolean literals
        if token.lower() == "true":
            return True
        if token.lower() == "false":
            return False
        
        # String literal
        if (token.startswith('"') and token.endswith('"')) or \
           (token.startswith("'") and token.endswith("'")):
            return token[1:-1]
        
        # dict.get('key', default) pattern
        get_match = re.match(r"(\w[\w.]*?)\.get\(['\"](\w+)['\"],?\s*(\d+)?\)", token)
        if get_match:
            var_name = get_match.group(1)
            key = get_match.group(2)
            default = int(get_match.group(3)) if get_match.group(3) else 0
            obj = self._resolve_state_path(var_name, state)
            if isinstance(obj, dict):
                return obj.get(key, default)
            return default
        
        # State variable path (e.g., "loop_metrics.final_score")
        return self._resolve_state_path(token, state)
    
    def _resolve_state_path(self, path: str, state: Dict[str, Any]) -> Any:
        """Resolve a dotted path like 'loop_metrics.final_score' from state."""
        keys = path.split(".")
        val = state
        try:
            for k in keys:
                if isinstance(val, dict):
                    val = val.get(k, 0)
                else:
                    val = getattr(val, k, 0)
            return val
        except Exception:
            return 0


# ═══════════════════════════════════════════════════════════════════════════════
# VARIABLE NODE — Gán biến
# ═══════════════════════════════════════════════════════════════════════════════

class VariableNode(BaseNode):
    """Node gán các biến/tính toán đơn giản vào State."""
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        assignments = self.config.get("assignments", {})
        for k, v in assignments.items():
            if isinstance(v, str) and v.startswith("$"):
                try:
                    # Safe arithmetic: only allow addition on state values
                    expr = v[1:]
                    if "+" in expr:
                        parts = expr.split("+")
                        left = self._resolve_state_path(parts[0].strip(), state)
                        right = int(parts[1].strip())
                        state[k] = (left or 0) + right
                    elif "-" in expr:
                        parts = expr.split("-")
                        left = self._resolve_state_path(parts[0].strip(), state)
                        right = int(parts[1].strip())
                        state[k] = (left or 0) - right
                    else:
                        state[k] = self._resolve_state_path(expr, state)
                except Exception as e:
                    print(f"⚠️ [NODE] Lỗi gán biến {k} = {v}: {e}")
                    state[k] = None
            else:
                state[k] = v
        print(f"✏️ [NODE] Gán biến: {list(assignments.keys())}")
        return self.config.get("next")
    
    def _resolve_state_path(self, path: str, state: Dict[str, Any]) -> Any:
        keys = path.split(".")
        val = state
        try:
            for k in keys:
                if isinstance(val, dict):
                    val = val.get(k)
                else:
                    val = getattr(val, k, None)
            return val
        except Exception:
            return None


# ═══════════════════════════════════════════════════════════════════════════════
# PARALLEL NODE — Chạy nhiều function đồng thời
# ═══════════════════════════════════════════════════════════════════════════════

PARALLEL_TIMEOUT_SECONDS = 90

class ParallelNode(BaseNode):
    """
    Node chạy nhiều function đồng thời (VD: CFO + Persona review song song).
    
    Config format:
    {
        "type": "ParallelNode",
        "functions": [
            {
                "function": "module.path.func_name",
                "inputs": {"arg": "$state_key"},
                "output_key": "result_key_in_state"
            },
            ...
        ],
        "timeout": 90,
        "next": "next_node_id"
    }
    """
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        functions_config = self.config.get("functions", [])
        timeout = self.config.get("timeout", PARALLEL_TIMEOUT_SECONDS)
        
        if not functions_config:
            print(f"⚠️ [PARALLEL] No functions configured for {self.node_id}")
            return self.config.get("next")
        
        print(f"⚡ [PARALLEL] Running {len(functions_config)} functions concurrently (timeout={timeout}s)")
        
        def _run_one(func_config: dict) -> tuple:
            """Execute a single function and return (output_key, result)."""
            func_path = func_config["function"]
            inputs_mapping = func_config.get("inputs", {})
            output_key = func_config.get("output_key")
            
            module_name, func_name = func_path.rsplit(".", 1)
            module = importlib.import_module(module_name)
            func = getattr(module, func_name)
            
            kwargs = self._resolve_inputs(state, inputs_mapping)
            
            print(f"   ▶️ [PARALLEL] Starting: {func_name}")
            result = func(**kwargs)
            print(f"   ✅ [PARALLEL] Done: {func_name}")
            
            return (output_key, result)
        
        results = {}
        with ThreadPoolExecutor(max_workers=len(functions_config)) as executor:
            futures = {
                executor.submit(_run_one, fc): fc 
                for fc in functions_config
            }
            
            for future in futures:
                fc = futures[future]
                func_name = fc["function"].rsplit(".", 1)[1]
                try:
                    output_key, result = future.result(timeout=timeout)
                    if output_key:
                        state[output_key] = result
                        results[output_key] = "success"
                except FuturesTimeoutError:
                    output_key = fc.get("output_key")
                    print(f"   ⏰ [PARALLEL] Timeout: {func_name} ({timeout}s)")
                    if output_key:
                        # Set fallback value
                        state[output_key] = fc.get("fallback", {})
                        results[output_key] = "timeout"
                except Exception as e:
                    output_key = fc.get("output_key")
                    print(f"   ❌ [PARALLEL] Error in {func_name}: {e}")
                    if output_key:
                        state[output_key] = fc.get("fallback", {})
                        results[output_key] = f"error: {str(e)[:100]}"
        
        success_count = sum(1 for v in results.values() if v == "success")
        print(f"⚡ [PARALLEL] Complete: {success_count}/{len(functions_config)} succeeded")
        
        return self.config.get("next")


# ═══════════════════════════════════════════════════════════════════════════════
# QUALITY GATE NODE — Validate output trước khi forward
# ═══════════════════════════════════════════════════════════════════════════════

class QualityGateNode(BaseNode):
    """
    Node kiểm tra chất lượng output trước khi forward sang stage tiếp.
    
    Config format:
    {
        "type": "QualityGateNode",
        "check_key": "state_key_to_validate",
        "required_fields": ["field1", "field2"],
        "min_content_length": 50,
        "on_pass": "next_node_if_pass",
        "on_fail": "next_node_if_fail"
    }
    """
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        check_key = self.config.get("check_key")
        required_fields = self.config.get("required_fields", [])
        min_length = self.config.get("min_content_length", 0)
        
        data = state.get(check_key)
        
        print(f"🔍 [QUALITY] Checking '{check_key}'...")
        
        issues = []
        
        # Check existence
        if data is None:
            issues.append(f"'{check_key}' is None/missing")
        elif isinstance(data, dict):
            # Check required fields
            for field in required_fields:
                if field not in data or data[field] is None:
                    issues.append(f"Missing field: '{field}'")
                elif isinstance(data[field], str) and len(data[field].strip()) == 0:
                    issues.append(f"Empty field: '{field}'")
            
            # Check content length
            if min_length > 0:
                content_str = str(data)
                if len(content_str) < min_length:
                    issues.append(f"Content too short: {len(content_str)} < {min_length} chars")
        elif isinstance(data, str):
            if len(data.strip()) < min_length:
                issues.append(f"String too short: {len(data)} < {min_length} chars")
        
        if issues:
            print(f"   ⚠️ [QUALITY] FAILED — {len(issues)} issues:")
            for issue in issues:
                print(f"      • {issue}")
            
            state["agent_logs"] = state.get("agent_logs", [])
            state["agent_logs"].append({
                "agent": "SYSTEM",
                "role": "Quality Gate",
                "message": f"Quality check for '{check_key}' found issues: {'; '.join(issues)}"
            })
            
            return self.config.get("on_fail", self.config.get("on_pass"))
        
        print(f"   ✅ [QUALITY] PASSED")
        return self.config.get("on_pass", self.config.get("next"))
