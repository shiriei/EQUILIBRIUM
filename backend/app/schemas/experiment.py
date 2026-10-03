from pydantic import BaseModel, Field
from typing import Optional

class ObjectSchema(BaseModel):
    shape: str = Field(..., description="Sphere, Cube, Flat Plate, etc.")
    mass_kg: float
    dimensions: dict

class EnvironmentSchema(BaseModel):
    planet: str
    gravity_mps2: float
    air_resistance: bool
    fluid_density_kg_m3: float = 1.225
    drag_coefficient: float = 0.47
    wind_speed_mps: float = 0.0

class InitialConditionsSchema(BaseModel):
    height_m: float
    velocity_mps: float = 0.0

class SurfaceSchema(BaseModel):
    surface_type: str = "Concrete"
    restitution: float = 0.3
    friction: float = 0.5

class DropExperimentRequest(BaseModel):
    question: Optional[str] = ""
    prediction: Optional[str] = ""
    confidence: Optional[str] = ""
    object_config: ObjectSchema
    environment: EnvironmentSchema
    initial_conditions: InitialConditionsSchema
    surface: SurfaceSchema

class DropExperimentResponse(BaseModel):
    time_to_impact: float
    final_velocity: float
    max_speed: float
    max_acceleration: float
    impact_velocity: float
    bounce_height: float
    energy_lost: float
    time_series: dict # times, positions, velocities, accelerations, drag_forces, net_forces
