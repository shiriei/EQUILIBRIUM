from pydantic import BaseModel
from typing import Optional

class IdealGasRequest(BaseModel):
    pressure: Optional[float] = None
    volume: Optional[float] = None
    moles: Optional[float] = None
    temperature: Optional[float] = None

class IdealGasResponse(BaseModel):
    pressure: float
    volume: float
    moles: float
    temperature: float
    r_constant: float
    
class RealGasRequest(BaseModel):
    fluid: str
    temperature: float
    pressure: float
