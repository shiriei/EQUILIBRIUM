from fastapi import APIRouter, HTTPException
from app.llm.lmstudio_client import LMStudioClient
from app.schemas.gemma import ChatRequest, ChatResponse, ExplainRequest
import json
import os

router = APIRouter()
client = LMStudioClient()

@router.get("/health")
async def gemma_health():
    res = await client.health_check()
    if not res.get("available"):
        raise HTTPException(status_code=503, detail=res)
    return res

@router.post("/chat", response_model=ChatResponse)
async def gemma_chat(req: ChatRequest):
    try:
        content = await client.chat(req.message)
        return ChatResponse(model=client.model, response=content, source="local-lm-studio")
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

@router.post("/explain", response_model=ChatResponse)
async def gemma_explain(req: ExplainRequest):
    # Load system prompt
    prompt_path = os.path.join(os.path.dirname(__file__), '..', '..', 'llm', 'prompts', f'{req.topic}_explanation.txt')
    system_prompt = "You are an educational explanation layer. Do not modify scientific results."
    if os.path.exists(prompt_path):
        with open(prompt_path, 'r') as f:
            system_prompt = f.read()

    message = json.dumps(req.model_dump(), indent=2)
    
    try:
        content = await client.chat(message, system_prompt=system_prompt)
        return ChatResponse(model=client.model, response=content, source="local-lm-studio")
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
