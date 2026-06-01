from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.core.database import get_db
from app.models.models import CustomAgent, User
from app.agents.custom.factory import CustomAgentFactory

router = APIRouter()

# Schema
class CustomAgentCreate(BaseModel):
    name: str
    role: str
    system_prompt: str
    capabilities: List[str]

class CustomAgentResponse(BaseModel):
    id: str
    name: str
    role: str
    system_prompt: str
    capabilities: List[str]

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str

# Endpoints
@router.post("/", response_model=CustomAgentResponse)
def create_custom_agent(agent_data: CustomAgentCreate, db: Session = Depends(get_db)):
    # Mocking user_id for demo
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=400, detail="No users found in database.")

    new_agent = CustomAgent(
        user_id=user.id,
        name=agent_data.name,
        role=agent_data.role,
        system_prompt=agent_data.system_prompt,
        capabilities=agent_data.capabilities
    )
    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)
    return new_agent

@router.get("/", response_model=List[CustomAgentResponse])
def get_custom_agents(db: Session = Depends(get_db)):
    agents = db.query(CustomAgent).all()
    return agents

@router.post("/{agent_id}/chat")
async def chat_with_custom_agent(agent_id: str, chat_req: ChatRequest, db: Session = Depends(get_db)):
    agent_db = db.query(CustomAgent).filter(CustomAgent.id == agent_id).first()
    if not agent_db:
        raise HTTPException(status_code=404, detail="Agent not found")

    try:
        # Build dynamic agent from config
        executor = CustomAgentFactory.build_agent(
            name=agent_db.name,
            role=agent_db.role,
            system_prompt=agent_db.system_prompt,
            capabilities=agent_db.capabilities
        )
        
        # Execute chat
        answer = await CustomAgentFactory.chat_with_agent(executor, chat_req.message)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
