from fastapi import APIRouter, HTTPException
from app.schemas.physics import FreeFallRequest, FreeFallResponse, ProjectileRequest, ProjectileResponse
from app.science.physics.gravity import calculate_free_fall
from app.science.physics.projectile import calculate_projectile

router = APIRouter()

@router.post("/free-fall", response_model=FreeFallResponse)
async def free_fall_endpoint(req: FreeFallRequest):
    try:
        res = calculate_free_fall(req.height, req.initial_velocity, req.gravity, req.time)
        return FreeFallResponse(
            height=req.height,
            initial_velocity=req.initial_velocity,
            gravity=req.gravity,
            time=res["time"],
            final_velocity=res["final_velocity"],
            distance_fallen=res["distance_fallen"]
        )
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.post("/projectile", response_model=ProjectileResponse)
async def projectile_endpoint(req: ProjectileRequest):
    try:
        res = calculate_projectile(req.velocity, req.angle_degrees, req.gravity, req.initial_height)
        return ProjectileResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

from app.schemas.experiment import DropExperimentRequest, DropExperimentResponse
from app.science.physics.experiment import calculate_drop_experiment

@router.post("/experiment/drop", response_model=DropExperimentResponse)
async def drop_experiment_endpoint(req: DropExperimentRequest):
    try:
        res = calculate_drop_experiment(req)
        return DropExperimentResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

