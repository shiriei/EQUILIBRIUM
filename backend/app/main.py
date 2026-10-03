from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, physics, thermodynamics, chemistry, experiments, ml, gemma

app = FastAPI(
    title="EQUILIBRIUM API",
    description="Backend API for EQUILIBRIUM scientific laboratory",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(physics.router, prefix="/api/v1/physics", tags=["Physics"])
app.include_router(thermodynamics.router, prefix="/api/v1/thermodynamics", tags=["Thermodynamics"])
app.include_router(chemistry.router, prefix="/api/v1/chemistry", tags=["Chemistry"])
app.include_router(experiments.router, prefix="/api/v1/experiments", tags=["Experiments"])
app.include_router(ml.router, prefix="/api/v1/ml", tags=["Machine Learning"])
app.include_router(gemma.router, prefix="/api/v1/gemma", tags=["Gemma / LM Studio"])
