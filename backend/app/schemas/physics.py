from pydantic import BaseModel
from typing import Optional

class FreeFallRequest(BaseModel):
    height: float
    initial_velocity: float = 0.0
    gravity: float = 9.81
    time: Optional[float] = None

class FreeFallResponse(BaseModel):
    height: float
    initial_velocity: float
    gravity: float
    time: float
    final_velocity: float
    distance_fallen: float

class ProjectileRequest(BaseModel):
    velocity: float
    angle_degrees: float
    gravity: float = 9.81
    initial_height: float = 0.0

class ProjectileResponse(BaseModel):
    max_height: float
    flight_time: float
    range: float
