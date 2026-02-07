# app/data/legal_rules.py - STRICT LEGAL VALIDATION RULES

"""
Critical Legal Rules for Indian Criminal Law Analysis
Following Supreme Court precedents and statutory requirements
"""

from typing import Dict, List, Set
from enum import Enum

class LegalDomain(Enum):
    CRIMINAL = "criminal"
    CIVIL = "civil"
    MIXED = "mixed"

# ============================================
# IPC 420 - CHEATING (MOST COMMONLY MISAPPLIED)
# ============================================

IPC_420_RULES = {
    "section": "IPC 420",
    "title": "Cheating and dishonestly inducing delivery of property",
    
    # ALL THREE MUST BE TRUE
    "essential_elements": {
        "deception": {
            "required": True,
            "description": "False representation or concealment of facts AT THE TIME of transaction",
            "keywords": ["lied", "false promise", "fake", "forged", "deceived", "misrepresented", "pretended"],
            "anti_keywords": ["didn't pay back", "asking more", "demanding double", "refuses to return"]
        },
        "dishonest_intention": {
            "required": True,
            "description": "Intent to deceive existed FROM THE BEGINNING (mens rea at inception)",
            "keywords": ["planned to cheat", "never intended to pay", "knew it was false", "had ulterior motive"],
            "anti_keywords": ["changed mind later", "business failed", "couldn't pay", "financial difficulty"]
        },
        "property_delivery": {
            "required": True,
            "description": "Money or property was delivered BECAUSE of the deception",
            "keywords": ["gave money", "transferred", "paid", "delivered property", "handed over"],
            "anti_keywords": ["promised to give", "will pay later", "owes money"]
        }
    },
    
    # If these are present, IPC 420 DOES NOT APPLY
    "disqualifiers": [
        {
            "pattern": "breach_of_contract",
            "indicators": ["didn't pay back", "loan default", "business deal failed", "partnership dispute"],
            "reason": "Civil breach of contract, NOT criminal cheating"
        },
        {
            "pattern": "post_transaction_demand",
            "indicators": ["asking more now", "demanding double later", "changing terms after"],
            "reason": "No deception at inception - civil dispute or extortion (IPC 384)"
        },
        {
            "pattern": "simple_non_payment",
            "indicators": ["borrowed and didn't return", "took loan and vanished", "didn't pay as agreed"],
            "reason": "Civil money recovery case UNLESS deception proven at time of borrowing"
        }
    ],
    
    "punishment": "Imprisonment up to 7 years and fine",
    "bailable": False,
    "cognizable": True,
    
    "common_mistakes": [
        "Applying to simple debt/loan disputes",
        "Applying when someone asks for more money later",
        "Not checking if deception existed AT THE START",
        "Confusing civil breach with criminal cheating"
    ]
}

# ============================================
# MONEY DISPUTES - CIVIL VS CRIMINAL
# ============================================

MONEY_DISPUTE_CLASSIFICATION = {
    "criminal_cheating": {
        "domain": LegalDomain.CRIMINAL,
        "sections": ["IPC 420", "IPC 415"],
        "requirements": [
            "Deception at time of taking money",
            "False representation induced payment",
            "Dishonest intention from beginning"
        ],
        "examples": [
            "Said loan was interest-free but had secret plan to charge double",
            "Took money for investment but never intended to invest",
            "Forged documents to get money"
        ]
    },
    
    "civil_breach": {
        "domain": LegalDomain.CIVIL,
        "applicable_law": "Indian Contract Act, 1872",
        "remedy": "Civil suit for recovery",
        "requirements": [
            "Valid contract existed",
            "No deception at inception",
            "Breach occurred later"
        ],
        "examples": [
            "Borrowed money willingly, now refusing to pay",
            "Business partnership failed, money not returned",
            "Loan given with clear terms, defaulted later"
        ]
    },
    
    "extortion": {
        "domain": LegalDomain.CRIMINAL,
        "sections": ["IPC 384", "IPC 385", "IPC 503", "IPC 506"],
        "requirements": [
            "Threat or intimidation to get money",
            "Fear of injury induced payment"
        ],
        "examples": [
            "Give me ₹50,000 or I'll hurt you",
            "Demanding money by threatening reputation",
            "Asking double money with threats"
        ]
    }
}

# ============================================
# DIGITAL vs PHYSICAL ASSET RULES
# ============================================

ASSET_TYPE_RULES = {
    "digital_identity_theft": {
        "primary_sections": ["IT Act 66C", "IT Act 66D"],
        "excludes": ["IPC 379", "IPC 378", "IPC 380"],  # Physical theft sections
        "indicators": ["instagram", "facebook", "twitter", "account", "hacked", "login", "password", "otp", "username"],
        "reasoning": "Digital credentials are NOT movable property under IPC 379"
    },
    
    "physical_theft": {
        "primary_sections": ["IPC 379", "IPC 378"],
        "excludes": ["IT Act 66C", "IT Act 66D", "IT Act 43"],  # Digital sections
        "indicators": ["phone stolen", "wallet taken", "laptop missing", "bag snatched", "jewelry stolen"],
        "reasoning": "Physical movable property theft - NOT digital/cyber crime"
    }
}

# ============================================
# THREAT & INTIMIDATION RULES
# ============================================

THREAT_CLASSIFICATION = {
    "criminal_intimidation": {
        "section": "IPC 503",
        "description": "Threatening with injury to person, reputation or property",
        "punishment": "Imprisonment up to 2 years or fine or both",
        "bailable": True,
        "keywords": ["threatened", "intimidated", "warned", "scared"]
    },
    
    "punishment_for_intimidation": {
        "section": "IPC 506",
        "description": "Punishment for criminal intimidation",
        "variants": {
            "death_threat": {
                "punishment": "Imprisonment up to 7 years",
                "bailable": False,
                "keywords": ["kill", "murder", "death threat"]
            },
            "general_threat": {
                "punishment": "Imprisonment up to 2 years",
                "bailable": True,
                "keywords": ["hurt", "harm", "beat"]
            }
        }
    },
    
    "extortion": {
        "section": "IPC 384",
        "description": "Putting person in fear to deliver property",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": False,
        "requires": ["threat + demand for money/property"]
    }
}

# ============================================
# CONFIDENCE SCORING RULES
# ============================================

CONFIDENCE_RULES = {
    "high": {
        "range": (0.85, 1.0),
        "criteria": [
            "All essential elements clearly present",
            "Multiple direct indicators found",
            "No conflicting evidence",
            "Statutory requirements satisfied"
        ]
    },
    
    "moderate": {
        "range": (0.65, 0.84),
        "criteria": [
            "Most essential elements present",
            "Some ambiguity in facts",
            "Reasonable legal basis"
        ]
    },
    
    "low": {
        "range": (0.40, 0.64),
        "criteria": [
            "Partial match only",
            "Missing key elements",
            "Requires clarification"
        ]
    },
    
    "very_low": {
        "range": (0.0, 0.39),
        "criteria": [
            "Weak indicators only",
            "Essential elements missing",
            "Should not be applied"
        ]
    }
}

# ============================================
# VALIDATION FUNCTIONS
# ============================================

def validate_ipc_420(description: str, keywords_found: List[str]) -> Dict:
    """
    Validate if IPC 420 (Cheating) applies with STRICT requirements
    
    Returns:
        {
            "applies": bool,
            "confidence": float,
            "reasoning": str,
            "missing_elements": List[str],
            "alternative_sections": List[str]
        }
    """
    desc_lower = description.lower()
    
    # Check essential elements
    has_deception = any(kw in desc_lower for kw in IPC_420_RULES["essential_elements"]["deception"]["keywords"])
    has_intention = any(kw in desc_lower for kw in IPC_420_RULES["essential_elements"]["dishonest_intention"]["keywords"])
    has_delivery = any(kw in desc_lower for kw in IPC_420_RULES["essential_elements"]["property_delivery"]["keywords"])
    
    # Check disqualifiers (these BLOCK IPC 420)
    for disqualifier in IPC_420_RULES["disqualifiers"]:
        if any(indicator in desc_lower for indicator in disqualifier["indicators"]):
            return {
                "applies": False,
                "confidence": 0.0,
                "reasoning": f"IPC 420 does NOT apply: {disqualifier['reason']}",
                "missing_elements": ["deception at inception"],
                "alternative_sections": ["Civil dispute (Indian Contract Act)", "IPC 384 (if threats present)"]
            }
    
    # Check anti-keywords
    has_anti_deception = any(kw in desc_lower for kw in IPC_420_RULES["essential_elements"]["deception"]["anti_keywords"])
    has_anti_intention = any(kw in desc_lower for kw in IPC_420_RULES["essential_elements"]["dishonest_intention"]["anti_keywords"])
    
    if has_anti_deception or has_anti_intention:
        return {
            "applies": False,
            "confidence": 0.0,
            "reasoning": "No evidence of deception at inception - appears to be civil dispute",
            "missing_elements": ["deception from beginning"],
            "alternative_sections": ["Civil Recovery Suit", "IPC 406 (if entrustment)", "IPC 384 (if extortion)"]
        }
    
    # All three elements must be present
    elements_present = sum([has_deception, has_intention, has_delivery])
    
    if elements_present == 3:
        return {
            "applies": True,
            "confidence": 0.88,
            "reasoning": "All essential elements of IPC 420 present: deception, dishonest intention from start, and property delivery induced by fraud",
            "missing_elements": [],
            "alternative_sections": []
        }
    
    elif elements_present == 2:
        missing = []
        if not has_deception: missing.append("clear deception/false representation")
        if not has_intention: missing.append("dishonest intention from beginning")
        if not has_delivery: missing.append("property delivery because of fraud")
        
        return {
            "applies": False,
            "confidence": 0.35,
            "reasoning": f"IPC 420 requirements not fully met. Missing: {', '.join(missing)}",
            "missing_elements": missing,
            "alternative_sections": ["Needs more facts", "Consider civil remedies"]
        }
    
    else:
        return {
            "applies": False,
            "confidence": 0.0,
            "reasoning": "Insufficient evidence for IPC 420 - appears to be civil matter",
            "missing_elements": ["deception", "dishonest intention", "induced delivery"],
            "alternative_sections": ["Civil dispute", "Legal notice", "IPC 503/506 if threats"]
        }


def classify_money_dispute(description: str) -> Dict:
    """
    Classify money dispute as criminal cheating, civil breach, or extortion
    """
    desc_lower = description.lower()
    
    # Check for extortion indicators (threats + money demand)
    extortion_indicators = ["threatening", "or else", "demanding money", "give money or", "pay or"]
    if any(ind in desc_lower for ind in extortion_indicators):
        return {
            "classification": "extortion",
            "domain": LegalDomain.CRIMINAL,
            "primary_section": "IPC 384",
            "reasoning": "Threat-based money demand = extortion, not cheating"
        }
    
    # Check for deception at inception
    inception_deception = ["lied about", "false promise", "fake", "pretended", "forged", "deceived me"]
    if any(ind in desc_lower for ind in inception_deception):
        return {
            "classification": "criminal_cheating",
            "domain": LegalDomain.CRIMINAL,
            "primary_section": "IPC 420",
            "reasoning": "Deception at time of taking money = cheating"
        }
    
    # Default to civil if no criminal indicators
    return {
        "classification": "civil_breach",
        "domain": LegalDomain.CIVIL,
        "primary_section": "Indian Contract Act",
        "reasoning": "No deception at inception - civil money recovery"
    }


# Export all rules
__all__ = [
    'IPC_420_RULES',
    'MONEY_DISPUTE_CLASSIFICATION',
    'ASSET_TYPE_RULES',
    'THREAT_CLASSIFICATION',
    'CONFIDENCE_RULES',
    'validate_ipc_420',
    'classify_money_dispute',
    'LegalDomain'
]