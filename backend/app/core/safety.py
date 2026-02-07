from typing import List

class SafetyFilter:
    """Prevents misuse and harmful queries"""
    
    ILLEGAL_KEYWORDS = [
        "how to kill", "murder", "bomb", "poison",
        "evade", "hide evidence", "destroy evidence",
        "fake", "forge documents", "bribe"
    ]
    
    REQUIRES_DISCLAIMER = [
        "invest", "contract", "agreement", "property",
        "will", "custody", "divorce"
    ]
    
    @staticmethod
    def check_query(description: str) -> dict:
        """Check if query is safe and legal"""
        desc_lower = description.lower()
        
        # Check for illegal intent
        for keyword in SafetyFilter.ILLEGAL_KEYWORDS:
            if keyword in desc_lower:
                return {
                    "safe": False,
                    "reason": "This query appears to request assistance with illegal activities",
                    "message": "I cannot provide guidance on illegal activities. If you're facing a legal issue, please consult a lawyer."
                }
        
        # Check if civil law disclaimer needed
        needs_disclaimer = any(kw in desc_lower for kw in SafetyFilter.REQUIRES_DISCLAIMER)
        
        return {
            "safe": True,
            "needs_civil_disclaimer": needs_disclaimer
        }
