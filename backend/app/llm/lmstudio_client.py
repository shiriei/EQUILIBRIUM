
import httpx
from app.core.config import settings

class LMStudioClient:
    def __init__(self):
        self.base_url = settings.LM_STUDIO_BASE_URL
        self.model = settings.LM_STUDIO_MODEL
        self.timeout = settings.LM_STUDIO_TIMEOUT

    async def health_check(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=3) as client:
                response = await client.get(f"{self.base_url}/models")
                if response.status_code == 200:
                    models = response.json().get("data", [])
                    available = any(m.get("id") == self.model for m in models)
                    return {
                        "available": available,
                        "model": self.model,
                        "base_url": self.base_url
                    }
                else:
                    return {"available": False, "model": self.model, "error": "Server returned error"}
        except Exception as e:
            return {"available": False, "model": self.model, "error": "LM Studio server is not reachable"}

    async def chat(self, message: str, system_prompt: str = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": message})
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    json={"model": self.model, "messages": messages},
                )
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except httpx.RequestError as e:
            raise RuntimeError(f"Connection error to LM Studio: {e}")
        except KeyError:
            raise RuntimeError("Invalid response format from LM Studio")
