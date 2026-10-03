from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    
    LM_STUDIO_BASE_URL: str = "http://127.0.0.1:1234/v1"
    LM_STUDIO_MODEL: str = "google/gemma-3-4b"
    LM_STUDIO_TIMEOUT: int = 120
    LM_STUDIO_API_KEY: str = "lm-studio"

    class Config:
        env_file = "../../.env"

settings = Settings()
