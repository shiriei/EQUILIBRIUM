import math

def calculate_projectile(velocity: float, angle_degrees: float, gravity: float, initial_height: float = 0.0) -> dict:
    '''
    Calculates deterministic ideal projectile motion.
    Assumes constant gravitational acceleration and no air resistance.
    '''
    theta = math.radians(angle_degrees)
    vx = velocity * math.cos(theta)
    vy = velocity * math.sin(theta)
    
    # max height relative to start
    h_max = (vy ** 2) / (2 * gravity) + initial_height
    
    # flight time (solving y = y0 + vy*t - 0.5*g*t^2 = 0)
    a = -0.5 * gravity
    b = vy
    c = initial_height
    discriminant = b**2 - 4*a*c
    if discriminant < 0:
        flight_time = 0
    else:
        t1 = (-b + math.sqrt(discriminant)) / (2*a)
        t2 = (-b - math.sqrt(discriminant)) / (2*a)
        flight_time = max(t1, t2)
        
    range_x = vx * flight_time
    
    return {
        "max_height": h_max,
        "flight_time": flight_time,
        "range": range_x
    }
