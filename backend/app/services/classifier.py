import re
from app.models.shared import Classification, Severity

class CrimeClassifier:
    """Pre-classifies cases with cyber-first priority"""
    
    CRIME_PATTERNS = {
        # 🆕 CYBER CRIMES - CHECKED FIRST
        "cyber_identity_theft": {
            "keywords": ["instagram", "facebook", "twitter", "snapchat", "account", "hacked", "login", "password", "otp"],
            "category": "Cyber Crime",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 1  # 🆕 Highest priority
        },
        
        "cyber_fraud": {
            "keywords": ["online scam", "upi fraud", "phishing", "fake website", "cyber fraud"],
            "category": "Cyber Crime",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 1
        },
        
        # TRADITIONAL CRIMES - CHECKED AFTER
        "bullying_harassment": {
            "keywords": ["bully", "harass", "intimidat", "threaten", "fear", "scare"],
            "category": "Harassment/Intimidation",
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 2
        },
        
        "racism_discrimination": {
            "keywords": ["racism", "racist", "caste", "casteism", "religion", "hate", "communal"],
            "category": "Hate Speech/Discrimination",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        "theft": {
            "keywords": ["stole", "stolen", "theft", "steal", "took", "missing phone", "pickpocket"],
            "category": "Theft",  # Will be refined by keyword_matcher
            "severity": Severity.MODERATE,
            "domain": "criminal",
            "priority": 3  # Lower priority - let keyword_matcher decide cyber vs physical
        },
        
        "financial_fraud": {
            "keywords": ["fraud money", "cheated money", "scam money", "investment", "didn't pay", "loan"],
            "category": "Financial Fraud",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        "assault": {
            "keywords": ["hit", "punch", "kicked", "slapped", "beat", "assault", "attack", "hurt"],
            "category": "Assault",
            "severity": Severity.SEVERE,
            "domain": "criminal",
            "priority": 2
        },
        
        "property": {
            "keywords": ["property", "land", "house", "ownership", "boundary"],
            "category": "Property Dispute",
            "severity": Severity.MINOR,
            "domain": "civil",
            "priority": 3
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