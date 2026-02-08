from app.models.section import LegalSection
from app.models.case import Classification

class KeywordMatcher:
    """Enhanced keyword matcher with digital asset detection"""
    
    SECTION_MAPPINGS = {
        # 🆕 CYBER IDENTITY THEFT - HIGHEST PRIORITY
        "cyber_identity_theft": [
            {
                "code": "IT Act 66C",
                "title": "Identity Theft (Punishment for Identity Theft)",
                "description": "Fraudulently using electronic signature, password or unique identification of another person",
                "punishment": "Imprisonment up to 3 years and fine up to ₹1 lakh",
                "bailable": True,
                "cognizable": True,
                "confidence": 0.92,  # 92%
                "keywords": ["instagram", "facebook", "twitter", "account", "hacked", "login", "password", "otp", "username", "profile"],
                "asset_type": "digital_identity",
                "priority": 1
            },
            {
                "code": "IT Act 66D",
                "title": "Cheating by Personation (Using Computer Resource)",
                "description": "Cheating by personation using computer resource or communication device",
                "punishment": "Imprisonment up to 3 years and fine up to ₹1 lakh",
                "bailable": True,
                "cognizable": True,
                "confidence": 0.85,
                "keywords": ["impersonat", "fake post", "pretend", "posted as me", "messaging as me"],
                "asset_type": "digital_identity",
                "priority": 1
            },
            {
                "code": "IT Act 43",
                "title": "Penalty for Damage to Computer System",
                "description": "Unauthorized access, download, extraction or damage to computer resource",
                "punishment": "Civil liability up to ₹1 crore",
                "bailable": True,
                "cognizable": False,
                "confidence": 0.75,
                "keywords": ["unauthorized access", "breach", "hacked into"],
                "asset_type": "digital_access",
                "priority": 2
            }
        ],
        
        # BULLYING/HARASSMENT
        "bullying_harassment": [
            {
                "code": "IPC 503",
                "title": "Criminal Intimidation",
                "description": "Threatening someone with injury to person, reputation or property",
                "punishment": "Imprisonment up to 2 years or fine or both",
                "bailable": True,
                "cognizable": True,
                "confidence": 0.80,
                "keywords": ["intimidat", "threaten", "fear", "scare"],
                "asset_type": "personal",
                "priority": 2
            },
            {
                "code": "IPC 506",
                "title": "Punishment for criminal intimidation",
                "description": "Threat to cause death or grievous hurt",
                "punishment": "Imprisonment up to 7 years or fine or both",
                "bailable": False,
                "cognizable": True,
                "confidence": 0.75,
                "keywords": ["death threat", "kill", "murder"],
                "asset_type": "personal",
                "priority": 2
            }
        ],
        
        # RACISM/DISCRIMINATION
        "racism_discrimination": [
            {
                "code": "IPC 153A",
                "title": "Promoting enmity between groups",
                "description": "Promoting enmity on grounds of religion, race, place of birth, residence, language etc",
                "punishment": "Imprisonment up to 3 years or fine or both",
                "bailable": False,
                "cognizable": True,
                "confidence": 0.85,
                "keywords": ["racism", "caste", "religion", "hate", "communal"],
                "asset_type": "social",
                "priority": 2
            }
        ],
        
        # PHYSICAL THEFT (NOT FOR DIGITAL)
        "physical_theft": [
            {
                "code": "IPC 379",
                "title": "Theft",
                "description": "Dishonestly taking movable PHYSICAL property out of possession without consent",
                "punishment": "Imprisonment up to 3 years or fine or both",
                "bailable": True,
                "cognizable": True,
                "confidence": 0.90,
                "keywords": ["stole phone", "stole wallet", "stole laptop", "stole bag", "theft", "pickpocket", "stolen jewelry"],
                "asset_type": "physical_property",
                "exclusion_keywords": ["instagram", "facebook", "twitter", "account", "hacked", "login", "password", "online"],
                "priority": 3
            }
        ],
        
        # ASSAULT
        "assault": [
            {
                "code": "IPC 323",
                "title": "Voluntarily causing hurt",
                "description": "Causing bodily pain, disease or infirmity",
                "punishment": "Imprisonment up to 1 year or fine up to ₹1000 or both",
                "bailable": True,
                "cognizable": True,
                "confidence": 0.85,
                "keywords": ["hit", "punch", "slap", "hurt", "beat", "kicked"],
                "asset_type": "physical",
                "priority": 2
            },
            {
                "code": "IPC 325",
                "title": "Voluntarily causing grievous hurt",
                "description": "Causing serious injury like fracture, permanent disfiguration",
                "punishment": "Imprisonment up to 7 years and fine",
                "bailable": False,
                "cognizable": True,
                "confidence": 0.75,
                "keywords": ["serious injury", "fracture", "grievous", "broken bone"],
                "asset_type": "physical",
                "priority": 2
            }
        ],
        
        # FINANCIAL FRAUD (ONLY FOR MONEY)
        "financial_fraud": [
            {
                "code": "IPC 420",
                "title": "Cheating and dishonestly inducing delivery of property",
                "description": "Deceiving someone to deliver MONEY or PROPERTY through fraud",
                "punishment": "Imprisonment up to 7 years and fine",
                "bailable": False,
                "cognizable": True,
                "confidence": 0.85,
                "keywords": ["fraud money", "cheated money", "scam money", "investment fraud", "paid and didn't deliver", "fake investment"],
                "asset_type": "financial",
                "exclusion_keywords": ["instagram", "facebook", "account", "hacked"],
                "priority": 2
            }
        ]
    }
    
    # Asset type detection
    ASSET_INDICATORS = {
        "digital_identity": ["instagram", "facebook", "twitter", "snapchat", "account", "profile", "username", "login", "password", "otp", "hacked"],
        "digital_data": ["data", "files", "documents", "photos", "videos"],
        "physical_property": ["phone", "wallet", "laptop", "bag", "watch", "jewelry", "car", "bike"],
        "financial": ["money", "rupees", "₹", "payment", "paid", "invest", "loan", "bank"]
    }
    
    def detect_asset_type(self, description: str) -> str:
        """Detect primary asset type from description"""
        desc_lower = description.lower()
        
        scores = {asset_type: 0 for asset_type in self.ASSET_INDICATORS}
        
        for asset_type, indicators in self.ASSET_INDICATORS.items():
            for indicator in indicators:
                if indicator in desc_lower:
                    scores[asset_type] += 1
        
        max_score = max(scores.values())
        if max_score == 0:
            return "unknown"
        
        return max(scores, key=scores.get)
    
    def match_sections(self, description: str, classification: Classification) -> list[LegalSection]:
        """Match sections with asset-aware logic"""
        desc_lower = description.lower()
        
        # STEP 1: Detect asset type
        asset_type = self.detect_asset_type(description)
        print(f"\n🔍 KeywordMatcher - Detected asset type: {asset_type}")
        
        # STEP 2: Category mapping
        category_map = {
            "Harassment/Intimidation": ["bullying_harassment"],
            "Hate Speech/Discrimination": ["racism_discrimination"],
            "Theft": ["cyber_identity_theft", "physical_theft"],  # Check cyber FIRST
            "Cyber Crime": ["cyber_identity_theft"],
            "Assault": ["assault"],
            "Financial Fraud": ["financial_fraud"]
        }
        
        potential_categories = category_map.get(classification.category, [])
        if not potential_categories:
            print(f"⚠️ No mapping for category: {classification.category}")
            # For General/Other, try to match against all categories
            if classification.category in ["General/Other", "General"]:
                print(f"   Trying broad keyword search across all categories...")
                for cat_name, patterns in self.category_patterns.items():
                    for pattern in patterns:
                        if re.search(pattern, desc_lower):
                            print(f"   Found match in {cat_name} category")
                            potential_categories.append(category_map.get(cat_name, [])[0] if category_map.get(cat_name) else None)
                            break
                # Remove None values
                potential_categories = [c for c in potential_categories if c]
            
            if not potential_categories:
                print(f"   No categories found even after broad search")
                return []
        
        # STEP 3: Force cyber sections first if digital context
        if asset_type == "digital_identity":
            potential_categories = ["cyber_identity_theft"] + [c for c in potential_categories if c != "cyber_identity_theft"]
            print(f"🌐 Digital context detected - prioritizing cyber sections")
        
        sections = []
        
        for mapping_key in potential_categories:
            if mapping_key not in self.SECTION_MAPPINGS:
                continue
            
            for section_data in self.SECTION_MAPPINGS[mapping_key]:
                # Check exclusion keywords FIRST
                exclusion_keywords = section_data.get("exclusion_keywords", [])
                if any(ex_kw in desc_lower for ex_kw in exclusion_keywords):
                    print(f"❌ Excluding {section_data['code']} due to: {[kw for kw in exclusion_keywords if kw in desc_lower]}")
                    continue
                
                # Check if keywords match
                keyword_match = any(kw in desc_lower for kw in section_data["keywords"])
                
                if not keyword_match:
                    continue
                
                # Asset type validation
                section_asset_type = section_data.get("asset_type", "unknown")
                confidence = section_data["confidence"]
                
                # Boost confidence for matching asset types
                if asset_type == section_asset_type:
                    confidence = min(0.95, confidence + 0.05)
                    print(f"✅ {section_data['code']} - Asset type match bonus: {confidence:.2f}")
                
                matched_kws = [kw for kw in section_data["keywords"] if kw in desc_lower]
                
                sections.append(LegalSection(
                    code=section_data["code"],
                    title=section_data["title"],
                    description=section_data["description"],
                    punishment=section_data["punishment"],
                    bailable=section_data["bailable"],
                    cognizable=section_data["cognizable"],
                    confidence=confidence,
                    reasoning=f"Matched {asset_type} context with keywords: {', '.join(matched_kws[:3])}",
                    key_factors=matched_kws[:5]
                ))
                
                print(f"✅ Added {section_data['code']}: {section_data['title']} ({confidence:.0%})")
        
        # STEP 4: Sort by confidence
        sections.sort(key=lambda s: s.confidence, reverse=True)
        
        print(f"\n📊 Total sections matched: {len(sections)}")
        
        return sections[:5]