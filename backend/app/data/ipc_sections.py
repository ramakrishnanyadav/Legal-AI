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
    
    # SEXUAL OFFENSES
    "IPC 354": {
        "code": "IPC 354",
        "title": "Assault or criminal force to woman with intent to outrage her modesty",
        "description": "Assault or use of criminal force on woman with intent to outrage her modesty",
        "punishment": "Imprisonment from 1 to 5 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "IPC 354A": {
        "code": "IPC 354A",
        "title": "Sexual harassment",
        "description": "Sexual harassment and punishment for sexual harassment - physical contact, demand for sexual favours, sexually coloured remarks, showing pornography, etc.",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": True,
        "cognizable": True,
    },
    
    "IPC 354B": {
        "code": "IPC 354B",
        "title": "Assault or use of criminal force to woman with intent to disrobe",
        "description": "Assault or criminal force with intent to disrobe a woman",
        "punishment": "Imprisonment from 3 to 7 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "IPC 354C": {
        "code": "IPC 354C",
        "title": "Voyeurism",
        "description": "Watching or capturing image of woman engaging in private act",
        "punishment": "First conviction: 1-3 years + fine. Subsequent: 3-7 years + fine",
        "bailable": True,
        "cognizable": True,
    },
    
    "IPC 354D": {
        "code": "IPC 354D",
        "title": "Stalking",
        "description": "Following woman and contacting or attempting to contact despite clear indication of disinterest",
        "punishment": "First conviction: up to 3 years + fine. Subsequent: up to 5 years + fine",
        "bailable": True,
        "cognizable": True,
    },
    
    "IPC 375": {
        "code": "IPC 375",
        "title": "Rape",
        "description": "Sexual intercourse with a woman against her will, without her consent, or with consent obtained by threat, fraud, or intoxication",
        "punishment": "Rigorous imprisonment not less than 10 years, extending to life imprisonment + fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "IPC 376": {
        "code": "IPC 376",
        "title": "Punishment for rape",
        "description": "Punishment for rape under various circumstances",
        "punishment": "Rigorous imprisonment not less than 10 years which may extend to life + fine. Death penalty in certain aggravated cases",
        "bailable": False,
        "cognizable": True,
    },
    
    # KIDNAPPING & ABDUCTION
    "IPC 363": {
        "code": "IPC 363",
        "title": "Punishment for kidnapping",
        "description": "Kidnapping - taking away or enticing any person",
        "punishment": "Imprisonment up to 7 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "IPC 365": {
        "code": "IPC 365",
        "title": "Kidnapping or abducting with intent secretly and wrongfully to confine person",
        "description": "Kidnapping with intent to secretly and wrongfully confine",
        "punishment": "Imprisonment up to 7 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    # MURDER
    "IPC 302": {
        "code": "IPC 302",
        "title": "Punishment for murder",
        "description": "Whoever commits murder shall be punished with death or life imprisonment and fine",
        "punishment": "Death or life imprisonment and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "IPC 307": {
        "code": "IPC 307",
        "title": "Attempt to murder",
        "description": "Whoever does any act with intention or knowledge that death may result",
        "punishment": "Imprisonment up to 10 years and fine. If hurt caused: life imprisonment",
        "bailable": False,
        "cognizable": True,
    },
    
    # CORRUPTION
    "IPC 171E": {
        "code": "IPC 171E",
        "title": "Punishment for bribery",
        "description": "Bribery in elections",
        "punishment": "Imprisonment up to 1 year or fine or both",
        "bailable": True,
        "cognizable": True,
    },
    
    # CRIMINAL BREACH OF TRUST
    "IPC 406": {
        "code": "IPC 406",
        "title": "Punishment for criminal breach of trust",
        "description": "Dishonest misappropriation or conversion of property entrusted",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": True,
        "cognizable": False,
    },
    
    # MISCHIEF
    "IPC 425": {
        "code": "IPC 425",
        "title": "Mischief",
        "description": "Causing wrongful loss or damage to property",
        "punishment": "Imprisonment up to 3 months or fine or both",
        "bailable": True,
        "cognizable": True,
    },
    
    "IPC 427": {
        "code": "IPC 427",
        "title": "Mischief causing damage to the amount of fifty rupees",
        "description": "Mischief and thereby causing damage",
        "punishment": "Imprisonment up to 2 years or fine or both",
        "bailable": True,
        "cognizable": True,
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
    
    "IT Act 67A": {
        "code": "IT Act 67A",
        "title": "Publishing sexually explicit material",
        "description": "Publishing or transmitting material containing sexually explicit act in electronic form",
        "punishment": "First: 5 years + ₹10L fine. Subsequent: 7 years + ₹10L fine",
        "bailable": True,
        "cognizable": True,
    },
    
    "IT Act 67B": {
        "code": "IT Act 67B",
        "title": "Publishing child pornography",
        "description": "Publishing or transmitting material depicting children in sexually explicit act",
        "punishment": "First: 5 years + ₹10L fine. Subsequent: 7 years + ₹10L fine",
        "bailable": False,
        "cognizable": True,
    },
}

# POCSO ACT SECTIONS
POCSO_SECTIONS = {
    "POCSO 3": {
        "code": "POCSO 3",
        "title": "Penetrative sexual assault",
        "description": "Penetrative sexual assault on a child (person below 18 years)",
        "punishment": "Rigorous imprisonment not less than 10 years, may extend to life + fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "POCSO 4": {
        "code": "POCSO 4",
        "title": "Punishment for penetrative sexual assault",
        "description": "Punishment for penetrative sexual assault on a child",
        "punishment": "Minimum 20 years rigorous imprisonment, may extend to life or death + fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "POCSO 5": {
        "code": "POCSO 5",
        "title": "Aggravated penetrative sexual assault",
        "description": "Aggravated penetrative sexual assault (by person in position of trust, gang assault, etc.)",
        "punishment": "Rigorous imprisonment not less than 20 years, may extend to life or death + fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "POCSO 7": {
        "code": "POCSO 7",
        "title": "Sexual assault",
        "description": "Sexual assault on a child (touching private parts, etc.)",
        "punishment": "Imprisonment not less than 3 years, may extend to 5 years + fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "POCSO 9": {
        "code": "POCSO 9",
        "title": "Aggravated sexual assault",
        "description": "Aggravated sexual assault on a child",
        "punishment": "Imprisonment not less than 5 years, may extend to 7 years + fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "POCSO 11": {
        "code": "POCSO 11",
        "title": "Sexual harassment of child",
        "description": "Sexual harassment of a child (showing pornography, stalking, etc.)",
        "punishment": "Imprisonment up to 3 years and fine",
        "bailable": True,
        "cognizable": True,
    },
    
    "POCSO 13": {
        "code": "POCSO 13",
        "title": "Use of child for pornographic purposes",
        "description": "Using a child for pornographic purposes",
        "punishment": "First: 5 years + fine up to ₹10L. Subsequent: 7 years + fine up to ₹10L",
        "bailable": False,
        "cognizable": True,
    },
    
    "POCSO 14": {
        "code": "POCSO 14",
        "title": "Punishment for using child for pornographic purposes",
        "description": "Storage of pornographic material involving child",
        "punishment": "Imprisonment up to 3 years or fine or both",
        "bailable": True,
        "cognizable": True,
    },
}

# DOMESTIC VIOLENCE ACT
DV_ACT_SECTIONS = {
    "DV Act 3": {
        "code": "DV Act 3",
        "title": "Definition of domestic violence",
        "description": "Domestic violence includes physical, sexual, verbal, emotional, and economic abuse",
        "punishment": "Civil remedy - Protection orders, residence orders, monetary relief, custody orders",
        "bailable": True,
        "cognizable": True,
    },
    
    "DV Act 12": {
        "code": "DV Act 12",
        "title": "Protection orders",
        "description": "Magistrate may pass protection order to prevent domestic violence",
        "punishment": "Breach of protection order: Imprisonment up to 1 year or fine up to ₹20,000 or both",
        "bailable": True,
        "cognizable": True,
    },
}

# SC/ST ACT (Prevention of Atrocities Act)
SCST_ACT_SECTIONS = {
    "SC/ST Act 3(1)(r)": {
        "code": "SC/ST Act 3(1)(r)",
        "title": "Intentional insult or intimidation to humiliate SC/ST member",
        "description": "Intentionally insults or intimidates with intent to humiliate a member of SC/ST in public",
        "punishment": "Imprisonment from 6 months to 5 years and fine",
        "bailable": False,
        "cognizable": True,
    },
    
    "SC/ST Act 3(1)(s)": {
        "code": "SC/ST Act 3(1)(s)",
        "title": "Abuse against SC/ST",
        "description": "Abuses any member of SC/ST by caste name in public",
        "punishment": "Imprisonment from 6 months to 5 years and fine",
        "bailable": False,
        "cognizable": True,
    },
}

# DOWRY ACT
DOWRY_ACT_SECTIONS = {
    "Dowry Act 3": {
        "code": "Dowry Prohibition Act Section 3",
        "title": "Penalty for giving or taking dowry",
        "description": "Giving or taking dowry",
        "punishment": "Imprisonment up to 5 years and fine up to ₹15,000 or dowry amount, whichever is more",
        "bailable": True,
        "cognizable": True,
    },
    
    "Dowry Act 4": {
        "code": "Dowry Prohibition Act Section 4",
        "title": "Penalty for demanding dowry",
        "description": "Demanding dowry directly or indirectly",
        "punishment": "Imprisonment from 6 months to 2 years and fine up to ₹10,000",
        "bailable": False,
        "cognizable": True,
    },
}

# HELPER FUNCTIONS
def get_section(code: str) -> Dict:
    """Get section details by code"""
    all_sections = {
        **IPC_SECTIONS, 
        **IT_ACT_SECTIONS, 
        **POCSO_SECTIONS, 
        **DV_ACT_SECTIONS,
        **SCST_ACT_SECTIONS,
        **DOWRY_ACT_SECTIONS
    }
    return all_sections.get(code, None)

def search_sections(keyword: str) -> List[Dict]:
    """Search sections by keyword"""
    results = []
    keyword_lower = keyword.lower()
    
    all_sections = {
        **IPC_SECTIONS, 
        **IT_ACT_SECTIONS, 
        **POCSO_SECTIONS, 
        **DV_ACT_SECTIONS,
        **SCST_ACT_SECTIONS,
        **DOWRY_ACT_SECTIONS
    }
    
    for code, section in all_sections.items():
        if (keyword_lower in section["title"].lower() or 
            keyword_lower in section["description"].lower()):
            results.append(section)
    
    return results

# Export all
__all__ = [
    'IPC_SECTIONS', 
    'IT_ACT_SECTIONS', 
    'POCSO_SECTIONS',
    'DV_ACT_SECTIONS',
    'SCST_ACT_SECTIONS',
    'DOWRY_ACT_SECTIONS',
    'get_section', 
    'search_sections'
]