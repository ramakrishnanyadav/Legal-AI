from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from enum import Enum
from app.models.shared import Classification, Severity

class UserRole(str, Enum):
    VICTIM = "victim"
    ACCUSED = "accused"
    WITNESS = "witness"

class CaseType(str, Enum):
    FINANCIAL = "financial"
    VIOLENCE = "violence"
    CYBER = "cyber"
    TRAFFIC = "traffic"
    OTHER = "other"

class CaseAnalysisRequest(BaseModel):
    description: str = Field(..., min_length=10, max_length=2000)
    role: UserRole = UserRole.VICTIM
    urgency: Optional[bool] = False
    case_type: Optional[CaseType] = None
    
    @field_validator('description')
    @classmethod
    def validate_description(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Description must be at least 10 characters')
        return v.strip()