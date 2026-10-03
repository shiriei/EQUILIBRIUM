from fastapi import APIRouter, HTTPException
from app.schemas.thermodynamics import IdealGasRequest, IdealGasResponse, RealGasRequest
from app.science.thermodynamics.ideal_gas import solve_ideal_gas
from app.science.thermodynamics.real_gas import get_real_fluid_density

router = APIRouter()

@router.post("/ideal-gas", response_model=IdealGasResponse)
async def ideal_gas_endpoint(req: IdealGasRequest):
    try:
        res = solve_ideal_gas(req.pressure, req.volume, req.moles, req.temperature)
        return IdealGasResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.post("/real-gas")
async def real_gas_endpoint(req: RealGasRequest):
    try:
        density = get_real_fluid_density(req.fluid, req.temperature, req.pressure)
        return {"fluid": req.fluid, "density": density}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))
