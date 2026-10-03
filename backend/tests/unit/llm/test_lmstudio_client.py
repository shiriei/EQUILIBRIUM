import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.llm.lmstudio_client import LMStudioClient

@pytest.fixture
def client():
    return LMStudioClient()

@pytest.mark.asyncio
async def test_health_check_success(client):
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": [{"id": client.model}]
        }
        mock_get.return_value = mock_response
        
        result = await client.health_check()
        assert result["available"] is True
        assert result["model"] == client.model

@pytest.mark.asyncio
async def test_health_check_failure(client):
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_get.return_value = mock_response
        
        result = await client.health_check()
        assert result["available"] is False
        assert result["error"] == "Server returned error"

@pytest.mark.asyncio
async def test_chat_success(client):
    with patch('httpx.AsyncClient.post') as mock_post:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "choices": [{"message": {"content": "Hello World"}}]
        }
        mock_post.return_value = mock_response
        
        result = await client.chat("Say hello")
        assert result == "Hello World"
