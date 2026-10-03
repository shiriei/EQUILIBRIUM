import math

def calculate_drop_experiment(req):
    g = req.environment.gravity_mps2
    m = req.object_config.mass_kg
    
    # Calculate Area based on shape
    shape = req.object_config.shape.lower()
    dims = req.object_config.dimensions
    A = 0.01 # default small area
    
    if shape == "sphere":
        d = dims.get("diameter_m", 0.1)
        A = math.pi * (d/2)**2
    elif shape == "cube":
        w = dims.get("width_m", 0.1)
        A = w * w
    elif shape == "flat plate":
        w = dims.get("width_m", 0.5)
        h = dims.get("height_m", 0.5)
        A = w * h
    elif shape == "cylinder":
        r = dims.get("radius_m", 0.05)
        A = math.pi * r**2 # assume falling end-on for simplicity
    elif shape == "disc":
        r = dims.get("radius_m", 0.1)
        A = math.pi * r**2
        
    rho = req.environment.fluid_density_kg_m3
    cd = req.environment.drag_coefficient
    has_drag = req.environment.air_resistance
    
    dt = 0.01
    t = 0.0
    y = req.initial_conditions.height_m
    v = req.initial_conditions.velocity_mps # positive is down for this simulation, wait let's use positive = down
    # actually, let's use standard y=up, v=up (so v is negative when falling)
    v = -abs(req.initial_conditions.velocity_mps) if req.initial_conditions.velocity_mps != 0 else 0.0
    
    times = []
    positions = []
    velocities = []
    accelerations = []
    drag_forces = []
    net_forces = []
    
    impact_velocity = 0.0
    max_speed = 0.0
    max_accel = 0.0
    
    while y > 0 and t < 60.0: # 60 seconds max to prevent infinite loops
        times.append(t)
        positions.append(y)
        velocities.append(v)
        
        # Calculate forces
        F_grav = -m * g
        F_drag = 0.0
        
        if has_drag:
            # v is velocity. If v is negative (falling down), drag is positive (up)
            # F_drag = -0.5 * rho * Cd * A * v * abs(v)
            F_drag = -0.5 * rho * cd * A * v * abs(v)
            
        F_net = F_grav + F_drag
        a = F_net / m
        
        accelerations.append(a)
        drag_forces.append(abs(F_drag))
        net_forces.append(F_net)
        
        if abs(v) > max_speed:
            max_speed = abs(v)
        if abs(a) > max_accel:
            max_accel = abs(a)
            
        # Euler integration
        v += a * dt
        y += v * dt
        t += dt
        
    impact_velocity = abs(v)
    
    # Calculate bounce
    restitution = req.surface.restitution
    bounce_v = impact_velocity * restitution
    energy_before = 0.5 * m * impact_velocity**2
    energy_after = 0.5 * m * bounce_v**2
    energy_lost = energy_before - energy_after
    
    # approximate bounce height (ignoring drag on the way up for a simple analytic result)
    bounce_height = (bounce_v**2) / (2 * g) if g > 0 else 0
    
    # Add the impact point explicitly
    times.append(t)
    positions.append(0.0)
    velocities.append(v)
    accelerations.append(a)
    drag_forces.append(abs(F_drag if has_drag else 0))
    net_forces.append(F_net)
    
    return {
        "time_to_impact": t,
        "final_velocity": v,
        "max_speed": max_speed,
        "max_acceleration": max_accel,
        "impact_velocity": impact_velocity,
        "bounce_height": bounce_height,
        "energy_lost": energy_lost,
        "time_series": {
            "time": times,
            "position": positions,
            "velocity": velocities,
            "acceleration": accelerations,
            "drag_force": drag_forces,
            "net_force": net_forces
        }
    }
