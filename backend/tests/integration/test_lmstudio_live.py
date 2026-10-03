import pytest
import httpx
from app.llm.lmstudio_client import LMStudioClient

@pytest.fixture
def client():
    return LMStudioClient()

@pytest.mark.asyncio
async def test_live_health_check(client):
    # Determine if server is running
    try:
        async with httpx.AsyncClient(timeout=3) as http_client:
            res = await http_client.get(f"{client.base_url}/models")
            if res.status_code != 200:
                pytest.skip("LM Studio is running but returned error on /models")
    except Exception:
        pytest.skip("LM Studio local server is offline, skipping integration test.")
    
    # Run the actual health check
    result = await client.health_check()
    assert result["available"] is True
    assert result["model"] == "google/gemma-3-4b"

@pytest.mark.asyncio
async def test_live_chat(client):
    try:
        async with httpx.AsyncClient(timeout=3) as http_client:
            await http_client.get(f"{client.base_url}/models")
    except Exception:
        pytest.skip("LM Studio local server is offline, skipping chat test.")
    
    response = await client.chat("Say 'Integration test pass'")
    assert len(response) > 0
