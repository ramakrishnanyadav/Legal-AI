import anthropic
from app.core.config import settings
from app.models.section import LegalSection
from app.models.case import Classification
import json

class AIService:
    """Handles AI analysis with proper prompting"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    def analyze_with_context(
        self,
        description: str,
        classification: Classification,
        user_role: str
    ) -> dict:
        """Analyze case with proper legal context"""
        
        prompt = f"""You are a legal expert analyzing Indian criminal law cases.

CONTEXT:
- Pre-classification: {classification.category}
- Severity: {classification.severity}
- Domain: {classification.domain}
- User role: {user_role}

USER DESCRIPTION:
"{description}"

CRITICAL RULES:
1. Match ONLY based on the actual CRIME described
2. IPC 420 (Cheating) is ONLY for FINANCIAL fraud with money/property
3. IPC 406 (Breach of Trust) is ONLY for property entrustment
4. Bullying/harassment = IPC 503/506 (intimidation)
5. Racism/hate speech = IPC 153A/153B
6. Theft = IPC 379
7. Assault = IPC 323/325

TASK:
Identify applicable IPC sections. Return JSON only:

{{
  "sections": [
    {{
      "code": "IPC XXX",
      "title": "Section title",
      "description": "What this section covers",
      "punishment": "Punishment details",
      "bailable": true/false,
      "cognizable": true/false,
      "confidence": 0.XX,
      "reasoning": "Why this applies",
      "key_factors": ["factor1", "factor2"]
    }}
  ]
}}

Confidence scoring:
- 0.85-1.0: Clear match with all elements
- 0.70-0.84: Good match, some ambiguity
- 0.50-0.69: Possible match, needs clarification
- Below 0.50: Weak match, flag for review"""

        try:
            response = self.client.messages.create(
                model=settings.AI_MODEL,
                max_tokens=settings.AI_MAX_TOKENS,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Extract JSON from response
            content = response.content[0].text
            # Try to parse JSON (Claude sometimes wraps it in markdown)
            content = content.replace("```json", "").replace("```", "").strip()
            result = json.loads(content)
            
            # Convert to LegalSection objects
            sections = [
                LegalSection(**section_data)
                for section_data in result.get("sections", [])
            ]
            
            return {"sections": sections}
            
        except Exception as e:
            print(f"AI Service error: {e}")
            return {"sections": []}