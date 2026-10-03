
def test_health(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_physics_endpoints(client):
    res = client.post("/api/v1/physics/free-fall", json={
        "height": 100,
        "initial_velocity": 0,
        "gravity": 9.81
    })
    assert res.status_code == 200
    assert "time" in res.json()

def test_thermo_ideal_gas(client):
    res = client.post("/api/v1/thermodynamics/ideal-gas", json={
        "volume": 1.0,
        "moles": 1.0,
        "temperature": 273.15
    })
    assert res.status_code == 200
    assert "pressure" in res.json()
