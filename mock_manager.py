import re
import json
import os

def parse_mock_md(file_path: str) -> dict:
    """
    Đọc file Markdown, dùng Regex bóc tách khối JSON và trích xuất các câu thoại
    từ CFO hoặc Persona nằm bên dưới khối JSON.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Không tìm thấy file mock data: {file_path}")
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Bóc tách JSON block giả định
    json_match = re.search(r"```json\s*(.*?)\s*```", content, re.DOTALL)
    if not json_match:
        raise ValueError("Không tìm thấy JSON block trong file Markdown Mock.")
        
    json_str = json_match.group(1)
    try:
        dict_json = json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Lỗi cú pháp JSON trong file mock: {e}")

    # Lấy phần text còn lại (sau khối JSON)
    remainder = content[json_match.end():].strip()
    
    agent_logs = []
    lines = remainder.split('\n')
    current_agent = "SYSTEM"
    current_msg = []
    
    for line in lines:
        if line.startswith("CFO:"):
            if current_msg:
                agent_logs.append({"agent": current_agent, "msg": "\n".join(current_msg).strip()})
                current_msg = []
            current_agent = "CFO"
            current_msg.append(line.replace("CFO:", "", 1).strip())
        elif line.startswith("Persona:"):
            if current_msg:
                agent_logs.append({"agent": current_agent, "msg": "\n".join(current_msg).strip()})
                current_msg = []
            current_agent = "Customer Persona"
            current_msg.append(line.replace("Persona:", "", 1).strip())
        elif line.strip():
            current_msg.append(line.strip())
            
    if current_msg:
        agent_logs.append({"agent": current_agent, "msg": "\n".join(current_msg).strip()})

    return {
        "final_plan": dict_json,
        "agent_logs": agent_logs
    }
