from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
import uuid

class ExperimentCreate(BaseModel):
    experiment_type: str
    parameters: Dict[str, Any]

class ExperimentPrediction(BaseModel):
    prediction: Dict[str, Any]
    confidence: float

class ExperimentResult(BaseModel):
    actual_result: Dict[str, Any]

class ExperimentRecord(BaseModel):
    experiment_id: str
    experiment_type: str
    parameters: Dict[str, Any]
    prediction: Optional[Dict[str, Any]] = None
    actual_result: Optional[Dict[str, Any]] = None
    prediction_error: Optional[float] = None
    confidence: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
