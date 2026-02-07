// API Configuration - ✅ FIXED URL
const API_BASE = import.meta.env.VITE_API_URL || 'https://legal-ai-roc4.onrender.com';

// Type Definitions matching your CrimeAnalyzer
export interface IPCSection {
  code: string;
  name: string;
  title?: string;
  description?: string;
  punishment?: string;
  bailable?: boolean;
  cognizable?: boolean;
  confidence: number;
  matchedKeywords?: string[];
  reasoning?: string;
  isPrimary?: boolean;
}

export interface AnalyzeCaseRequest {
  description: string;
  role?: 'victim' | 'accused' | 'witness';
  caseType?: string;
  urgency?: boolean;
}

export interface AnalyzeCaseResponse {
  overallConfidence: number;
  sections: IPCSection[];
  severity: string;
  maxPunishment: string;
  bail: string;
  bailProbability?: number;
  punishmentNote?: string;
  category?: string;
  explanation?: string;
  next_steps?: string[];
  warnings?: string[];
  fir_guidance?: string;
  summary?: string;
  actionPlan?: any;
  documents?: any;
}

export interface ApiError {
  detail: string;
  status: number;
}

// API Functions
export async function analyzeCase(data: AnalyzeCaseRequest): Promise<AnalyzeCaseResponse> {
  try {
    // ✨ Get user auth state from Firebase
    const { auth } = await import('./firebase');
    const user = auth.currentUser;
    
    const response = await fetch(`${API_BASE}/api/analyze-case`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: data.description,
        role: data.role || 'victim',
        urgency: data.urgency || false,
        // ✨ ADDED: Send auth data for premium features
        user_id: user?.uid || null,
        is_authenticated: !!user,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Analysis failed',
        status: response.status,
      }));
      throw new Error(errorData.detail || 'Analysis failed');
    }

    const result = await response.json();
    
    // Transform backend response to match your CrimeAnalyzer format
    return transformBackendResponse(result);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Transform backend response to match your UI expectations
function transformBackendResponse(backendData: any): AnalyzeCaseResponse {
  // Calculate overall confidence from sections
  const overallConfidence = backendData.overallConfidence 
    ? backendData.overallConfidence
    : backendData.confidence 
    ? Math.round(backendData.confidence * 100)
    : backendData.sections?.length > 0
      ? Math.round((backendData.sections.reduce((sum: number, s: any) => sum + (s.confidence || 0), 0) / backendData.sections.length))
      : 50;

  // Transform sections
  const sections: IPCSection[] = (backendData.sections || []).map((section: any, index: number) => ({
    code: section.code,
    name: section.title || section.name || 'Unknown',
    title: section.title || section.name,
    description: section.description,
    punishment: section.punishment,
    bailable: section.bailable,
    cognizable: section.cognizable,
    confidence: section.confidence || 70,
    matchedKeywords: section.matchedKeywords || extractKeywords(section.description || ''),
    reasoning: section.reasoning || section.description || 'Analysis based on provided information',
    isPrimary: section.isPrimary !== undefined ? section.isPrimary : index === 0,
  }));

  // Use backend values or calculate
  const severity = backendData.severity || (overallConfidence >= 80 ? 'High' : overallConfidence >= 60 ? 'Moderate' : 'Low');
  const maxPunishment = backendData.maxPunishment || sections[0]?.punishment || 'Varies by case';
  const bail = backendData.bail || (sections[0]?.bailable ? 'Bailable' : sections[0]?.bailable === false ? 'Non-Bailable' : 'To be determined');
  const bailProbability = backendData.bailProbability || (sections[0]?.bailable ? 75 : 30);

  return {
    overallConfidence,
    sections,
    severity,
    maxPunishment,
    bail,
    bailProbability,
    punishmentNote: backendData.punishmentNote || 'Based on Indian Penal Code provisions',
    category: backendData.category,
    explanation: backendData.explanation,
    next_steps: backendData.nextSteps || backendData.next_steps,
    warnings: backendData.warnings,
    fir_guidance: backendData.fir_guidance,
    summary: backendData.summary,
    actionPlan: backendData.actionPlan,
    documents: backendData.documents,
  };
}

// Helper to extract keywords from description
function extractKeywords(text: string): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !commonWords.includes(w));
  return [...new Set(words)].slice(0, 5);
}

// Health Check (optional but useful)
export async function healthCheck(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Health Check Error:', error);
    throw error;
  }
}

// Export API_BASE for debugging purposes
export { API_BASE };