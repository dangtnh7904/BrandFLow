import importlib
from typing import Any, Dict, Optional

class BaseNode:
    def __init__(self, node_id: str, config: Dict[str, Any]):
        self.node_id = node_id
        self.config = config

    def execute(self, state: Dict[str, Any]) -> str:
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

class ConditionNode(BaseNode):
    """Node đánh giá biểu thức boolean để rẽ nhánh (Routing)."""
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        condition_expr = self.config.get("condition")
        
        # Inject các biến từ state vào môi trường eval một cách an toàn
        local_vars = state.copy()
        
        print(f"🔀 [NODE] Đánh giá điều kiện: {condition_expr}")
        try:
            # Cảnh báo bảo mật: Trong thực tế, chỉ dùng eval cho các môi trường kiểm soát.
            # Vì đây là json nội bộ nên tương đối an toàn.
            is_true = eval(condition_expr, {}, local_vars)
            
            if is_true:
                print(f"   ↳ Kết quả: TRUE -> Rẽ sang {self.config.get('on_true')}")
                return self.config.get("on_true")
            else:
                print(f"   ↳ Kết quả: FALSE -> Rẽ sang {self.config.get('on_false')}")
                return self.config.get("on_false")
        except Exception as e:
            print(f"⚠️ [NODE] Lỗi đánh giá điều kiện {condition_expr}: {e}")
            return None

class VariableNode(BaseNode):
    """Node gán các biến/tính toán đơn giản vào State."""
    def execute(self, state: Dict[str, Any]) -> Optional[str]:
        assignments = self.config.get("assignments", {})
        for k, v in assignments.items():
            if isinstance(v, str) and v.startswith("$"):
                try:
                    state[k] = eval(v[1:], {}, state.copy())
                except Exception as e:
                    print(f"⚠️ [NODE] Lỗi gán biến {k} = {v}: {e}")
                    state[k] = None
            else:
                state[k] = v
        print(f"✏️ [NODE] Gán biến: {list(assignments.keys())}")
        return self.config.get("next")
