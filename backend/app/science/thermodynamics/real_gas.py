
# Real fluid properties using CoolProp
import CoolProp.CoolProp as CP

def get_real_fluid_density(fluid: str, temperature: float, pressure: float) -> float:
    try:
        # returns density in kg/m^3
        return CP.PropsSI('D', 'T', temperature, 'P', pressure, fluid)
    except Exception as e:
        raise ValueError(f"CoolProp calculation failed: {e}")
