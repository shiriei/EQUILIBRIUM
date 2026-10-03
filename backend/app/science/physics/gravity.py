import math

def calculate_free_fall(height: float, v0: float, g: float, t: float = None) -> dict:
    '''
    Calculates deterministic free fall physics using standard kinematic equations.
    Assumes constant acceleration, no air resistance.
    '''
    # s = v0*t + 0.5*g*t^2
    # If time not provided, calculate time to hit ground: h = v0*t + 0.5*g*t^2
    # 0.5*g*t^2 + v0*t - h = 0
    if t is None:
        # Solving quadratic for positive t
        a = 0.5 * g
        b = v0
        c = -height
        discriminant = b**2 - 4*a*c
        if discriminant < 0:
            raise ValueError("Invalid parameters, object never reaches ground.")
        t = (-b + math.sqrt(discriminant)) / (2*a)
        
    distance_fallen = v0 * t + 0.5 * g * (t ** 2)
    final_velocity = v0 + g * t
    
    return {
        "time": t,
        "final_velocity": final_velocity,
        "distance_fallen": distance_fallen
    }
