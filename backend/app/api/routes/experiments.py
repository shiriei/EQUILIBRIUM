from fastapi import APIRouter, HTTPException
from app.schemas.experiments import ExperimentCreate, ExperimentPrediction, ExperimentResult, ExperimentRecord
from app.experiments.experiment_service import create_experiment, record_prediction, complete_experiment, get_experiment

router = APIRouter()

@router.post("", response_model=ExperimentRecord)
async def create_exp(req: ExperimentCreate):
    return create_experiment(req)

@router.post("/{id}/prediction", response_model=ExperimentRecord)
async def add_prediction(id: str, req: ExperimentPrediction):
    try:
        return record_prediction(id, req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/{id}/complete", response_model=ExperimentRecord)
async def complete_exp(id: str, req: ExperimentResult):
    try:
        return complete_experiment(id, req)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{id}", response_model=ExperimentRecord)
async def fetch_exp(id: str):
    try:
        return get_experiment(id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
