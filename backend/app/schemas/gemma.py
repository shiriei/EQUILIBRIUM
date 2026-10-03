from pydantic import BaseModel
from typing import Dict, Any, Optional

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    model: str
    response: str
    source: str

class ExplainRequest(BaseModel):
    topic: str
    experiment: Dict[str, Any]
    student_prediction: str
    actual_result: Dict[str, Any]
    detected_misconception: Optional[str] = None
