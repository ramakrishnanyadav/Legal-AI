from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    # API Keys
    DEEPSEEK_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # App Config
    APP_NAME: str = "LegalAI"
    DEBUG: bool = False

    # Provider priority (cheap → expensive)
    AI_PROVIDERS: List[str] = ["gemini", "deepseek", "openai", "anthropic"]

    # Model configs
    DEEPSEEK_MODEL: str = "deepseek-chat"
    OPENAI_MODEL: str = "gpt-4o-mini"

    # ✅ IMPORTANT: FULL Gemini model ID
    GEMINI_MODEL: str = "models/gemini-2.0-flash-exp"

    ANTHROPIC_MODEL: str = "claude-sonnet-4-20250514"

    # Generation controls
    AI_MAX_TOKENS: int = 2000
    AI_TEMPERATURE: float = 0.1

    # Confidence thresholds
    MIN_CONFIDENCE: float = 0.50
    HIGH_CONFIDENCE: float = 0.75

    class Config:
        env_file = ".env"


settings = Settings()
