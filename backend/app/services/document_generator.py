# app/services/document_generator.py - Legal Document Generator

from typing import List, Dict, Optional
from datetime import datetime
from app.models.section import LegalSection

class DocumentGenerator:
    """
    Generates legal documents: FIR, Written Complaint, Affidavit, etc.
    """
    
    def generate_fir_draft(
        self,
        case_details: Dict,
        sections: List[LegalSection],
        user_info: Optional[Dict] = None
    ) -> Dict:
        """
        Generate FIR draft in both English and Hindi
        """
        
        primary_section = sections[0] if sections else None
        
        # Default user info
        if not user_info:
            user_info = {
                "name": "[Your Full Name]",
                "father_name": "[Father's/Husband's Name]",
                "age": "[Age]",
                "address": "[Complete Address with Pin Code]",
                "phone": "[Mobile Number]",
                "email": "[Email Address]"
            }
        
        description = case_details.get("description", "")
        incident_date = case_details.get("incident_date", datetime.now().strftime("%Y-%m-%d"))
        incident_time = case_details.get("incident_time", "[Time of incident]")
        incident_place = case_details.get("incident_place", "[Location of incident]")
        
        # Generate English FIR
        english_fir = self._generate_english_fir(
            user_info, description, sections, 
            incident_date, incident_time, incident_place
        )
        
        # Generate Hindi FIR
        hindi_fir = self._generate_hindi_fir(
            user_info, description, sections,
            incident_date, incident_time, incident_place
        )
        
        # ✨ NEW: Generate Marathi FIR
        marathi_fir = self._generate_marathi_fir(
            user_info, description, sections,
            incident_date, incident_time, incident_place
        )
        
        return {
            "english": english_fir,
            "hindi": hindi_fir,
            "marathi": marathi_fir,  # ✨ NEW
            "sections_applied": [s.code for s in sections],
            "document_type": "FIR Draft",
            "generated_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "instructions": [
                "Fill in all [bracketed] information with your actual details",
                "Print on plain paper (no letterhead needed)",
                "Sign at the bottom",
                "Submit two copies - one for police, one for your records",
                "Police MUST give you a copy with FIR number and date/time",
                "If police refuse to file FIR, submit written complaint via registered post to SP/Commissioner"
            ]
        }
    
    def _generate_english_fir(
        self,
        user_info: Dict,
        description: str,
        sections: List[LegalSection],
        incident_date: str,
        incident_time: str,
        incident_place: str
    ) -> str:
        """Generate FIR in English"""
        
        sections_text = ", ".join([s.code for s in sections]) if sections else "[Applicable sections]"
        primary_offense = sections[0].title if sections else "[Nature of offense]"
        
        fir = f"""
FIRST INFORMATION REPORT (FIR)
Under Section 154 CrPC

To,
The Station House Officer (SHO)
[Name of Police Station]
[Address]

Date: {datetime.now().strftime("%d/%m/%Y")}

Subject: Complaint regarding {primary_offense} - Request for FIR registration

Respected Sir/Madam,

DETAILS OF COMPLAINANT:
Name: {user_info['name']}
Father's/Husband's Name: {user_info['father_name']}
Age: {user_info['age']}
Address: {user_info['address']}
Mobile: {user_info['phone']}
Email: {user_info['email']}

DETAILS OF INCIDENT:
Date of Incident: {incident_date}
Time of Incident: {incident_time}
Place of Incident: {incident_place}

STATEMENT OF FACTS:

{description}

LEGAL PROVISIONS APPLICABLE:
Based on the above facts, the following offenses have been committed:
{self._format_sections_for_fir(sections)}

PRAYER:
In view of the above facts, I request you to kindly:
1. Register an FIR under the above-mentioned sections
2. Conduct a thorough investigation
3. Take appropriate legal action against the accused
4. Provide me with a copy of the FIR for my records

I hereby declare that the above information is true to the best of my knowledge and belief.

Yours faithfully,

_______________________
[Signature]
{user_info['name']}
Date: {datetime.now().strftime("%d/%m/%Y")}
Mobile: {user_info['phone']}

ENCLOSURES:
1. Copy of identity proof (Aadhar/PAN)
2. Copy of address proof
3. [List any supporting documents/evidence]

---
NOTE: As per Supreme Court guidelines, police MUST register FIR for cognizable offenses.
If FIR is not registered, you can:
- File complaint to SP/Commissioner
- Send complaint via Registered Post AD
- File private complaint before Magistrate under Section 156(3) CrPC
"""
        return fir.strip()
    
    def _generate_hindi_fir(
        self,
        user_info: Dict,
        description: str,
        sections: List[LegalSection],
        incident_date: str,
        incident_time: str,
        incident_place: str
    ) -> str:
        """Generate FIR in Hindi - UTF-8 encoded"""
        
        sections_text = ", ".join([s.code for s in sections]) if sections else "[लागू धाराएं]"
        
        # Use raw string to preserve Devanagari characters
        hindi_fir = """प्रथम सूचना रिपोर्ट (FIR)
(धारा 154 सी.आर.पी.सी. के अंतर्गत)

सेवा में,
थाना प्रभारी: __________________
थाना: __________________

दिनांक: {date}

विषय: शिकायत पंजीकरण हेतु प्रार्थना पत्र

महोदय/महोदया,

शिकायतकर्ता का विवरण

नाम: {name}
पिता/पति का नाम: {father_name}
आयु: {age}
पता: {address}
मोबाइल: {phone}
ईमेल: {email}

घटना का विवरण

तिथि: {incident_date}
समय: {incident_time}
स्थान: {incident_place}

घटना की जानकारी

{description}

लागू धाराएं (कानूनी प्रावधान)

आई.पी.सी. धाराएं: {sections}

प्रार्थना

उपरोक्त तथ्यों के आधार पर, मैं आपसे निवेदन करता/करती हूं कि मेरी शिकायत दर्ज की जाए और उचित कानूनी कार्यवाही की जाए।

_______________________
शिकायतकर्ता के हस्ताक्षर

_______________________
शिकायतकर्ता का नाम

दिनांक: {date}
""".format(
            date=datetime.now().strftime("%d/%m/%Y"),
            name=user_info['name'],
            father_name=user_info['father_name'],
            age=user_info['age'],
            address=user_info['address'],
            phone=user_info['phone'],
            email=user_info['email'],
            incident_date=incident_date,
            incident_time=incident_time,
            incident_place=incident_place,
            description=description,
            sections=sections_text
        )
        
        return hindi_fir.strip()
    
    def _generate_marathi_fir(
        self,
        user_info: Dict,
        description: str,
        sections: List[LegalSection],
        incident_date: str,
        incident_time: str,
        incident_place: str
    ) -> str:
        """Generate FIR in Marathi - UTF-8 encoded"""
        
        sections_text = ", ".join([s.code for s in sections]) if sections else "[लागू कलम]"
        
        marathi_fir = f"""
प्रथम माहिती अहवाल (FIR)
कलम 154 CrPC अंतर्गत

सेवेत,
ठाणे प्रभारी (SHO)
[पोलीस ठाण्याचे नाव]
[पत्ता]

दिनांक: {datetime.now().strftime("%d/%m/%Y")}

विषय: तक्रार नोंदणीसाठी विनंती

महोदय/महोदया,

तक्रारदाराचा तपशील:
नाव: {user_info['name']}
वडिलांचे/पतीचे नाव: {user_info['father_name']}
वय: {user_info['age']}
पत्ता: {user_info['address']}
मोबाइल: {user_info['phone']}
ईमेल: {user_info['email']}

घटनेचा तपशील:
घटनेची तारीख: {incident_date}
घटनेची वेळ: {incident_time}
घटनास्थळ: {incident_place}

वस्तुस्थितीचा तपशील:

{description}

लागू कायदेशीर कलम:
{sections_text}

विनंती:
वरील वस्तुस्थितीच्या आधारे, मी आपल्याकडे विनंती करतो/करते की:
1. वरील कलमांअंतर्गत FIR नोंदवली जावी
2. सखोल तपास केला जावा
3. आरोपीविरुद्ध योग्य कायदेशीर कारवाई करावी
4. मला FIR ची प्रत उपलब्ध करून द्यावी

मी घोषित करतो/करते की वरील माहिती माझ्या माहितीनुसार सत्य आहे.

भवदीय,

_______________________
[स्वाक्षरी]
{user_info['name']}
दिनांक: {datetime.now().strftime("%d/%m/%Y")}

संलग्नक:
1. ओळखपत्राची प्रत
2. पत्त्याचा पुरावा
3. [सहायक कागदपत्रे]

---
टीप: सर्वोच्च न्यायालयाच्या मार्गदर्शक तत्त्वांनुसार, संज्ञेय गुन्ह्यांसाठी पोलिसांनी FIR नोंदवणे आवश्यक आहे.
"""
        return marathi_fir.strip()
    
    def _format_sections_for_fir(self, sections: List[LegalSection]) -> str:
        """Format sections for FIR document"""
        
        if not sections:
            return "[To be determined by police]"
        
        formatted = []
        for i, section in enumerate(sections, 1):
            formatted.append(
                f"{i}. {section.code} - {section.title}\n"
                f"   Punishment: {section.punishment}\n"
                f"   Description: {section.description[:150]}..."
            )
        
        return "\n".join(formatted)
    
    def generate_written_complaint(
        self,
        case_details: Dict,
        sections: List[LegalSection],
        user_info: Optional[Dict] = None
    ) -> str:
        """Generate formal written complaint"""
        
        if not user_info:
            user_info = {
                "name": "[Your Name]",
                "address": "[Your Address]",
                "phone": "[Mobile]"
            }
        
        primary_section = sections[0] if sections else None
        offense_name = primary_section.title if primary_section else "Criminal Offense"
        
        complaint = f"""
WRITTEN COMPLAINT

To,
The Station House Officer (SHO)
[Police Station Name]
[Address]

Date: {datetime.now().strftime("%d/%m/%Y")}

Subject: Complaint regarding commission of offense under {', '.join([s.code for s in sections])}

Sir/Madam,

I, {user_info['name']}, resident of {user_info['address']}, hereby lodge this complaint regarding the following criminal offense:

INCIDENT DETAILS:
{case_details.get('description', '[Describe the incident in detail]')}

OFFENSE COMMITTED:
The above facts clearly show commission of offense under:
{self._format_sections_for_fir(sections)}

EVIDENCE AVAILABLE:
[List your evidence:
- Documents: _______________
- Witnesses: _______________  
- Digital proof: _______________
- Physical evidence: _______________]

REQUEST:
I request you to:
1. Register FIR immediately under the above sections
2. Investigate the matter thoroughly
3. Take appropriate action against the accused
4. Preserve all evidence related to this case

I am ready to cooperate in the investigation and provide any further information required.

Thanking you,

Yours faithfully,

_______________________
{user_info['name']}
Contact: {user_info['phone']}
Date: {datetime.now().strftime("%d/%m/%Y")}
"""
        return complaint.strip()
    
    def generate_evidence_checklist(
        self,
        sections: List[LegalSection],
        case_type: str
    ) -> Dict:
        """Generate evidence collection checklist"""
        
        is_cyber = any("IT Act" in s.code for s in sections)
        
        checklist = {
            "critical": [],
            "important": [],
            "helpful": []
        }
        
        # Critical evidence
        checklist["critical"] = [
            {
                "item": "Identity Proof",
                "examples": ["Aadhar Card", "PAN Card", "Driving License"],
                "obtained": False
            },
            {
                "item": "Address Proof", 
                "examples": ["Aadhar", "Utility Bill", "Rent Agreement"],
                "obtained": False
            }
        ]
        
        if is_cyber:
            checklist["critical"].extend([
                {
                    "item": "Screenshots of Offense",
                    "examples": ["Messages", "Posts", "Profile", "Comments"],
                    "obtained": False
                },
                {
                    "item": "Account Details",
                    "examples": ["Username", "Profile URL", "Account ID"],
                    "obtained": False
                }
            ])
        
        # Important evidence
        checklist["important"] = [
            {
                "item": "Detailed Timeline",
                "examples": ["Dates", "Times", "Sequence of events"],
                "obtained": False
            },
            {
                "item": "Witness Information",
                "examples": ["Names", "Contact details", "Written statements"],
                "obtained": False
            }
        ]
        
        # Helpful evidence
        checklist["helpful"] = [
            {
                "item": "Call/Message Records",
                "examples": ["Call logs", "SMS records", "WhatsApp chats"],
                "obtained": False
            },
            {
                "item": "CCTV Footage",
                "examples": ["Video recording", "Timestamp", "Location"],
                "obtained": False
            }
        ]
        
        return checklist
    
    def generate_affidavit(
        self,
        user_info: Dict,
        statement: str
    ) -> str:
        """Generate affidavit template"""
        
        affidavit = f"""
AFFIDAVIT

I, {user_info.get('name', '[Name]')}, aged {user_info.get('age', '[Age]')} years, 
son/daughter/wife of {user_info.get('father_name', '[Father/Husband Name]')}, 
resident of {user_info.get('address', '[Complete Address]')}, 
do hereby solemnly affirm and declare as under:

1. That I am the deponent herein and am well acquainted with the facts of the case.

2. That the facts stated hereinbelow are true to my personal knowledge and belief.

3. {statement}

4. That I have not concealed any material fact and whatever is stated above is true 
   to the best of my knowledge and belief.

DEPONENT

VERIFICATION:
I, the above named deponent, do hereby verify that the contents of paragraphs 1 to 4 
of this affidavit are true and correct to the best of my knowledge and belief and 
nothing material has been concealed therefrom.

Verified at ___________ on this _____ day of __________ 20___.


_______________________
DEPONENT

BEFORE ME:

Oath Commissioner/Notary Public
Seal & Signature
"""
        return affidavit.strip()
    
    def generate_legal_notice(
        self,
        user_info: Dict,
        recipient_info: Dict,
        demand: str,
        sections: List[LegalSection]
    ) -> str:
        """Generate legal notice template"""
        
        notice = f"""
LEGAL NOTICE
Under Section 80 of Code of Civil Procedure, 1908

To,
{recipient_info.get('name', '[Name of Person]')}
{recipient_info.get('address', '[Address]')}

Date: {datetime.now().strftime("%d/%m/%Y")}

Dear Sir/Madam,

RE: LEGAL NOTICE

Under instructions from and on behalf of my client {user_info.get('name', '[Your Name]')}, 
I hereby serve upon you the following legal notice:

1. That my client states that [describe the issue/dispute].

2. That the above acts of yours amount to offense under {', '.join([s.code for s in sections])}.

3. That my client hereby calls upon you to:
   {demand}

4. That in case you fail to comply with the above demands within 7 days from the 
   receipt of this notice, my client shall be constrained to initiate appropriate 
   legal proceedings against you without any further reference to you, and all 
   consequences thereof shall be your sole responsibility.

Take Notice thereof.

Yours faithfully,

_______________________
[Advocate Name]
[Advocate for {user_info.get('name', '[Client Name]')}]
[Enrolment No.]
[Address]
"""
        return notice.strip()