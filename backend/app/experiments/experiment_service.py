
import uuid
from datetime import datetime
from app.schemas.experiments import ExperimentRecord, ExperimentCreate, ExperimentPrediction, ExperimentResult

# In-memory storage for prototype
EXPERIMENTS_DB = {}

def create_experiment(data: ExperimentCreate) -> ExperimentRecord:
    exp_id = str(uuid.uuid4())
    record = ExperimentRecord(
        experiment_id=exp_id,
        experiment_type=data.experiment_type,
        parameters=data.parameters
    )
    EXPERIMENTS_DB[exp_id] = record
    return record

def record_prediction(exp_id: str, data: ExperimentPrediction) -> ExperimentRecord:
    if exp_id not in EXPERIMENTS_DB:
        raise ValueError("Experiment not found")
    record = EXPERIMENTS_DB[exp_id]
    record.prediction = data.prediction
    record.confidence = data.confidence
    return record

def complete_experiment(exp_id: str, data: ExperimentResult) -> ExperimentRecord:
    if exp_id not in EXPERIMENTS_DB:
        raise ValueError("Experiment not found")
    record = EXPERIMENTS_DB[exp_id]
    record.actual_result = data.actual_result
    
    # Mock error calculation
    record.prediction_error = 0.5 
    
    return record

def get_experiment(exp_id: str) -> ExperimentRecord:
    if exp_id not in EXPERIMENTS_DB:
        raise ValueError("Experiment not found")
    return EXPERIMENTS_DB[exp_id]
