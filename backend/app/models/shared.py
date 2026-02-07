from pydantic import BaseModel
from enum import Enum

class Severity(str, Enum):
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"

class Classification(BaseModel):
    category: str
    severity: Severity
    domain: str  # "criminal", "civil", "mixed"
    keywords_found: list[str]
    confidence: float