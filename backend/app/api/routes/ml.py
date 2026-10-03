from fastapi import APIRouter, HTTPException
from app.ml.inference.predictor import predict_misconception, get_model
from typing import List

router = APIRouter()

@router.post("/predict")
async def predict_endpoint(features: List[float]):
    if not get_model():
        raise HTTPException(status_code=503, detail="Model not trained. Waiting for legitimate labeled data.")
    try:
        return predict_misconception(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
