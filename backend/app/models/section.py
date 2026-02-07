from pydantic import BaseModel
from typing import Optional
from app.models.shared import Classification

class LegalSection(BaseModel):
    code: str
    title: str
    description: str
    punishment: str
    bailable: bool
    cognizable: bool
    confidence: float
    reasoning: str
    key_factors: list[str]

class CaseAnalysisResponse(BaseModel):
    success: bool
    classification: Classification
    sections: list[LegalSection]
    overall_confidence: float
    warnings: list[str]
    next_steps: list[str]
    disclaimer: str
    requires_expert_review: bool