import json
from typing import Any, Dict, Optional
from app.engine.nodes import FunctionNode, ConditionNode, VariableNode, BaseNode

class WorkflowExecutor:
    """Động cơ thực thi Graph Node-based (Gumloop style)."""
    
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
        for node_id, config in config_nodes.items():
            node_type = config.get("type")
            if node_type == "FunctionNode":
                self.nodes[node_id] = FunctionNode(node_id, config)
            elif node_type == "ConditionNode":
                self.nodes[node_id] = ConditionNode(node_id, config)
            elif node_type == "VariableNode":
                self.nodes[node_id] = VariableNode(node_id, config)
            else:
                raise ValueError(f"Unknown node type: {node_type} for node {node_id}")

    def run(self, start_node_id: str) -> Dict[str, Any]:
        """Thực thi bắt đầu từ start_node_id cho đến khi luồng kết thúc."""
        current_node_id = start_node_id
        
        print(f"\n{'═' * 70}")
        print(f"🚀 [ENGINE] Khởi động Workflow Node Engine")
        print(f"{'═' * 70}")
        
        # Log array để theo dõi luồng như hệ thống cũ
        self.state["agent_logs"] = self.state.get("agent_logs", [])
        
        while current_node_id:
            if current_node_id not in self.nodes:
                print(f"⚠️ [ENGINE] Lỗi: Node '{current_node_id}' không tồn tại trong Workflow.")
                break
                
            node = self.nodes[current_node_id]
            next_node_id = node.execute(self.state)
            
            # Ghi log những node thành công
            if isinstance(node, FunctionNode) and "agents_core" in node.config.get("function", ""):
                self.state["agent_logs"].append({
                    "agent": "SYSTEM", 
                    "role": "Node Engine", 
                    "message": f"Hoàn thành xử lý Node: {current_node_id}"
                })

            current_node_id = next_node_id
            
        print(f"\n{'═' * 70}")
        print(f"✅ [ENGINE] Hoàn tất luồng Workflow.")
        print(f"{'═' * 70}")
        return self.state
