# app/services/action_plan_generator.py - Personalized Action Plan Generator

from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.models.section import LegalSection

class ActionPlanGenerator:
    """
    Generates personalized action plans based on case analysis
    """
    
    def __init__(self):
        self.police_station_db = self._init_police_stations()
        
    def _init_police_stations(self) -> Dict:
        """Initialize police station database (expand this with real data)"""
        return {
            "Mumbai": [
                {"name": "Andheri Police Station", "area": "Andheri", "phone": "022-26700844"},
                {"name": "Bandra Police Station", "area": "Bandra", "phone": "022-26420111"},
            ],
            "Delhi": [
                {"name": "Connaught Place PS", "area": "CP", "phone": "011-23731555"},
            ],
            "Bangalore": [
                {"name": "Koramangala PS", "area": "Koramangala", "phone": "080-25533711"},
            ]
        }
    
    def generate_action_plan(
        self,
        description: str,
        sections: List[LegalSection],
        case_type: str,
        is_urgent: bool
    ) -> Dict:
        """
        Generate comprehensive action plan
        """
        
        if not sections:
            return self._generate_generic_plan()
        
        primary_section = sections[0]
        is_cyber = "IT Act" in primary_section.code
        is_violent = any(code in primary_section.code for code in ["323", "325", "326", "354"])
        is_theft = "379" in primary_section.code
        is_non_bailable = not primary_section.bailable
        
        # Generate all components
        immediate_steps = self._generate_immediate_steps(
            primary_section, is_cyber, is_violent, is_urgent
        )
        
        documentation_needed = self._generate_documentation_list(
            primary_section, is_cyber, is_theft
        )
        
        legal_strategy = self._generate_legal_strategy(
            primary_section, sections, description
        )
        
        timeline = self._generate_timeline(
            primary_section, is_non_bailable
        )
        
        cost_estimate = self._generate_cost_estimate(
            primary_section, is_non_bailable
        )
        
        risk_assessment = self._generate_risk_assessment(
            sections, description
        )
        
        # ✨ NEW: Victory/Loss Prediction
        victory_prediction = self._generate_victory_prediction(
            sections, description, risk_assessment
        )
        
        # ✨ NEW: Enhanced Case Duration Estimation
        duration_estimate = self._generate_duration_estimate(
            primary_section, is_non_bailable, description
        )
        
        # ✨ NEW: Detailed Cost Breakdown
        detailed_costs = self._generate_detailed_costs(
            primary_section, is_non_bailable, duration_estimate
        )
        
        alternative_options = self._generate_alternatives(
            primary_section, description
        )
        
        critical_deadlines = self._generate_deadlines(is_urgent)
        
        police_station_info = self._get_police_station_info()
        
        return {
            "immediateSteps": immediate_steps,
            "documentationNeeded": documentation_needed,
            "legalStrategy": legal_strategy,
            "estimatedTimeline": timeline,
            "costEstimate": cost_estimate,
            "riskAssessment": risk_assessment,
            # ✨ NEW PREMIUM FEATURES
            "victoryPrediction": victory_prediction,
            "durationEstimate": duration_estimate,
            "detailedCosts": detailed_costs,
            "alternativeOptions": alternative_options,
            "criticalDeadlines": critical_deadlines,
            "policeStationInfo": police_station_info,
            "urgencyLevel": "HIGH" if is_urgent or is_violent else "MEDIUM",
            "nextStepDeadline": self._calculate_next_deadline(is_urgent, is_violent)
        }
    
    def _generate_immediate_steps(
        self,
        section: LegalSection,
        is_cyber: bool,
        is_violent: bool,
        is_urgent: bool
    ) -> List[Dict]:
        """Generate immediate action steps with priorities"""
        
        steps = []
        
        # PRIORITY 1: Safety first for violent crimes
        if is_violent:
            steps.append({
                "priority": 1,
                "action": "Ensure Your Safety",
                "description": "If you're in immediate danger, call 100 (Police) or go to the nearest police station immediately",
                "deadline": "IMMEDIATE",
                "icon": "shield-alert"
            })
            steps.append({
                "priority": 1,
                "action": "Get Medical Examination",
                "description": "Visit a government hospital for medical examination and obtain a medico-legal certificate (MLC)",
                "deadline": "Within 24 hours",
                "icon": "hospital"
            })
        
        # PRIORITY 2: Evidence preservation (all cases)
        if is_cyber:
            steps.append({
                "priority": 1,
                "action": "Preserve Digital Evidence",
                "description": "Take screenshots of all messages, posts, profiles. Do NOT delete anything. Enable two-factor authentication on all accounts",
                "deadline": "Within 2 hours",
                "icon": "smartphone"
            })
            steps.append({
                "priority": 2,
                "action": "Report to Platform",
                "description": "Report the abuse to Instagram/Facebook/Twitter support and request account preservation",
                "deadline": "Within 24 hours",
                "icon": "flag"
            })
        else:
            steps.append({
                "priority": 1,
                "action": "Preserve All Evidence",
                "description": "Collect and safely store all physical evidence, CCTV footage, photographs, receipts, and witness contact information",
                "deadline": "Within 24 hours",
                "icon": "camera"
            })
        
        # PRIORITY 3: File complaint
        complaint_deadline = "Within 24 hours" if is_urgent or is_violent else "Within 3-7 days"
        complaint_location = "Cyber Crime Cell" if is_cyber else "nearest Police Station"
        
        steps.append({
            "priority": 2,
            "action": f"File FIR at {complaint_location}",
            "description": f"File First Information Report (FIR) under {section.code}. Police MUST register FIR for cognizable offenses. If refused, file complaint with SP/Commissioner.",
            "deadline": complaint_deadline,
            "icon": "file-text"
        })
        
        # PRIORITY 4: Legal consultation
        steps.append({
            "priority": 3,
            "action": "Consult Criminal Lawyer",
            "description": f"Get legal advice on {'non-bailable' if not section.bailable else 'bailable'} offense strategy and bail procedures",
            "deadline": "Within 3-5 days",
            "icon": "briefcase"
        })
        
        # PRIORITY 5: Inform family/employer if needed
        if is_violent or not section.bailable:
            steps.append({
                "priority": 3,
                "action": "Inform Trusted Contacts",
                "description": "Inform family members or trusted friends about the situation for support and safety",
                "deadline": "Within 24 hours",
                "icon": "users"
            })
        
        return steps
    
    def _generate_documentation_list(
        self,
        section: LegalSection,
        is_cyber: bool,
        is_theft: bool
    ) -> List[Dict]:
        """Generate required documentation checklist"""
        
        docs = [
            {
                "category": "Identity Proof",
                "items": [
                    {"name": "Aadhar Card", "required": True, "obtained": False},
                    {"name": "PAN Card", "required": False, "obtained": False},
                    {"name": "Address Proof", "required": True, "obtained": False}
                ]
            },
            {
                "category": "Evidence Documents",
                "items": []
            }
        ]
        
        # Add evidence based on case type
        if is_cyber:
            docs[1]["items"].extend([
                {"name": "Screenshots of messages/posts", "required": True, "obtained": False},
                {"name": "Account details (username, profile link)", "required": True, "obtained": False},
                {"name": "IP logs (if available)", "required": False, "obtained": False},
                {"name": "Email headers", "required": False, "obtained": False},
            ])
        
        if is_theft:
            docs[1]["items"].extend([
                {"name": "Purchase receipt/invoice of stolen item", "required": True, "obtained": False},
                {"name": "IMEI number (for phone theft)", "required": True, "obtained": False},
                {"name": "Serial numbers of stolen goods", "required": False, "obtained": False},
                {"name": "Insurance policy (if any)", "required": False, "obtained": False},
            ])
        
        # Generic evidence
        docs[1]["items"].extend([
            {"name": "Witness statements (written)", "required": False, "obtained": False},
            {"name": "CCTV footage (if available)", "required": False, "obtained": False},
            {"name": "Call records/SMS records", "required": False, "obtained": False},
        ])
        
        # Legal documents category
        docs.append({
            "category": "Legal Documents",
            "items": [
                {"name": "Written complaint draft", "required": True, "obtained": False},
                {"name": "Affidavit (if required)", "required": False, "obtained": False},
                {"name": "Notarized witness statements", "required": False, "obtained": False},
            ]
        })
        
        return docs
    
    def _generate_legal_strategy(
        self,
        primary: LegalSection,
        all_sections: List[LegalSection],
        description: str
    ) -> Dict:
        """Generate recommended legal strategy"""
        
        is_strong_evidence = any(word in description.lower() for word in [
            "screenshot", "cctv", "recording", "witness", "photo", "video"
        ])
        
        strategy = {
            "primaryApproach": "",
            "reasoning": "",
            "strengthOfCase": "Medium",
            "recommendedAction": "",
            "prosecutionProbability": 0.0
        }
        
        # Determine strength
        if is_strong_evidence and len(all_sections) >= 2:
            strategy["strengthOfCase"] = "Strong"
            strategy["prosecutionProbability"] = 0.75
        elif is_strong_evidence or len(all_sections) >= 2:
            strategy["strengthOfCase"] = "Medium"
            strategy["prosecutionProbability"] = 0.60
        else:
            strategy["strengthOfCase"] = "Weak - Needs More Evidence"
            strategy["prosecutionProbability"] = 0.40
        
        # Primary approach
        if primary.bailable:
            strategy["primaryApproach"] = "File FIR and pursue investigation"
            strategy["reasoning"] = f"This is a bailable offense under {primary.code}. You can file FIR and cooperate with police investigation. Accused can get bail easily, but case will proceed."
            strategy["recommendedAction"] = "Focus on evidence collection and witness statements to strengthen case"
        else:
            strategy["primaryApproach"] = "File FIR with strong evidence package"
            strategy["reasoning"] = f"This is a NON-BAILABLE offense under {primary.code}. Accused can be arrested without warrant. Strong evidence is crucial for conviction."
            strategy["recommendedAction"] = "Engage experienced criminal lawyer immediately for arrest warrant and custody proceedings"
        
        return strategy
    
    def _generate_timeline(
        self,
        section: LegalSection,
        is_non_bailable: bool
    ) -> Dict:
        """Generate estimated case timeline"""
        
        return {
            "phases": [
                {
                    "phase": "FIR Filing",
                    "duration": "1-7 days",
                    "description": "File complaint, police registers FIR"
                },
                {
                    "phase": "Investigation",
                    "duration": "2-6 months",
                    "description": "Police investigation, evidence collection, accused questioning"
                },
                {
                    "phase": "Chargesheet",
                    "duration": "1-3 months after investigation",
                    "description": "Police files chargesheet in court if evidence found"
                },
                {
                    "phase": "Trial (if needed)",
                    "duration": "1-3 years",
                    "description": "Court hearings, witness examination, arguments, judgment"
                }
            ],
            "totalEstimate": "1.5-4 years for complete resolution",
            "fastTrackPossible": is_non_bailable,
            "settlementPossible": section.bailable,
            "note": "Timeline varies greatly based on case complexity, court load, and evidence quality"
        }
    
    def _generate_cost_estimate(
        self,
        section: LegalSection,
        is_non_bailable: bool
    ) -> Dict:
        """Generate cost breakdown"""
        
        costs = {
            "breakdown": [
                {
                    "stage": "FIR & Police Complaint",
                    "cost": "Free",
                    "description": "No charge for filing FIR"
                },
                {
                    "stage": "Initial Legal Consultation",
                    "cost": "₹2,000 - ₹10,000",
                    "description": "First meeting with lawyer"
                },
                {
                    "stage": "Lawyer Retainer (if hiring)",
                    "cost": "₹15,000 - ₹50,000",
                    "description": "For representation during investigation"
                },
                {
                    "stage": "Court Proceedings (if trial)",
                    "cost": "₹50,000 - ₹3,00,000",
                    "description": "Full trial representation"
                },
                {
                    "stage": "Miscellaneous",
                    "cost": "₹5,000 - ₹20,000",
                    "description": "Documents, travel, photocopies, notary"
                }
            ],
            "minimumEstimate": "₹22,000",
            "maximumEstimate": "₹3,80,000",
            "averageEstimate": "₹1,00,000",
            "note": "Costs vary based on lawyer experience, city, case complexity"
        }
        
        if is_non_bailable:
            costs["breakdown"].insert(3, {
                "stage": "Bail Application",
                "cost": "₹10,000 - ₹50,000",
                "description": "If accused seeks bail"
            })
        
        return costs
    
    def _generate_risk_assessment(
        self,
        sections: List[LegalSection],
        description: str
    ) -> Dict:
        """Assess case risks and success probability"""
        
        primary = sections[0]
        
        # Calculate success probability
        base_probability = 0.60  # Base for cognizable offenses
        
        # Adjust based on evidence
        evidence_keywords = ["screenshot", "cctv", "recording", "witness", "photo", "video", "proof"]
        evidence_count = sum(1 for kw in evidence_keywords if kw in description.lower())
        evidence_boost = min(0.15, evidence_count * 0.05)
        
        # Adjust based on section strength
        if len(sections) >= 3:
            section_boost = 0.10
        elif len(sections) >= 2:
            section_boost = 0.05
        else:
            section_boost = 0.0
        
        success_probability = min(0.90, base_probability + evidence_boost + section_boost)
        
        # Identify risks
        risks = []
        strengths = []
        
        # Strengths
        if evidence_count >= 2:
            strengths.append("Strong evidence (digital/physical proof available)")
        if len(sections) >= 2:
            strengths.append(f"Multiple applicable sections ({len(sections)} sections identified)")
        if primary.cognizable:
            strengths.append("Cognizable offense - police must investigate")
        if not primary.bailable:
            strengths.append("Non-bailable - accused can be arrested without warrant")
        
        # Risks
        if evidence_count == 0:
            risks.append("Limited evidence mentioned - may weaken case")
        if "delayed" in description.lower() or "days ago" in description.lower():
            risks.append("Delayed reporting may raise questions")
        if primary.bailable:
            risks.append("Bailable offense - accused can get bail easily")
        if "no witness" in description.lower():
            risks.append("Lack of witnesses may make conviction harder")
        
        return {
            "successProbability": round(success_probability * 100),
            "convictionChance": round(success_probability * 0.85 * 100),  # 85% of success = conviction
            "strengths": strengths if strengths else ["Case registered under valid legal provision"],
            "risks": risks if risks else ["Standard legal proceedings apply"],
            "criticalFactors": [
                "Quality and preservation of evidence",
                "Witness cooperation and credibility",
                "Timely action and FIR filing",
                "Lawyer expertise and strategy"
            ],
            "recommendation": "PROCEED" if success_probability >= 0.65 else "PROCEED WITH CAUTION"
        }
    
    def _generate_alternatives(
        self,
        section: LegalSection,
        description: str
    ) -> List[Dict]:
        """Generate alternative resolution options"""
        
        alternatives = []
        
        # Settlement/Mediation (for bailable offenses)
        if section.bailable and "379" not in section.code:  # Not for theft
            alternatives.append({
                "option": "Out-of-Court Settlement",
                "description": "Negotiate compensation/apology with accused through mediation",
                "pros": ["Faster resolution (weeks vs years)", "Lower costs", "Less stress", "Guaranteed outcome"],
                "cons": ["No punishment for accused", "May seem weak", "Requires accused cooperation"],
                "suitability": "HIGH" if "minor" in description.lower() else "MEDIUM",
                "estimatedTime": "2-8 weeks",
                "estimatedCost": "₹5,000 - ₹25,000"
            })
        
        # Compromise (under CrPC 320)
        if section.code in ["IPC 323", "IPC 504", "IPC 506"]:
            alternatives.append({
                "option": "Compromise under CrPC 320",
                "description": "Formal compromise in court leading to case withdrawal",
                "pros": ["Legal closure", "Court-approved", "Can happen during trial"],
                "cons": ["Court permission needed", "Both parties must agree"],
                "suitability": "MEDIUM",
                "estimatedTime": "1-3 months",
                "estimatedCost": "₹10,000 - ₹30,000"
            })
        
        # Civil suit (additional to criminal)
        alternatives.append({
            "option": "File Civil Suit for Damages",
            "description": "Sue for monetary compensation in addition to criminal case",
            "pros": ["Get financial compensation", "Can run parallel to criminal case", "Lower burden of proof"],
            "cons": ["Additional costs", "Separate court proceedings", "Takes time"],
            "suitability": "MEDIUM",
            "estimatedTime": "2-5 years",
            "estimatedCost": "₹30,000 - ₹1,50,000"
        })
        
        # Consumer Court (if applicable)
        if "bought" in description.lower() or "product" in description.lower() or "service" in description.lower():
            alternatives.append({
                "option": "Consumer Court Complaint",
                "description": "File complaint for defective product/service",
                "pros": ["Faster than civil court", "Lower fees", "Consumer-friendly"],
                "cons": ["Limited to consumer disputes", "Compensation limits"],
                "suitability": "HIGH",
                "estimatedTime": "6-18 months",
                "estimatedCost": "₹500 - ₹10,000"
            })
        
        return alternatives
    
    def _generate_deadlines(self, is_urgent: bool) -> List[Dict]:
        """Generate critical deadlines"""
        
        now = datetime.now()
        
        deadlines = [
            {
                "task": "File FIR",
                "deadline": (now + timedelta(days=1 if is_urgent else 7)).strftime("%Y-%m-%d"),
                "priority": "CRITICAL",
                "consequence": "Delayed FIR raises questions about genuineness of complaint"
            },
            {
                "task": "Preserve all evidence",
                "deadline": (now + timedelta(hours=24)).strftime("%Y-%m-%d"),
                "priority": "CRITICAL",
                "consequence": "Evidence may be lost or destroyed"
            },
            {
                "task": "Consult lawyer",
                "deadline": (now + timedelta(days=5)).strftime("%Y-%m-%d"),
                "priority": "HIGH",
                "consequence": "May miss important legal steps or deadlines"
            },
            {
                "task": "Gather witness statements",
                "deadline": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
                "priority": "MEDIUM",
                "consequence": "Witnesses may forget details or become unavailable"
            }
        ]
        
        return deadlines
    
    def _get_police_station_info(self) -> Dict:
        """Get nearest police station info (placeholder - integrate with Google Maps API)"""
        
        return {
            "nearest": {
                "name": "Contact your local police station",
                "address": "Based on incident location",
                "phone": "100 (Emergency) or local station number",
                "distance": "N/A",
                "jurisdiction": "Verify jurisdiction before filing FIR"
            },
            "cyberCell": {
                "name": "National Cyber Crime Reporting Portal",
                "website": "https://cybercrime.gov.in",
                "phone": "155260",
                "note": "For cyber crimes, file online complaint here"
            },
            "womenHelpline": "1091",
            "emergencyNumber": "100"
        }
    
    def _calculate_next_deadline(self, is_urgent: bool, is_violent: bool) -> str:
        """Calculate the most immediate deadline"""
        
        if is_violent:
            return "IMMEDIATE - Ensure safety first"
        elif is_urgent:
            return "Within 24 hours - File FIR"
        else:
            return "Within 3-7 days - File FIR"
    
    def _generate_victory_prediction(
        self,
        sections: List[LegalSection],
        description: str,
        risk_assessment: Dict
    ) -> Dict:
        """
        Generate detailed victory/loss prediction with probabilities
        """
        primary = sections[0] if sections else None
        
        # Base probability from risk assessment
        success_prob = risk_assessment.get("successProbability", 60) / 100
        
        # Calculate different outcome probabilities
        # Victory = FIR registered + investigation + conviction
        victory_chance = success_prob * 0.85  # 85% of success cases lead to victory
        
        # Partial victory = FIR + investigation but settlement/compromise
        partial_victory_chance = success_prob * 0.10
        
        # Loss = No conviction or case dismissed
        loss_chance = 1.0 - victory_chance - partial_victory_chance
        
        # Determine verdict
        if victory_chance >= 0.70:
            verdict = "STRONG CASE"
            confidence = "HIGH"
            color = "green"
        elif victory_chance >= 0.50:
            verdict = "MODERATE CASE"
            confidence = "MEDIUM"
            color = "yellow"
        else:
            verdict = "WEAK CASE"
            confidence = "LOW"
            color = "red"
        
        # Key factors affecting outcome
        success_factors = []
        risk_factors = []
        
        # Analyze evidence quality
        evidence_keywords = ["screenshot", "cctv", "recording", "witness", "photo", "video", "proof", "document"]
        evidence_count = sum(1 for kw in evidence_keywords if kw in description.lower())
        
        if evidence_count >= 3:
            success_factors.append("Strong evidence base (multiple proof types)")
        elif evidence_count >= 1:
            success_factors.append("Some evidence available")
        else:
            risk_factors.append("Limited evidence mentioned - needs strengthening")
        
        # Analyze section strength
        if len(sections) >= 3:
            success_factors.append(f"Multiple serious offenses ({len(sections)} sections)")
        elif len(sections) >= 2:
            success_factors.append("Multiple applicable sections strengthen case")
        
        if primary and not primary.bailable:
            success_factors.append("Non-bailable offense - stronger legal position")
        elif primary and primary.bailable:
            risk_factors.append("Bailable offense - accused can get bail")
        
        if primary and primary.cognizable:
            success_factors.append("Cognizable offense - police must investigate")
        
        # Timing factors
        if "immediately" in description.lower() or "right away" in description.lower():
            success_factors.append("Immediate reporting shows genuineness")
        elif "days ago" in description.lower() or "weeks ago" in description.lower():
            risk_factors.append("Delayed reporting may weaken case")
        
        # Witness availability
        if "witness" in description.lower():
            success_factors.append("Witnesses available to support case")
        else:
            risk_factors.append("No witnesses mentioned - consider finding them")
        
        return {
            "victoryChance": round(victory_chance * 100, 1),
            "partialVictoryChance": round(partial_victory_chance * 100, 1),
            "lossChance": round(loss_chance * 100, 1),
            "verdict": verdict,
            "confidence": confidence,
            "confidenceColor": color,
            "successFactors": success_factors if success_factors else ["Case filed under valid legal provision"],
            "riskFactors": risk_factors if risk_factors else ["Standard legal risks apply"],
            "recommendation": self._get_victory_recommendation(victory_chance),
            "detailedAnalysis": {
                "convictionProbability": round(victory_chance * 100, 1),
                "settlementProbability": round(partial_victory_chance * 100, 1),
                "dismissalProbability": round(loss_chance * 0.6 * 100, 1),
                "acquittalProbability": round(loss_chance * 0.4 * 100, 1)
            },
            "improvementTips": self._get_improvement_tips(risk_factors, evidence_count)
        }
    
    def _get_victory_recommendation(self, victory_chance: float) -> str:
        """Get recommendation based on victory probability"""
        if victory_chance >= 0.70:
            return "STRONGLY RECOMMENDED - High likelihood of favorable outcome"
        elif victory_chance >= 0.50:
            return "RECOMMENDED - Reasonable chance of success with proper evidence"
        elif victory_chance >= 0.30:
            return "PROCEED WITH CAUTION - Strengthen evidence before filing"
        else:
            return "CONSULT LAWYER - Case needs significant strengthening"
    
    def _get_improvement_tips(self, risk_factors: List[str], evidence_count: int) -> List[str]:
        """Get tips to improve victory chances"""
        tips = []
        
        if evidence_count < 2:
            tips.append("🔍 Collect more evidence: CCTV footage, screenshots, documents, receipts")
        
        if any("witness" in rf.lower() for rf in risk_factors):
            tips.append("👥 Find and document witness statements immediately")
        
        if any("delay" in rf.lower() for rf in risk_factors):
            tips.append("⏱️ File FIR immediately to avoid further delays")
        
        if any("bail" in rf.lower() for rf in risk_factors):
            tips.append("⚖️ Oppose bail application with strong grounds")
        
        if not tips:
            tips.append("✅ Focus on evidence preservation and timely legal action")
        
        return tips
    
    def _generate_duration_estimate(
        self,
        section: LegalSection,
        is_non_bailable: bool,
        description: str
    ) -> Dict:
        """
        Generate detailed case duration estimation
        """
        # Base duration factors
        investigation_duration = {
            "min_months": 2,
            "max_months": 6,
            "average_months": 3
        }
        
        chargesheet_duration = {
            "min_months": 1,
            "max_months": 3,
            "average_months": 2
        }
        
        trial_duration = {
            "min_months": 12,
            "max_months": 36,
            "average_months": 18
        }
        
        # Adjust based on complexity
        complexity_keywords = ["multiple", "several", "many", "various", "complex"]
        is_complex = any(kw in description.lower() for kw in complexity_keywords)
        
        if is_complex:
            trial_duration["max_months"] = 48
            trial_duration["average_months"] = 24
        
        # Calculate total duration
        total_min = investigation_duration["min_months"] + chargesheet_duration["min_months"] + trial_duration["min_months"]
        total_max = investigation_duration["max_months"] + chargesheet_duration["max_months"] + trial_duration["max_months"]
        total_avg = investigation_duration["average_months"] + chargesheet_duration["average_months"] + trial_duration["average_months"]
        
        return {
            "totalDuration": {
                "minimum": f"{total_min} months ({total_min // 12} years)",
                "maximum": f"{total_max} months ({total_max // 12} years)",
                "average": f"{total_avg} months ({round(total_avg / 12, 1)} years)",
                "mostLikely": f"{total_avg} months"
            },
            "phaseBreakdown": [
                {
                    "phase": "FIR Registration",
                    "duration": "1-7 days",
                    "description": "Filing complaint and FIR registration",
                    "canExpedite": True,
                    "expediteTip": "File FIR immediately, follow up daily"
                },
                {
                    "phase": "Police Investigation",
                    "duration": f"{investigation_duration['min_months']}-{investigation_duration['max_months']} months",
                    "description": "Evidence collection, witness statements, accused questioning",
                    "canExpedite": True,
                    "expediteTip": "Provide all evidence upfront, follow up with IO weekly"
                },
                {
                    "phase": "Chargesheet Filing",
                    "duration": f"{chargesheet_duration['min_months']}-{chargesheet_duration['max_months']} months",
                    "description": "Police submits investigation report to court",
                    "canExpedite": False,
                    "expediteTip": "Lawyer can file petition for speedy investigation"
                },
                {
                    "phase": "Court Trial",
                    "duration": f"{trial_duration['min_months']}-{trial_duration['max_months']} months",
                    "description": "Court hearings, witness examination, arguments, judgment",
                    "canExpedite": True,
                    "expediteTip": "Request fast-track trial for serious offenses"
                }
            ],
            "factorsAffectingDuration": [
                "Court backlog and case load",
                "Witness availability and cooperation",
                "Evidence complexity and forensics",
                "Defense lawyer tactics and adjournments",
                "Judge transfers and court vacations"
            ],
            "expeditingOptions": [
                {
                    "option": "Fast-Track Court",
                    "applicable": is_non_bailable,
                    "benefit": "Reduces trial time by 30-50%",
                    "requirement": "Available for serious/heinous crimes"
                },
                {
                    "option": "Section 311 CrPC Application",
                    "applicable": True,
                    "benefit": "Request court to expedite proceedings",
                    "requirement": "Valid grounds for urgency needed"
                },
                {
                    "option": "Regular Follow-ups",
                    "applicable": True,
                    "benefit": "Prevents delays and adjournments",
                    "requirement": "Active engagement with lawyer and court"
                }
            ],
            "settlementTimeline": {
                "mediation": "2-8 weeks",
                "compromise": "1-3 months",
                "civilSuit": "2-4 years"
            }
        }
    
    def _generate_detailed_costs(
        self,
        section: LegalSection,
        is_non_bailable: bool,
        duration_estimate: Dict
    ) -> Dict:
        """
        Generate comprehensive cost breakdown with estimates
        """
        return {
            "summary": {
                "minimumCost": "₹22,000",
                "averageCost": "₹1,50,000",
                "maximumCost": "₹5,00,000",
                "note": "Actual costs vary by city, lawyer experience, and case complexity"
            },
            "phaseWiseCosts": [
                {
                    "phase": "Initial FIR & Complaint",
                    "items": [
                        {"item": "FIR Filing", "cost": "Free", "mandatory": True},
                        {"item": "Document printing/copies", "cost": "₹500-2,000", "mandatory": True},
                        {"item": "Notary charges", "cost": "₹500-1,000", "mandatory": False},
                        {"item": "Travel to police station", "cost": "₹500-2,000", "mandatory": True}
                    ],
                    "total": "₹1,500-5,000",
                    "timeline": "Week 1"
                },
                {
                    "phase": "Legal Consultation",
                    "items": [
                        {"item": "Initial lawyer consultation", "cost": "₹2,000-10,000", "mandatory": True},
                        {"item": "Case documentation review", "cost": "₹2,000-5,000", "mandatory": True},
                        {"item": "Legal opinion/strategy", "cost": "₹5,000-15,000", "mandatory": False}
                    ],
                    "total": "₹9,000-30,000",
                    "timeline": "Week 1-2"
                },
                {
                    "phase": "Investigation Stage",
                    "items": [
                        {"item": "Lawyer retainer fee", "cost": "₹15,000-50,000", "mandatory": True},
                        {"item": "Police station visits", "cost": "₹2,000-5,000", "mandatory": True},
                        {"item": "Evidence collection", "cost": "₹5,000-20,000", "mandatory": True},
                        {"item": "Private investigation (if needed)", "cost": "₹20,000-1,00,000", "mandatory": False}
                    ],
                    "total": "₹42,000-1,75,000",
                    "timeline": "Months 1-6"
                },
                {
                    "phase": "Court Proceedings",
                    "items": [
                        {"item": "Lawyer court appearance fees", "cost": "₹2,000-10,000 per hearing", "mandatory": True},
                        {"item": "Total hearings (estimated)", "cost": "20-40 hearings", "mandatory": True},
                        {"item": "Court fees & stamps", "cost": "₹5,000-15,000", "mandatory": True},
                        {"item": "Witness expenses", "cost": "₹5,000-20,000", "mandatory": False}
                    ],
                    "total": "₹50,000-4,00,000",
                    "timeline": "Months 6-24"
                }
            ],
            "additionalCosts": [
                {"category": "Forensic Evidence", "cost": "₹10,000-50,000", "when": "If technical analysis needed"},
                {"category": "Expert Witnesses", "cost": "₹15,000-1,00,000", "when": "For medical/technical testimony"},
                {"category": "Appeals", "cost": "₹50,000-2,00,000", "when": "If appealing lower court decision"},
                {"category": "Bail Application", "cost": "₹10,000-50,000", "when": "For non-bailable offenses (if needed)"}
            ],
            "costSavingTips": [
                "💰 Use legal aid services if eligible (income < ₹3 lakh/year)",
                "💰 Many lawyers offer free initial consultation",
                "💰 Government forensic labs are cheaper than private",
                "💰 Collect and organize evidence yourself to reduce lawyer time",
                "💰 Attend hearings yourself to save lawyer appearance fees where possible"
            ],
            "paymentStructure": {
                "options": [
                    {"type": "One-time Fee", "amount": "Full amount upfront", "pros": "May get discount", "cons": "Large initial payment"},
                    {"type": "Retainer + Appearances", "amount": "₹20,000 + ₹2,000/hearing", "pros": "Spread over time", "cons": "Can add up"},
                    {"type": "Stage-wise Payment", "amount": "Pay at each stage", "pros": "Manageable chunks", "cons": "Slightly higher total"}
                ],
                "recommended": "Stage-wise payment for better cash flow management"
            },
            "financialAssistance": [
                {"source": "State Legal Services Authority", "eligibility": "Income < ₹3 lakh/year", "benefit": "Free legal representation"},
                {"source": "District Legal Services", "eligibility": "SC/ST/Women/Senior Citizens", "benefit": "Subsidized legal aid"},
                {"source": "NGO Legal Aid", "eligibility": "Varies", "benefit": "Free or low-cost lawyers"}
            ]
        }
    
    def _generate_generic_plan(self) -> Dict:
        """Fallback plan when no sections identified"""
        
        return {
            "immediateSteps": [
                {
                    "priority": 1,
                    "action": "Document Everything",
                    "description": "Write down all details with dates, times, locations, and people involved",
                    "deadline": "Within 24 hours",
                    "icon": "file-text"
                },
                {
                    "priority": 2,
                    "action": "Consult a Lawyer",
                    "description": "Get professional legal advice to determine applicable laws",
                    "deadline": "Within 3-5 days",
                    "icon": "briefcase"
                }
            ],
            "documentationNeeded": [],
            "legalStrategy": {
                "primaryApproach": "Legal consultation required",
                "reasoning": "Professional assessment needed for specific legal provisions",
                "strengthOfCase": "Unknown",
                "recommendedAction": "Consult with a qualified lawyer",
                "prosecutionProbability": 0.0
            },
            "estimatedTimeline": {"totalEstimate": "To be determined"},
            "costEstimate": {"averageEstimate": "₹10,000 - ₹50,000 for consultation"},
            "riskAssessment": {
                "successProbability": 0,
                "recommendation": "CONSULT LAWYER"
            },
            "alternativeOptions": [],
            "criticalDeadlines": [],
            "policeStationInfo": self._get_police_station_info(),
            "urgencyLevel": "MEDIUM",
            "nextStepDeadline": "Within 3 days - Consult lawyer"
        }