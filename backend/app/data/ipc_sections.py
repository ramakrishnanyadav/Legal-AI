# app/data/ipc_sections.py - Indian Penal Code Sections Database

"""
Complete database of commonly used IPC sections
with legal requirements and conditions
"""

from typing import Dict, List

IPC_SECTIONS = {
    # CHEATING & FRAUD
    "IPC 420": {
        "code": "IPC 420",
        "title": "Cheating and dishonestly inducing delivery of property",
        "description": "Cheating and thereby dishonestly inducing delivery of property or valuable security",
        "punishment": "Imprisonment up to 7 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    # THEFT
    "IPC 379": {
        "code": "IPC 379",
        "title": "Punishment for theft",
        "description": "Punishment for theft - dishonestly taking movable property",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": True,
        "cognizable": True,
    },
    
    # EXTORTION
    "IPC 384": {
        "code": "IPC 384",
        "title": "Punishment for extortion",
        "description": "Whoever commits extortion shall be punished",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": False,
        "cognizable": True,
    },
    
    # THREATS
    "IPC 503": {
        "code": "IPC 503",
        "title": "Criminal intimidation",
        "description": "Whoever threatens another with injury to his person, reputation or property",
        "punishment": "Imprisonment up to 2 years or fine or both",
        "bailable": True,
        "cognizable": True,
    },
    
    "IPC 506": {
        "code": "IPC 506",
        "title": "Punishment for criminal intimidation",
        "description": "Punishment for criminal intimidation",
        "punishment": "If threat is of death or grievous hurt: 7 years. Otherwise: 2 years",
        "bailable": False,
        "cognizable": True,
    },
    
    # ASSAULT
    "IPC 323": {
        "code": "IPC 323",
        "title": "Punishment for voluntarily causing hurt",
        "description": "Whoever voluntarily causes hurt shall be punished",
        "punishment": "Imprisonment up to 1 year or fine up to ₹1000 or both",
        "bailable": True,
        "cognizable": True,
    },
    
    "IPC 325": {
        "code": "IPC 325",
        "title": "Punishment for voluntarily causing grievous hurt",
        "description": "Whoever voluntarily causes grievous hurt",
        "punishment": "Imprisonment up to 7 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    # HATE SPEECH
    "IPC 153A": {
        "code": "IPC 153A",
        "title": "Promoting enmity between different groups",
        "description": "Promoting enmity on grounds of religion, race, place of birth, residence, language, caste",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": False,
        "cognizable": True,
    },
    
    # DEFAMATION
    "IPC 500": {
        "code": "IPC 500",
        "title": "Punishment for defamation",
        "description": "Punishment for defamation",
        "punishment": "Simple imprisonment up to 2 years or fine or both",
        "bailable": True,
        "cognizable": False,
    },
}

# IT ACT SECTIONS
IT_ACT_SECTIONS = {
    "IT Act 43": {
        "code": "IT Act 43",
        "title": "Penalty for damage to computer, computer system, etc.",
        "description": "Unauthorized access, download, extraction, or damage to computer resource",
        "punishment": "Compensation up to ₹1 crore (Civil liability)",
        "bailable": True,
        "cognizable": False,
    },
    
    "IT Act 66C": {
        "code": "IT Act 66C",
        "title": "Identity Theft (Punishment for Identity Theft)",
        "description": "Fraudulently using electronic signature, password or unique identification of another person",
        "punishment": "Imprisonment up to 3 years and fine up to ₹1 lakh",
        "bailable": True,
        "cognizable": True,
    },
    
    "IT Act 66D": {
        "code": "IT Act 66D",
        "title": "Cheating by personation using computer resource",
        "description": "Cheating by personation by using computer resource or communication device",
        "punishment": "Imprisonment up to 3 years and fine up to ₹1 lakh",
        "bailable": True,
        "cognizable": True,
    },
    
    "IT Act 66E": {
        "code": "IT Act 66E",
        "title": "Punishment for violation of privacy",
        "description": "Intentional capture, publish or transmit images of private area without consent",
        "punishment": "Imprisonment up to 3 years or fine up to ₹2 lakhs or both",
        "bailable": True,
        "cognizable": True,
    },
    
    "IT Act 67": {
        "code": "IT Act 67",
        "title": "Publishing obscene material in electronic form",
        "description": "Publishing or transmitting obscene material in electronic form",
        "punishment": "First: 3 years + ₹5L fine. Subsequent: 5 years + ₹10L fine",
        "bailable": True,
        "cognizable": True,
    },
}

# HELPER FUNCTIONS
def get_section(code: str) -> Dict:
    """Get section details by code"""
    if code in IPC_SECTIONS:
        return IPC_SECTIONS[code]
    elif code in IT_ACT_SECTIONS:
        return IT_ACT_SECTIONS[code]
    return None

def search_sections(keyword: str) -> List[Dict]:
    """Search sections by keyword"""
    results = []
    keyword_lower = keyword.lower()
    
    for code, section in {**IPC_SECTIONS, **IT_ACT_SECTIONS}.items():
        if (keyword_lower in section["title"].lower() or 
            keyword_lower in section["description"].lower()):
            results.append(section)
    
    return results

# Export all
__all__ = ['IPC_SECTIONS', 'IT_ACT_SECTIONS', 'get_section', 'search_sections']