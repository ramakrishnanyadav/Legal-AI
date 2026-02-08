import json
import re
from typing import Optional, List, Dict
import traceback

from app.core.config import settings
from app.models.section import LegalSection
from app.models.shared import Classification

# ADD VALIDATOR IMPORT
from app.services.validator import SectionValidator

# =========================
# PROVIDER AVAILABILITY
# =========================
PROVIDERS_AVAILABLE = {}

# OpenAI / DeepSeek
try:
    from openai import OpenAI
    PROVIDERS_AVAILABLE["openai"] = True
    PROVIDERS_AVAILABLE["deepseek"] = True
except ImportError:
    PROVIDERS_AVAILABLE["openai"] = False
    PROVIDERS_AVAILABLE["deepseek"] = False

# Gemini (NEW SDK)
try:
    from google import genai
    from google.genai import types
    PROVIDERS_AVAILABLE["gemini"] = True
except ImportError:
    PROVIDERS_AVAILABLE["gemini"] = False

# Anthropic
try:
    import anthropic
    PROVIDERS_AVAILABLE["anthropic"] = True
except ImportError:
    PROVIDERS_AVAILABLE["anthropic"] = False


# =========================
# MAIN ANALYZER
# =========================
class MultiProviderAnalyzer:
    """
    Multi-provider AI analyzer with strict legal reasoning
    """

    def __init__(self):
        self.providers: List[Dict] = []
        self.active_provider: Optional[str] = None
        
        # INITIALIZE VALIDATOR
        self.validator = SectionValidator()

        print("\n" + "=" * 60)
        print("🤖 Initializing Multi-Provider AI System")
        print("=" * 60)

        # Initialize all providers
        self._init_gemini()
        self._init_deepseek()
        self._init_openai()
        self._init_anthropic()

        # Sort by priority from config
        if self.providers and hasattr(settings, 'AI_PROVIDERS'):
            try:
                self.providers.sort(
                    key=lambda p: settings.AI_PROVIDERS.index(p["name"])
                )
            except (ValueError, AttributeError):
                pass

        if self.providers:
            print(f"\n✅ {len(self.providers)} AI provider(s) available")
            print(f"📋 Priority order: {[p['name'] for p in self.providers]}")
        else:
            print("\n⚠️ No AI providers available - using keyword-only mode")

        print("=" * 60 + "\n")

    # =========================
    # JSON REPAIR HELPERS
    # =========================
    def _repair_json(self, text: str) -> str:
        """
        Repair common JSON issues from AI responses
        """
        # Remove markdown code blocks
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Extract JSON from text
        if "{" in text:
            start = text.find("{")
            # Find the matching closing brace
            brace_count = 0
            end = start
            for i in range(start, len(text)):
                if text[i] == '{':
                    brace_count += 1
                elif text[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end = i + 1
                        break
            
            if end > start:
                text = text[start:end]
        
        # Handle truncated responses - add closing braces if needed
        open_braces = text.count('{') - text.count('}')
        open_brackets = text.count('[') - text.count(']')
        
        if open_brackets > 0:
            text = text.rstrip(',\n ') + ']' * open_brackets
        if open_braces > 0:
            text = text.rstrip(',\n ') + '}' * open_braces
        
        # Fix trailing commas
        text = re.sub(r',(\s*[}\]])', r'\1', text)
        
        # Fix multiple consecutive commas
        text = re.sub(r',\s*,', r',', text)
        
        return text

    def _safe_json_parse(self, text: str) -> Optional[Dict]:
        """
        Safely parse JSON with multiple repair attempts
        """
        # Attempt 1: Direct parse
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
        
        # Attempt 2: Repair and parse
        try:
            repaired = self._repair_json(text)
            return json.loads(repaired)
        except json.JSONDecodeError:
            pass
        
        # Attempt 3: Try to salvage partial JSON
        try:
            # Find the main JSON structure
            if '"primary_sections"' in text:
                # Create minimal valid structure
                minimal = {
                    "case_nature": "criminal",
                    "case_nature_reasoning": "Partial response",
                    "primary_sections": [],
                    "conditional_sections": [],
                    "rejected_sections": [],
                    "overall_confidence": 0.5
                }
                
                # Try to extract what we can
                repaired = self._repair_json(text)
                parsed = json.loads(repaired)
                
                # Merge with minimal structure
                if isinstance(parsed, dict):
                    minimal.update(parsed)
                return minimal
        except:
            pass
        
        return None

    # =========================
    # PROVIDER INITIALIZATION
    # =========================
    def _init_gemini(self):
        """Initialize Google Gemini"""
        if not settings.GEMINI_API_KEY or not PROVIDERS_AVAILABLE["gemini"]:
            return

        try:
            from google import genai
            
            client = genai.Client(api_key=settings.GEMINI_API_KEY)

            self.providers.append({
                "name": "gemini",
                "client": client,
                "model": settings.GEMINI_MODEL,
                "type": "gemini",
                "cost": "free"
            })

            print(f"✅ Gemini initialized ({settings.GEMINI_MODEL})")
            print(f"   💰 Cost: Free tier available")
            
        except Exception as e:
            print(f"❌ Gemini init failed: {e}")

    def _init_deepseek(self):
        """Initialize DeepSeek"""
        if not settings.DEEPSEEK_API_KEY or not PROVIDERS_AVAILABLE["deepseek"]:
            return

        try:
            client = OpenAI(
                api_key=settings.DEEPSEEK_API_KEY,
                base_url="https://api.deepseek.com"
            )

            self.providers.append({
                "name": "deepseek",
                "client": client,
                "model": settings.DEEPSEEK_MODEL,
                "type": "openai-compatible",
                "cost": "ultra-cheap"
            })

            print(f"✅ DeepSeek initialized ({settings.DEEPSEEK_MODEL})")
            print(f"   💰 Cost: $0.14/1M tokens")
            
        except Exception as e:
            print(f"❌ DeepSeek init failed: {e}")

    def _init_openai(self):
        """Initialize OpenAI"""
        if not settings.OPENAI_API_KEY or not PROVIDERS_AVAILABLE["openai"]:
            return

        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)

            self.providers.append({
                "name": "openai",
                "client": client,
                "model": settings.OPENAI_MODEL,
                "type": "openai",
                "cost": "cheap"
            })

            print(f"✅ OpenAI initialized ({settings.OPENAI_MODEL})")
            print(f"   💰 Cost: $0.15-0.60/1M tokens")
            
        except Exception as e:
            print(f"❌ OpenAI init failed: {e}")

    def _init_anthropic(self):
        """Initialize Anthropic Claude"""
        if not settings.ANTHROPIC_API_KEY or not PROVIDERS_AVAILABLE["anthropic"]:
            return

        try:
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

            self.providers.append({
                "name": "anthropic",
                "client": client,
                "model": settings.ANTHROPIC_MODEL,
                "type": "anthropic",
                "cost": "expensive"
            })

            print(f"✅ Anthropic initialized ({settings.ANTHROPIC_MODEL})")
            print(f"   💰 Cost: $3-15/1M tokens")
            
        except Exception as e:
            print(f"❌ Anthropic init failed: {e}")

    # =========================
    # CORE ANALYSIS
    # =========================
    def analyze(
        self,
        description: str,
        classification: Classification,
        keyword_sections: List[LegalSection]
    ) -> dict:
        """
        Main analysis method with hybrid approach and validation
        """
        
        # No AI providers available - use keywords only
        if not self.providers:
            validation_result = None
            if keyword_sections:
                validation_result = self.validator.validate_sections(
                    description,
                    keyword_sections,
                    classification
                )
                keyword_sections = validation_result["valid_sections"]
            
            return {
                "sections": keyword_sections,
                "confidence": classification.confidence if keyword_sections else 0.3,
                "method": "keyword_only",
                "warnings": ["No AI providers available"],
                "provider_used": None,
                "validation_result": validation_result
            }

        # No keyword matches - use AI only
        if not keyword_sections:
            print(f"\n📊 No keyword matches - using AI-only analysis")
            return self._ai_only_analysis(description, classification)

        # Keywords found - validate with AI
        print(f"\n📊 Keywords found - using hybrid validation")
        return self._hybrid_validation(description, classification, keyword_sections)

    # =========================
    # AI CALL WITH FALLBACK
    # =========================
    def _call_ai_with_fallback(self, prompt: str, system_prompt: str) -> Optional[Dict]:
        """
        Try each provider until one succeeds
        """
        for provider in self.providers:
            try:
                print(f"\n🤖 Trying {provider['name'].upper()}...")
                
                result = self._call_single_provider(provider, prompt, system_prompt)

                if result:
                    self.active_provider = provider["name"]
                    print(f"✅ {provider['name'].upper()} succeeded!")
                    print(f"   Response length: {len(result)} chars")
                    
                    return {
                        "text": result,
                        "provider": provider["name"]
                    }

            except Exception as e:
                print(f"❌ {provider['name'].upper()} failed: {e}")
                if settings.DEBUG:
                    print(f"   Traceback: {traceback.format_exc()}")

        print(f"\n❌ All {len(self.providers)} AI provider(s) failed")
        return None

    def _call_single_provider(
        self,
        provider: Dict,
        prompt: str,
        system_prompt: str
    ) -> Optional[str]:
        """
        Call a single AI provider
        """
        
        client = provider["client"]
        model = provider["model"]
        provider_type = provider["type"]

        # Gemini - WITH PROPER TOKEN LIMIT
        if provider_type == "gemini":
            from google.genai import types
            
            full_prompt = f"{system_prompt}\n\n{prompt}"
            
            print(f"   Model: {model}")
            print(f"   Prompt length: {len(full_prompt)} chars")

            # Use 8192 tokens to ensure complete response
            response = client.models.generate_content(
                model=model,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1,
                    max_output_tokens=4096,
                    response_mime_type="application/json"
                )
            )
            
            if not response or not response.text:
                print(f"   ⚠️ Empty response from Gemini")
                return None
            
            return response.text

        # OpenAI / DeepSeek
        if provider_type in ("openai", "openai-compatible"):
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=4000,
                response_format={"type": "json_object"}
            )
            return response.choices[0].message.content

        # Anthropic
        if provider_type == "anthropic":
            response = client.messages.create(
                model=model,
                max_tokens=4000,
                system=system_prompt,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text

        return None

    # =========================
    # SYSTEM PROMPT
    # =========================
    def _get_strict_system_prompt(self) -> str:
        """
        Strict legal reasoning system prompt
        """
        return """You are a Senior Indian Criminal Law Reasoning Engine.

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON
- No markdown code blocks (no ```json```)
- No text before or after JSON
- Ensure complete response (don't truncate)

JSON STRUCTURE:
{
  "case_nature": "criminal|civil|mixed|insufficient",
  "case_nature_reasoning": "Brief explanation",
  "primary_sections": [
    {
      "code": "IPC 503",
      "title": "Criminal Intimidation",
      "description": "Threatening with injury",
      "punishment": "Up to 2 years or fine",
      "bailable": true,
      "cognizable": true,
      "confidence": 0.85,
      "reasoning": "Why this applies",
      "key_factors": ["threat", "fear"]
    }
  ],
  "conditional_sections": [],
  "rejected_sections": [],
  "overall_confidence": 0.85
}

RULES:
1. IPC 420 requires deception AT INCEPTION
2. Physical theft = IPC 379
3. Digital theft = IT Act 66C
4. Money disputes without inception deception = civil matter
5. When unsure, mark as conditional or rejected"""

    # =========================
    # AI ONLY ANALYSIS
    # =========================
    def _ai_only_analysis(self, description: str, classification: Classification) -> dict:
        """
        AI-only analysis when no keyword matches found
        """
        
        print(f"   Description: {description[:100]}...")
        print(f"   Category: {classification.category}")
        print(f"   Severity: {classification.severity}")
        
        system_prompt = self._get_strict_system_prompt()

        prompt = f"""Analyze this legal situation under Indian law.

SITUATION: "{description}"

PRELIMINARY CLASSIFICATION:
- Category: {classification.category}
- Severity: {classification.severity}

Return complete valid JSON with primary_sections, conditional_sections, and rejected_sections."""

        ai_response = self._call_ai_with_fallback(prompt, system_prompt)

        if not ai_response:
            print(f"\n❌ No AI response received")
            return {
                "sections": [],
                "confidence": 0.0,
                "method": "ai_failed",
                "warnings": ["All AI providers failed"],
                "provider_used": None,
                "validation_result": None
            }

        print(f"\n📥 AI Response from {ai_response['provider']}")

        # Parse JSON safely
        data = self._safe_json_parse(ai_response["text"])
        
        if not data:
            print(f"\n❌ JSON parse failed - falling back to keyword analysis")
            # Fallback: Try keyword matching as backup
            from app.services.keyword_matcher import KeywordMatcher
            keyword_matcher = KeywordMatcher()
            fallback_sections = keyword_matcher.match_sections(description, classification)
            
            if fallback_sections:
                print(f"✅ Keyword fallback found {len(fallback_sections)} sections")
                return {
                    "sections": fallback_sections,
                    "confidence": classification.confidence * 0.7,
                    "method": "keyword_fallback",
                    "warnings": ["AI response parsing failed - using keyword matching"],
                    "provider_used": ai_response['provider'],
                    "validation_result": None
                }
            
            print(f"⚠️ No fallback sections found either")
            return {
                "sections": [],
                "confidence": 0.0,
                "method": "json_parse_failed",
                "warnings": ["Failed to parse AI response and no keyword matches found"],
                "provider_used": ai_response['provider'],
                "validation_result": None
            }

        print(f"✅ JSON parsed successfully!")
        
        # Extract sections
        case_nature = data.get("case_nature", "criminal")
        sections_data = data.get("primary_sections", [])
        
        print(f"   Case nature: {case_nature}")
        print(f"   Primary sections: {len(sections_data)}")
        
        if not sections_data:
            print(f"⚠️ No primary sections found")
            return {
                "sections": [],
                "confidence": 0.0,
                "method": "ai_no_sections",
                "warnings": [data.get("case_nature_reasoning", "No applicable sections")],
                "provider_used": ai_response['provider'],
                "validation_result": None,
                "case_nature": case_nature
            }
        
        # Create LegalSection objects
        sections = []
        for section_data in sections_data:
            try:
                section = LegalSection(**section_data)
                sections.append(section)
            except Exception as e:
                print(f"   ❌ Failed to create section: {e}")

        # Validate sections
        validation_result = None
        if sections:
            print(f"\n🔍 Validating {len(sections)} sections...")
            try:
                validation_result = self.validator.validate_sections(
                    description, 
                    sections, 
                    classification
                )
                sections = validation_result["valid_sections"]
                print(f"✅ After validation: {len(sections)} sections")
            except Exception as e:
                print(f"❌ Validation failed: {e}")

        return {
            "sections": sections,
            "confidence": data.get("overall_confidence", 0.5),
            "method": "ai_only",
            "warnings": [f"Analyzed by {ai_response['provider'].upper()}"],
            "provider_used": ai_response['provider'],
            "validation_result": validation_result,
            "case_nature": case_nature
        }

    # =========================
    # HYBRID VALIDATION
    # =========================
    def _hybrid_validation(
        self,
        description: str,
        classification: Classification,
        keyword_sections: List[LegalSection]
    ) -> dict:
        """
        AI validates keyword matches
        """
        
        print(f"   Keyword sections: {len(keyword_sections)}")

        system_prompt = self._get_strict_system_prompt()

        sections_text = "\n".join(
            f"- {s.code}: {s.title}"
            for s in keyword_sections
        )

        prompt = f"""Validate these keyword-matched sections.

SITUATION: "{description}"

KEYWORD SECTIONS:
{sections_text}

Return complete JSON with validated primary_sections."""

        ai_response = self._call_ai_with_fallback(prompt, system_prompt)

        if not ai_response:
            print(f"\n⚠️ AI unavailable - using keywords with validation")
            validation_result = self.validator.validate_sections(
                description,
                keyword_sections,
                classification
            )
            return {
                "sections": validation_result["valid_sections"],
                "confidence": classification.confidence,
                "method": "keyword_validated",
                "warnings": ["AI unavailable"],
                "provider_used": None,
                "validation_result": validation_result
            }

        print(f"\n📥 Validation from {ai_response['provider']}")

        data = self._safe_json_parse(ai_response["text"])
        
        if not data:
            validation_result = self.validator.validate_sections(
                description,
                keyword_sections,
                classification
            )
            return {
                "sections": validation_result["valid_sections"],
                "confidence": classification.confidence,
                "method": "keyword_validated",
                "warnings": ["AI parsing failed"],
                "provider_used": ai_response['provider'],
                "validation_result": validation_result
            }
        
        sections_data = data.get("primary_sections", [])
        sections = []
        for s in sections_data:
            try:
                sections.append(LegalSection(**s))
            except:
                pass
        
        # Final validation
        if sections:
            validation_result = self.validator.validate_sections(
                description,
                sections,
                classification
            )
            sections = validation_result["valid_sections"]
        else:
            validation_result = None
        
        print(f"✅ Validated {len(sections)} sections")

        return {
            "sections": sections,
            "confidence": data.get("overall_confidence", 0.7),
            "method": "hybrid_validated",
            "warnings": [f"Validated by {ai_response['provider'].upper()}"],
            "provider_used": ai_response['provider'],
            "validation_result": validation_result
        }


# Backward compatibility
HybridAnalyzer = MultiProviderAnalyzer