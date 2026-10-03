
from app.science.physics.gravity import calculate_free_fall
from app.science.physics.projectile import calculate_projectile

def test_free_fall():
    res = calculate_free_fall(height=19.62, v0=0, g=9.81)
    assert abs(res["time"] - 2.0) < 0.01

def test_projectile():
    res = calculate_projectile(velocity=10, angle_degrees=45, gravity=9.81)
    assert res["flight_time"] > 0
