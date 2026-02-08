import re
from app.models.shared import Classification, Severity

class CrimeClassifier:
    """Pre-classifies cases with cyber-first priority"""
    
    CRIME_PATTERNS = {
        # 🚨 PRIORITY 1: SERIOUS CRIMES AGAINST CHILDREN & WOMEN
        "pocso_child_abuse": {
            "keywords": ["child", "minor", "underage", "teenager", "kid", "sexual", "molest", "abuse", "touch", "inappropriate"],
            "category": "POCSO/Child Sexual Abuse",
            "severity": Severity.CRITICAL,
            "domain": "criminal",
            "priority": 1
        },
        
        "rape_sexual_assault": {
            "keywords": ["rape", "raped", "sexual assault", "forced sex", "non-consensual", "sexual violence"],
            "category": "Sexual Assault/Rape",
            "severity": Severity.CRITICAL,
            "domain": "criminal",
            "priority": 1
        },
        
        "domestic_violence": {
            "keywords": ["domestic violence", "husband beat", "wife beat", "dowry", "marital", "family violence", "spouse"],
            "category": "Domestic Violence",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 1
        },
        
        "eve_teasing_sexual_harassment": {
            "keywords": ["eve teasing", "sexual harassment", "molest", "grope", "inappropriate touch", "stalking", "following me"],
            "category": "Sexual Harassment",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 1
        },
        
        # 🚨 PRIORITY 1: CYBER CRIMES
        "cyber_identity_theft": {
            "keywords": ["instagram", "facebook", "twitter", "snapchat", "whatsapp", "account", "hacked", "login", "password", "otp", "social media"],
            "category": "Cyber Crime",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 1
        },
        
        "cyber_blackmail": {
            "keywords": ["blackmail", "extortion", "leak", "photos", "video", "intimate", "morphed", "deepfake", "nude"],
            "category": "Cyber Crime/Blackmail",
            "severity": Severity.CRITICAL,
            "domain": "criminal",
            "priority": 1
        },
        
        "cyber_fraud": {
            "keywords": ["online scam", "upi fraud", "phishing", "fake website", "cyber fraud", "digital payment", "bank fraud", "credit card"],
            "category": "Cyber Crime",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 1
        },
        
        "cyberbullying": {
            "keywords": ["cyberbullying", "online harassment", "trolling", "abusive messages", "online threat"],
            "category": "Cyber Crime/Harassment",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 1
        },
        
        # 🚨 PRIORITY 2: CORRUPTION & BRIBERY
        "bribery_corruption": {
            "keywords": ["bribe", "bribery", "corruption", "illegal payment", "under table", "demanded money", "official", "government"],
            "category": "Corruption/Bribery",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        "police_misconduct": {
            "keywords": ["police refuse", "fir refused", "police torture", "false case", "police harassment", "illegal detention", "fake encounter"],
            "category": "Police Misconduct",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        # 🚨 PRIORITY 2: SERIOUS VIOLENT CRIMES
        "murder_attempt": {
            "keywords": ["murder", "kill", "attempted murder", "death threat", "life threat", "weapon"],
            "category": "Murder/Attempt to Murder",
            "severity": Severity.CRITICAL,
            "domain": "criminal",
            "priority": 2
        },
        
        "kidnapping_abduction": {
            "keywords": ["kidnap", "abduct", "missing person", "taken away", "forcibly", "ransom"],
            "category": "Kidnapping/Abduction",
            "severity": Severity.CRITICAL,
            "domain": "criminal",
            "priority": 2
        },
        
        "assault": {
            "keywords": ["hit", "punch", "kicked", "slapped", "beat", "assault", "attack", "hurt", "injured", "violence"],
            "category": "Assault",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        # 🚨 PRIORITY 2: HATE CRIMES & DISCRIMINATION
        "hate_speech_discrimination": {
            "keywords": ["racism", "racist", "caste", "casteism", "religion", "hate", "communal", "discrimination", "sc/st", "dalit"],
            "category": "Hate Speech/Discrimination",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        # 🚨 PRIORITY 3: FINANCIAL CRIMES
        "cheating_fraud": {
            "keywords": ["fraud money", "cheated money", "scam money", "investment fraud", "ponzi", "mlm scam"],
            "category": "Financial Fraud",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 3
        },
        
        "loan_recovery_harassment": {
            "keywords": ["loan", "recovery agent", "harassment", "didn't pay", "debt", "emi", "lender"],
            "category": "Financial Dispute/Harassment",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 3
        },
        
        # 🚨 PRIORITY 3: PROPERTY CRIMES
        "theft": {
            "keywords": ["stole", "stolen", "theft", "steal", "took", "missing phone", "pickpocket", "burglary", "robbery"],
            "category": "Theft",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 3
        },
        
        "property_damage": {
            "keywords": ["damaged", "vandalism", "broke", "destroyed", "property damage", "mischief"],
            "category": "Property Damage",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 3
        },
        
        # 🚨 PRIORITY 3: THREATS & INTIMIDATION
        "criminal_intimidation": {
            "keywords": ["threaten", "intimidat", "fear", "scare", "warning", "consequence"],
            "category": "Harassment/Intimidation",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 3
        },
        
        # 🚨 PRIORITY 4: CONSUMER & ENVIRONMENTAL
        "consumer_fraud": {
            "keywords": ["defective product", "wrong delivery", "fake product", "consumer", "refund", "warranty"],
            "category": "Consumer Complaint",
            "severity": Severity.MINOR,
            "domain": "civil",
            "priority": 4
        },
        
        "environmental_violation": {
            "keywords": ["pollution", "environmental", "illegal construction", "noise", "dumping", "tree cutting"],
            "category": "Environmental Violation",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 4
        },
        
        # 🚨 PRIORITY 4: DEFAMATION & PRIVACY
        "defamation": {
            "keywords": ["defamation", "false allegations", "reputation", "character assassination", "slander", "libel"],
            "category": "Defamation",
            "severity": Severity.MINOR,
            "domain": "criminal",
            "priority": 4
        },
        
        # 🚨 PRIORITY 5: CIVIL DISPUTES
        "property_dispute": {
            "keywords": ["property", "land", "house", "ownership", "boundary", "disputed"],
            "category": "Property Dispute",
            "severity": Severity.MINOR,
            "domain": "civil",
            "priority": 5
        },
        
        "contract_breach": {
            "keywords": ["contract", "agreement", "breach", "violated terms", "business dispute"],
            "category": "Contract Dispute",
            "severity": Severity.MINOR,
            "domain": "civil",
            "priority": 5
        }
    }
    
    def classify_case(self, description: str) -> Classification:
        """Classify case with priority system"""
        desc_lower = description.lower()
        matches = []
        all_keywords_found = []
        
        for pattern_name, pattern_data in self.CRIME_PATTERNS.items():
            matched_keywords = [kw for kw in pattern_data["keywords"] if kw in desc_lower]
            
            if matched_keywords:
                match_strength = len(matched_keywords) / len(pattern_data["keywords"])
                matches.append({
                    "pattern": pattern_name,
                    "data": pattern_data,
                    "strength": match_strength,
                    "keywords": matched_keywords,
                    "priority": pattern_data.get("priority", 3)  # 🆕
                })
                all_keywords_found.extend(matched_keywords)
        
        if not matches:
            return Classification(
                category="General/Other",
                severity=Severity.MINOR,
                domain="criminal",
                keywords_found=[],
                confidence=0.3
            )
        
        # 🆕 Sort by priority first, then strength
        matches.sort(key=lambda x: (x["priority"], -x["strength"]))
        best_match = matches[0]
        
        return Classification(
            category=best_match["data"]["category"],
            severity=best_match["data"]["severity"],
            domain=best_match["data"]["domain"],
            keywords_found=list(set(all_keywords_found)),
            confidence=min(0.95, best_match["strength"] + 0.5)
        )