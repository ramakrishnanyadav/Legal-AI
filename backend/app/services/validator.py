# app/services/validator.py - ENHANCED WITH STRICT IPC 420 VALIDATION

from app.models.section import LegalSection
from app.models.case import Classification
from app.data.legal_rules import (
    validate_ipc_420, 
    classify_money_dispute,
    ASSET_TYPE_RULES,
    IPC_420_RULES,
    LegalDomain
)

class SectionValidator:
    """
    Validates AI-suggested sections against strict legal rules
    NEW: IPC 420 strict validation with deception-at-inception test
    """
    
    # Digital vs Physical exclusion rules
    EXCLUSION_RULES = {
        "IT Act 66C": ["IPC 379", "IPC 378", "IPC 380"],
        "IT Act 66D": ["IPC 379", "IPC 378"],
        "IT Act 43": ["IPC 379"],
        "IPC 379": ["IT Act 66C", "IT Act 66D", "IT Act 43"],
        "IPC 378": ["IT Act 66C", "IT Act 66D", "IT Act 43"],
    }
    
    # Context detection keywords
    DIGITAL_CONTEXT = [
        "instagram", "facebook", "twitter", "snapchat", "whatsapp", 
        "account", "hacked", "login", "password", "otp", "username",
        "profile", "social media", "online", "website", "app"
    ]
    
    PHYSICAL_CONTEXT = [
        "phone stolen", "wallet stolen", "laptop stolen", "bag taken",
        "pickpocket", "grabbed", "snatched", "took from"
    ]
    
    # 🆕 IPC 420 SPECIFIC VALIDATION
    IPC_420_DISQUALIFIERS = [
        "didn't pay back", "asking more now", "demanding double", 
        "refuses to return", "loan default", "business failed",
        "partnership dispute", "didn't repay", "owes money"
    ]
    
    # Sections that require specific keywords
    SECTION_REQUIREMENTS = {
        "IPC 420": {
            "required_all": True,  # 🆕 ALL conditions must be met
            "required": ["money", "fraud", "cheated", "deceived", "false promise"],
            "blocking": IPC_420_DISQUALIFIERS,
            "description": "IPC 420 requires DECEPTION AT INCEPTION + money delivery"
        },
        "IPC 406": {
            "required": ["entrust", "property", "possession", "trust", "gave"],
            "blocking": ["bullying", "harassment", "stolen", "took without"],
            "description": "Breach of trust requires ENTRUSTMENT"
        },
        "IPC 468": {
            "required": ["document", "signature", "forge", "fake", "fabricated"],
            "blocking": ["verbal", "spoken", "said"],
            "description": "Forgery requires document manipulation"
        },
        "IPC 379": {
            "required": ["phone", "wallet", "laptop", "bag", "jewelry", "watch", "bike", "car"],
            "blocking": ["instagram", "facebook", "account", "hacked", "login", "password"],
            "description": "Theft requires MOVABLE PHYSICAL PROPERTY"
        },
        "IT Act 66C": {
            "required": ["instagram", "facebook", "account", "hacked", "login", "password", "otp"],
            "blocking": ["phone stolen", "wallet stolen", "laptop stolen"],
            "description": "Identity theft requires DIGITAL CREDENTIALS"
        }
    }
    
    def detect_asset_context(self, description: str) -> str:
        """Detect if the case involves digital or physical assets"""
        desc_lower = description.lower()
        
        digital_score = sum(1 for kw in self.DIGITAL_CONTEXT if kw in desc_lower)
        physical_score = sum(1 for kw in self.PHYSICAL_CONTEXT if kw in desc_lower)
        
        if digital_score > 0 and physical_score == 0:
            return "digital"
        elif physical_score > 0 and digital_score == 0:
            return "physical"
        elif digital_score > physical_score * 2:
            return "digital"
        elif physical_score > digital_score * 2:
            return "physical"
        else:
            return "ambiguous"
    
    def validate_ipc_420_strict(self, description: str, section: LegalSection) -> dict:
        """
        🆕 STRICT IPC 420 VALIDATION
        Uses legal_rules.py validation logic
        """
        desc_lower = description.lower()
        
        # Use the rule-based validator
        validation_result = validate_ipc_420(description, [])
        
        if not validation_result["applies"]:
            return {
                "valid": False,
                "reason": validation_result["reasoning"],
                "alternative": validation_result["alternative_sections"],
                "confidence": 0.0
            }
        
        # Additional checks for money context
        money_keywords = ["money", "rupees", "₹", "paid", "payment", "loan", "investment"]
        has_money = any(kw in desc_lower for kw in money_keywords)
        
        if not has_money:
            return {
                "valid": False,
                "reason": "IPC 420 requires financial/property element - no money mentioned",
                "alternative": ["IPC 503/506 (if threats)", "IPC 153A (if hate speech)"],
                "confidence": 0.0
            }
        
        # If passes all tests
        return {
            "valid": True,
            "reason": validation_result["reasoning"],
            "confidence": validation_result["confidence"]
        }
    
    def validate_sections(
        self, 
        description: str, 
        sections: list[LegalSection],
        classification: Classification
    ) -> dict:
        """
        Validate sections with enhanced IPC 420 checking
        """
        desc_lower = description.lower()
        valid_sections = []
        warnings = []
        removed_sections = []
        
        # STEP 1: Detect asset context
        asset_context = self.detect_asset_context(description)
        print(f"\n🔍 Asset Context Detected: {asset_context.upper()}")
        
        # STEP 2: Check for money dispute classification
        money_classification = classify_money_dispute(description)
        if money_classification["classification"] == "civil_breach":
            print(f"⚖️ Money Dispute: CIVIL (not criminal)")
        elif money_classification["classification"] == "extortion":
            print(f"⚖️ Money Dispute: EXTORTION (IPC 384)")
        
        # STEP 3: Build exclusion set
        excluded_codes = set()
        for section in sections:
            if section.code in self.EXCLUSION_RULES:
                excluded_codes.update(self.EXCLUSION_RULES[section.code])
        
        if excluded_codes:
            print(f"❌ Exclusion rules active for: {excluded_codes}")
        
        # STEP 4: Validate each section
        for section in sections:
            section_code = section.code
            
            # 🆕 SPECIAL HANDLING FOR IPC 420
            if section_code == "IPC 420":
                print(f"\n🔍 IPC 420 STRICT VALIDATION")
                ipc420_validation = self.validate_ipc_420_strict(description, section)
                
                if not ipc420_validation["valid"]:
                    warnings.append(f"❌ IPC 420 REMOVED: {ipc420_validation['reason']}")
                    removed_sections.append(f"IPC 420 (failed strict test)")
                    print(f"   ❌ IPC 420 - {ipc420_validation['reason']}")
                    
                    # Add alternative sections
                    if ipc420_validation["alternative"]:
                        warnings.append(f"   💡 Consider instead: {', '.join(ipc420_validation['alternative'])}")
                    continue
                else:
                    print(f"   ✅ IPC 420 - VALID: {ipc420_validation['reason']}")
                    section.confidence = ipc420_validation["confidence"]
            
            # Check if excluded by other sections
            if section_code in excluded_codes:
                warnings.append(f"{section_code} excluded: Conflicts with primary section")
                removed_sections.append(f"{section_code} (conflicting)")
                print(f"   ❌ {section_code} - Excluded by conflict rules")
                continue
            
            # Context-based validation
            if asset_context == "digital":
                if section_code in ["IPC 379", "IPC 378", "IPC 380"]:
                    warnings.append(f"{section_code} removed: Case involves DIGITAL assets (account/login), not physical property")
                    removed_sections.append(f"{section_code} (digital context)")
                    print(f"   ❌ {section_code} - Blocked (digital context)")
                    continue
            
            elif asset_context == "physical":
                if section_code.startswith("IT Act"):
                    warnings.append(f"{section_code} removed: Case involves PHYSICAL assets, not digital/cyber crime")
                    removed_sections.append(f"{section_code} (physical context)")
                    print(f"   ❌ {section_code} - Blocked (physical context)")
                    continue
            
            # Requirement-based validation
            if section_code in self.SECTION_REQUIREMENTS:
                rules = self.SECTION_REQUIREMENTS[section_code]
                
                # Check blocking keywords (these override everything)
                has_blocker = any(kw in desc_lower for kw in rules["blocking"])
                if has_blocker:
                    blocker_found = [kw for kw in rules["blocking"] if kw in desc_lower][0]
                    warnings.append(f"{section_code} removed: {rules['description']}. Found '{blocker_found}' which doesn't match this section")
                    removed_sections.append(f"{section_code} (blocker: {blocker_found})")
                    print(f"   ❌ {section_code} - Blocked by keyword '{blocker_found}'")
                    continue
                
                # Check required keywords
                has_required = any(kw in desc_lower for kw in rules["required"])
                
                # 🆕 For IPC 420, check if ALL required keywords needed
                if rules.get("required_all") and section_code == "IPC 420":
                    # Already validated above with strict test
                    pass
                elif not has_required:
                    warnings.append(f"{section_code}: Low confidence - {rules['description']}. Missing typical indicators")
                    section.confidence *= 0.4
                    print(f"   ⚠️ {section_code} - Confidence reduced (missing requirements)")
            
            # Only include sections with confidence > 0.3
            if section.confidence > 0.3:
                valid_sections.append(section)
                print(f"   ✅ {section_code} - Valid (confidence: {section.confidence:.2f})")
            else:
                warnings.append(f"{section_code} removed: Confidence too low ({section.confidence:.2f})")
                removed_sections.append(f"{section_code} (low confidence)")
                print(f"   ❌ {section_code} - Confidence too low ({section.confidence:.2f})")
        
        # STEP 5: Sort by confidence
        valid_sections.sort(key=lambda s: s.confidence, reverse=True)
        
        # Calculate overall confidence
        if valid_sections:
            overall_conf = sum(s.confidence for s in valid_sections) / len(valid_sections)
        else:
            overall_conf = 0.0
        
        # STEP 6: Generate detailed summary
        if removed_sections:
            print(f"\n📊 Validation Summary:")
            print(f"   Valid: {len(valid_sections)}")
            print(f"   Removed: {len(removed_sections)}")
            print(f"   Removed sections: {', '.join(removed_sections)}")
        
        return {
            "valid_sections": valid_sections,
            "warnings": warnings,
            "overall_confidence": overall_conf,
            "needs_review": overall_conf < 0.5 or len(valid_sections) == 0,
            "asset_context": asset_context,
            "removed_count": len(removed_sections),
            "money_classification": money_classification  # 🆕 Include money dispute type
        }