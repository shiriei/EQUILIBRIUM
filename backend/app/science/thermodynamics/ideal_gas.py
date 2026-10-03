
R_IDEAL = 8.31446261815324

def solve_ideal_gas(p: float = None, v: float = None, n: float = None, t: float = None) -> dict:
    '''
    Solves PV = nRT for the missing variable.
    Assumes standard SI units (Pa, m^3, mol, K).
    Returns all 4 variables.
    '''
    provided = sum(x is not None for x in [p, v, n, t])
    if provided != 3:
        raise ValueError("Exactly 3 variables must be provided to solve the ideal gas law.")
        
    if p is None:
        p = (n * R_IDEAL * t) / v
    elif v is None:
        v = (n * R_IDEAL * t) / p
    elif n is None:
        n = (p * v) / (R_IDEAL * t)
    elif t is None:
        t = (p * v) / (n * R_IDEAL)
        
    return {"pressure": p, "volume": v, "moles": n, "temperature": t, "r_constant": R_IDEAL}
