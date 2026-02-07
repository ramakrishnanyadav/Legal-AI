# app/routers/analyze.py - FIXED WITH COMPLETE SECTION MODEL

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, validator
from typing import List, Optional, Dict
from datetime import datetime
import logging

# IMPORT YOUR SERVICES
from app.services.classifier import CrimeClassifier
from app.services.keyword_matcher import KeywordMatcher
from app.services.hybrid_analyzer import MultiProviderAnalyzer
from app.services.action_plan_generator import ActionPlanGenerator
from app.services.document_generator import DocumentGenerator
from app.models.section import LegalSection

router = APIRouter()
logger = logging.getLogger(__name__)

# INITIALIZE SERVICES
classifier = CrimeClassifier()
keyword_matcher = KeywordMatcher()
hybrid_analyzer = MultiProviderAnalyzer()
action_plan_generator = ActionPlanGenerator()
document_generator = DocumentGenerator()

# ============================================
# REQUEST/RESPONSE MODELS - FIXED
# ============================================

class AnalyzeCaseRequest(BaseModel):
    description: str
    role: str = "victim"
    caseType: Optional[str] = None
    urgency: bool = False
    user_id: Optional[str] = None
    is_authenticated: bool = False
    
    @validator('description')
    def validate_description(cls, v):
        if not v or not v.strip():
            raise ValueError('Description cannot be empty')
        if len(v.strip()) < 3:
            raise ValueError('Description too short')
        return v.strip()

class Section(BaseModel):
    """COMPLETE Section model with all fields from LegalSection"""
    code: str
    name: str
    description: str
    punishment: str          # 🆕 ADDED
    bailable: bool           # 🆕 ADDED
    cognizable: bool         # 🆕 ADDED
    confidence: int          # 0-100
    isPrimary: bool
    reasoning: str
    matchedKeywords: List[str]
    
    @validator('confidence')
    def validate_confidence(cls, v):
        if v < 1:
            return int(v * 100)
        return max(0, min(100, int(v)))

class AnalyzeCaseResponse(BaseModel):
    sections: List[Section]
    severity: str
    maxPunishment: str
    punishmentNote: str
    bail: str
    bailProbability: int
    overallConfidence: int
    summary: str
    nextSteps: List[str]
    actionPlan: Optional[Dict] = None
    documents: Optional[Dict] = None
    
    @validator('bailProbability', 'overallConfidence')
    def validate_percentages(cls, v):
        if v < 1:
            return int(v * 100)
        return max(0, min(100, int(v)))

# ============================================
# HELPER FUNCTIONS
# ============================================

def determine_severity(sections: List[LegalSection]) -> str:
    """Determine severity from sections"""
    if not sections:
        return "Unknown"
    
    primary = sections[0]
    punishment = primary.punishment.lower()
    
    if "life" in punishment or "10 years" in punishment:
        return "Very High"
    elif "7 years" in punishment:
        return "High"
    elif "3 years" in punishment or "5 years" in punishment:
        return "Moderate"
    return "Low to Moderate"

def generate_summary(description: str, sections: List[LegalSection], classification) -> str:
    """Generate case summary"""
    if not sections:
        return "This situation requires professional legal consultation."
    
    primary = sections[0]
    category = classification.category
    
    summaries = {
        "Cyber Crime": f"This is a cyber crime case. Primary applicable section: {primary.code} - {primary.title}",
        "Harassment/Intimidation": f"This is a case of criminal intimidation. Primary section: {primary.code} - {primary.title}",
        "Theft": f"This is a theft case. Primary section: {primary.code} - {primary.title}",
        "Financial Fraud": f"This is a financial fraud case. Primary section: {primary.code} - {primary.title}",
        "Assault": f"This is an assault case. Primary section: {primary.code} - {primary.title}",
    }
    
    return summaries.get(category, f"Primary applicable section: {primary.code} - {primary.title}")

def generate_next_steps(sections: List[LegalSection], classification) -> List[str]:
    """Generate next steps based on case type"""
    common = [
        "Document all evidence (messages, emails, photos, receipts)",
        "Write a detailed timeline with dates and times",
        "Do not delete any communication or evidence",
    ]
    
    # Cyber crime specific
    if any("IT Act" in s.code for s in sections):
        common.extend([
            "File complaint with Cyber Crime Cell",
            "Take screenshots of all digital evidence",
            "Report to relevant platform (Instagram/Facebook/etc)",
            "Preserve all chat logs and communications"
        ])
    # Physical crime specific
    elif any("IPC" in s.code for s in sections):
        common.extend([
            "File FIR at nearest police station",
            "Consult a criminal lawyer immediately",
            "Gather witness statements if available"
        ])
    
    # Non-bailable offense warning
    if any(not s.bailable for s in sections):
        common.append("⚠️ Note: This includes non-bailable offenses - seek legal counsel immediately")
    
    return common

# 🆕 NEW: Generate civil dispute response
def generate_civil_dispute_response(validation_result: dict, description: str) -> AnalyzeCaseResponse:
    """
    Generate response for civil disputes (non-criminal matters)
    """
    money_classification = validation_result.get("money_classification", {})
    warnings = validation_result.get("warnings", [])
    
    # Extract the main reason from warnings
    main_reason = "This appears to be a civil dispute, not a criminal matter."
    alternatives = []
    
    for warning in warnings:
        if warning and isinstance(warning, str):
            if "IPC 420" in warning and "REMOVED" in warning:
                # Extract the reason
                if ":" in warning:
                    main_reason = warning.split(":", 1)[1].strip()
            elif "Consider instead" in warning:
                # Extract alternatives
                if ":" in warning:
                    alt_text = warning.split(":", 1)[1].strip()
                    alternatives = [a.strip() for a in alt_text.split(",")]
            elif not alternatives and len(warning) > 20:
                # Use first substantial warning as main reason
                main_reason = warning
    
    # Determine if it's civil breach or extortion
    classification_type = money_classification.get("classification", "civil_breach")
    
    if classification_type == "civil_breach" or classification_type == "insufficient":
        return AnalyzeCaseResponse(
            sections=[
                Section(
                    code="Civil Dispute",
                    name="Contract Breach / Money Recovery",
                    description="This is a civil matter under the Indian Contract Act, 1872, not a criminal offense",
                    punishment="Civil remedies: Court can order money recovery with interest",  # 🆕
                    bailable=True,      # 🆕 Not applicable but set to True
                    cognizable=False,   # 🆕 Not applicable
                    confidence=85,
                    isPrimary=True,
                    reasoning=main_reason,
                    matchedKeywords=["loan", "money", "payment", "breach"]
                )
            ],
            severity="Civil Matter (Not Criminal)",
            maxPunishment="Civil remedies: Court can order money recovery with interest",
            punishmentNote="⚠️ This is NOT a criminal case. Police cannot help with civil money disputes. You need to file a civil suit.",
            bail="Not Applicable (Civil Case)",
            bailProbability=0,
            overallConfidence=85,
            summary=f"⚖️ CIVIL DISPUTE - NOT CRIMINAL\n\n{main_reason}\n\nThis requires filing a civil lawsuit for money recovery, NOT a criminal complaint. Police will likely reject an FIR for this matter.",
            nextSteps=[
                "📋 Gather all documents: loan agreement, payment records, WhatsApp messages, bank statements",
                "✍️ Send legal notice for money recovery (mandatory before filing suit in most cases)",
                "⚖️ File civil suit in appropriate court based on amount:",
                "   • Under ₹20 lakhs: Small Causes Court / Civil Judge",
                "   • Above ₹20 lakhs: District Court",
                "👨‍⚖️ Consult a civil lawyer specializing in money recovery cases",
                "📝 Prepare detailed timeline of all transactions with exact dates",
                "⏰ Act within limitation period (3 years from date payment was due)",
                "❌ DO NOT file FIR - Police will reject criminal complaints for civil money disputes",
                "💡 Consider mediation/settlement before going to court to save time and costs"
            ]
        )
    
    elif classification_type == "extortion":
        # If there ARE threats, it could be IPC 384
        return AnalyzeCaseResponse(
            sections=[
                Section(
                    code="IPC 384",
                    name="Extortion",
                    description="Putting person in fear of injury to induce delivery of property",
                    punishment="Imprisonment up to 3 years and/or fine",  # 🆕
                    bailable=True,      # 🆕
                    cognizable=True,    # 🆕
                    confidence=80,
                    isPrimary=True,
                    reasoning="Money demand coupled with threats = extortion",
                    matchedKeywords=["threatening", "money", "demand", "fear"]
                ),
                Section(
                    code="IPC 503",
                    name="Criminal Intimidation",
                    description="Threatening with injury to person, reputation or property",
                    punishment="Imprisonment up to 2 years or fine or both",  # 🆕
                    bailable=True,      # 🆕
                    cognizable=True,    # 🆕
                    confidence=75,
                    isPrimary=False,
                    reasoning="Threats made to induce payment",
                    matchedKeywords=["threatening", "intimidation"]
                )
            ],
            severity="Moderate to High",
            maxPunishment="IPC 384: Up to 3 years imprisonment and/or fine",
            punishmentNote="Extortion is a criminal offense. File FIR immediately.",
            bail="Bailable",
            bailProbability=70,
            overallConfidence=80,
            summary="🚨 CRIMINAL EXTORTION\n\nThis involves threats to obtain money, which is punishable under IPC 384 (Extortion) and IPC 503 (Criminal Intimidation).",
            nextSteps=[
                "🚓 File FIR immediately at nearest police station",
                "📱 Save all threatening messages/calls as evidence",
                "📝 Document exact threats made with dates and times",
                "👨‍⚖️ Consult a criminal lawyer immediately",
                "🎙️ If possible, record future threatening calls (with lawyer's advice)",
                "👥 Get witness statements if threats were made in presence of others",
                "⚠️ Do NOT comply with extortion demands",
                "🔒 Ensure your personal safety - inform police if threats escalate"
            ]
        )
    
    # Fallback for unclear cases
    return AnalyzeCaseResponse(
        sections=[
            Section(
                code="Assessment Needed",
                name="Legal Review Required",
                description="Further assessment needed to determine criminal vs civil nature",
                punishment="To be determined after legal review",  # 🆕
                bailable=True,      # 🆕
                cognizable=False,   # 🆕
                confidence=50,
                isPrimary=True,
                reasoning="Case details require professional legal review",
                matchedKeywords=[]
            )
        ],
        severity="Requires Assessment",
        maxPunishment="To be determined after legal review",
        punishmentNote="Consult a lawyer to determine if this is criminal or civil",
        bail="To be determined",
        bailProbability=50,
        overallConfidence=50,
        summary="Your case requires professional legal assessment to determine whether it's criminal or civil in nature.",
        nextSteps=[
            "Document all evidence chronologically",
            "Consult with a qualified lawyer",
            "Get written legal opinion on case type",
            "Prepare detailed statement of events"
        ]
    )

# ============================================
# MAIN ENDPOINT - FIXED SECTION BUILDING
# ============================================

@router.post("/analyze-case", response_model=AnalyzeCaseResponse)
async def analyze_case(request: AnalyzeCaseRequest):
    """
    Analyze legal case using integrated services pipeline
    """
    try:
        description = request.description
        
        logger.info(f"\n{'='*60}")
        logger.info(f"📝 NEW REQUEST: {description[:100]}")
        logger.info(f"{'='*60}")
        
        # STEP 1: CLASSIFY
        logger.info(f"\n1️⃣ CLASSIFICATION")
        classification = classifier.classify_case(description)
        logger.info(f"   Category: {classification.category}")
        logger.info(f"   Severity: {classification.severity}")
        logger.info(f"   Confidence: {classification.confidence:.2%}")
        logger.info(f"   Keywords: {classification.keywords_found[:5]}")
        
        # STEP 2: KEYWORD MATCHING
        logger.info(f"\n2️⃣ KEYWORD MATCHING")
        keyword_sections = keyword_matcher.match_sections(description, classification)
        logger.info(f"   Matched sections: {len(keyword_sections)}")
        for s in keyword_sections:
            logger.info(f"   - {s.code}: {s.title} ({s.confidence:.2%})")
        
        # STEP 3: AI ANALYSIS & VALIDATION
        logger.info(f"\n3️⃣ AI ANALYSIS & VALIDATION")
        result = hybrid_analyzer.analyze(description, classification, keyword_sections)
        
        final_sections = result.get("sections", [])
        validation_result = result.get("validation_result")
        
        logger.info(f"   Final sections: {len(final_sections)}")
        for s in final_sections:
            logger.info(f"   - {s.code}: {s.title} ({s.confidence:.2%})")
        
        # STEP 4: CHECK IF CIVIL DISPUTE
        if not final_sections:
            logger.info(f"\n⚖️ NO CRIMINAL SECTIONS - Checking if civil dispute...")
            
            # Check case nature from AI
            case_nature = result.get("case_nature")
            if case_nature == "civil":
                logger.info(f"   ✅ AI determined: CIVIL CASE")
                if not validation_result:
                    validation_result = {
                        "warnings": result.get("warnings", []),
                        "money_classification": {
                            "classification": "civil_breach",
                            "domain": "civil",
                            "reasoning": result.get("warnings", ["This appears to be a civil matter"])[0]
                        }
                    }
                return generate_civil_dispute_response(validation_result, description)
            
            # Check validation result
            if validation_result:
                money_classification = validation_result.get("money_classification", {})
                if money_classification.get("domain") == "civil" or money_classification.get("classification") == "civil_breach":
                    logger.info(f"   ✅ Validator confirmed: CIVIL DISPUTE")
                    return generate_civil_dispute_response(validation_result, description)
        
        # STEP 5: BUILD CRIMINAL CASE RESPONSE
        logger.info(f"\n4️⃣ BUILDING RESPONSE")
        
        if not final_sections:
            logger.warning("⚠️ No sections found - returning generic response")
            return AnalyzeCaseResponse(
                sections=[
                    Section(
                        code="General",
                        name="Legal Consultation Required",
                        description="This situation requires professional legal review",
                        punishment="To be determined",  # 🆕
                        bailable=True,      # 🆕
                        cognizable=False,   # 🆕
                        confidence=50,
                        isPrimary=True,
                        reasoning="Professional assessment needed for specific laws",
                        matchedKeywords=[]
                    )
                ],
                severity="Requires Assessment",
                maxPunishment="To be determined",
                punishmentNote="Consult a lawyer",
                bail="To be determined",
                bailProbability=50,
                overallConfidence=50,
                summary="Your situation requires consultation with a legal professional.",
                nextSteps=[
                    "Document all evidence",
                    "Consult with a qualified lawyer",
                    "File formal complaint if wronged"
                ],
                actionPlan=None,
                documents=None
            )
        
        # 🔧 FIXED: Convert LegalSection to Section with ALL fields
        response_sections = []
        for i, section in enumerate(final_sections):
            confidence_value = section.confidence
            if confidence_value < 1:
                confidence_int = int(confidence_value * 100)
            else:
                confidence_int = int(confidence_value)
            
            response_sections.append(Section(
                code=section.code,
                name=section.title,
                description=section.description,
                punishment=section.punishment,      # 🆕 NOW PASSED THROUGH
                bailable=section.bailable,          # 🆕 NOW PASSED THROUGH
                cognizable=section.cognizable,      # 🆕 NOW PASSED THROUGH
                confidence=confidence_int,
                isPrimary=(i == 0),
                reasoning=section.reasoning,
                matchedKeywords=section.key_factors[:5]
            ))
        
        primary = final_sections[0]
        
        # Determine bail status from primary section
        bail_status = "Bailable" if primary.bailable else "Non-bailable"
        bail_probability = 70 if primary.bailable else 30
        
        overall_confidence = result.get("confidence", 0.75)
        if overall_confidence < 1:
            overall_confidence_int = int(overall_confidence * 100)
        else:
            overall_confidence_int = int(overall_confidence)
        
        # Generate premium features if authenticated
        action_plan = None
        documents = None
        
        if request.is_authenticated and request.user_id:
            logger.info(f"\n5️⃣ GENERATING PREMIUM FEATURES (Authenticated User)")
            
            # Generate Action Plan
            try:
                action_plan = action_plan_generator.generate_action_plan(
                    description=description,
                    sections=final_sections,
                    case_type=request.caseType or classification.category,
                    is_urgent=request.urgency
                )
                logger.info(f"   ✅ Action plan generated")
            except Exception as e:
                logger.error(f"   ❌ Action plan generation failed: {e}")
            
            # Generate Documents
            try:
                case_details = {
                    "description": description,
                    "incident_date": datetime.now().strftime("%Y-%m-%d"),
                    "incident_time": "[Time of incident]",
                    "incident_place": "[Location of incident]"
                }
                
                fir_draft = document_generator.generate_fir_draft(
                    case_details=case_details,
                    sections=final_sections,
                    user_info=None  # User will fill in the form
                )
                
                written_complaint = document_generator.generate_written_complaint(
                    case_details=case_details,
                    sections=final_sections,
                    user_info=None
                )
                
                evidence_checklist = document_generator.generate_evidence_checklist(
                    sections=final_sections,
                    case_type=request.caseType or classification.category
                )
                
                documents = {
                    "firDraft": fir_draft,
                    "writtenComplaint": written_complaint,
                    "evidenceChecklist": evidence_checklist
                }
                logger.info(f"   ✅ Documents generated")
            except Exception as e:
                logger.error(f"   ❌ Document generation failed: {e}")
        else:
            logger.info(f"\n⚠️ Premium features not available (Guest user)")
        
        response = AnalyzeCaseResponse(
            sections=response_sections,
            severity=determine_severity(final_sections),
            maxPunishment=primary.punishment,
            punishmentNote="Actual punishment depends on evidence and circumstances. Consult a lawyer for accurate assessment.",
            bail=bail_status,
            bailProbability=bail_probability,
            overallConfidence=overall_confidence_int,
            summary=generate_summary(description, final_sections, classification),
            nextSteps=generate_next_steps(final_sections, classification),
            actionPlan=action_plan,
            documents=documents
        )
        
        logger.info(f"✅ Response ready with {len(response.sections)} sections")
        logger.info(f"   Overall confidence: {response.overallConfidence}%")
        logger.info(f"   Bail status: {response.bail}")
        logger.info(f"   Premium features: {'✅ Included' if action_plan else '❌ Not available'}")
        
        return response
        
    except Exception as e:
        logger.error(f"❌ Error in analyze_case: {e}", exc_info=True)
        
        # Fallback response
        return AnalyzeCaseResponse(
            sections=[
                Section(
                    code="Error",
                    name="Analysis Failed",
                    description="An error occurred during analysis",
                    punishment="Unknown",       # 🆕
                    bailable=True,              # 🆕
                    cognizable=False,           # 🆕
                    confidence=0,
                    isPrimary=True,
                    reasoning=str(e),
                    matchedKeywords=[]
                )
            ],
            severity="Unknown",
            maxPunishment="Unknown",
            punishmentNote="Please try again or consult a lawyer",
            bail="Unknown",
            bailProbability=0,
            overallConfidence=0,
            summary="Analysis failed. Please consult a legal professional.",
            nextSteps=["Contact a lawyer", "Try again", "Gather evidence"],
            actionPlan=None,
            documents=None
        )