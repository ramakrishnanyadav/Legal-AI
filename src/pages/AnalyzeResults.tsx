// src/pages/AnalyzeResults.tsx - Enhanced Results Page with Action Plan & Documents

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Users,
  Download,
  Share2,
  CheckCircle2,
  Target,
  BookOpen,
  Briefcase,
  MapPin,
  BadgeCheck,
  MessageSquare,
  Star
} from 'lucide-react';
import ActionPlanCard from '@/components/ActionPlanCard';
import DocumentViewer from '@/components/DocumentViewer';
import AnimatedButton from '@/components/AnimatedButton';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { matchLawyers, getMatchPercentage, type Lawyer, type MatchedLawyer } from '@/lib/lawyerMatcher';
import { toast } from 'sonner';

interface Section {
  code: string;
  name: string;
  description: string;
  punishment: string;
  bailable: boolean;
  cognizable: boolean;
  confidence: number;
  isPrimary: boolean;
  reasoning: string;
  matchedKeywords: string[];
}

interface AnalysisResults {
  sections: Section[];
  severity: string;
  maxPunishment: string;
  punishmentNote: string;
  bail: string;
  bailProbability: number;
  overallConfidence: number;
  summary: string;
  nextSteps: string[];
  actionPlan?: any;
  documents?: any;
}

const AnalyzeResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results: AnalysisResults = location.state?.results;

  // 🔍 DEBUG: Log what we received on this page
  console.log('📄 AnalyzeResults Page Loaded:', {
    hasResults: !!results,
    hasActionPlan: !!results?.actionPlan,
    hasDocuments: !!results?.documents,
    resultsKeys: results ? Object.keys(results) : [],
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'action-plan' | 'documents'>('overview');
  const [recommendedLawyers, setRecommendedLawyers] = useState<MatchedLawyer[]>([]);
  const [loadingLawyers, setLoadingLawyers] = useState(true);
  const [userLocation, setUserLocation] = useState<string>(''); // ✨ NEW: Location filter
  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([]); // ✨ Store all lawyers

  // ✨ Load all lawyers once
  useEffect(() => {
    if (results?.sections) {
      loadAllLawyers();
    }
  }, [results]);

  const loadAllLawyers = async () => {
    try {
      setLoadingLawyers(true);
      
      // Fetch all active lawyers from Firestore
      const q = query(
        collection(db, 'lawyers'),
        where('active', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const lawyers: Lawyer[] = [];
      querySnapshot.forEach((doc) => {
        lawyers.push({ id: doc.id, ...doc.data() } as Lawyer);
      });

      setAllLawyers(lawyers);
    } catch (error) {
      console.error('Error loading lawyers:', error);
      toast.error('Failed to load lawyers');
    } finally {
      setLoadingLawyers(false);
    }
  };

  // ✨ Re-match lawyers when location changes
  useEffect(() => {
    if (allLawyers.length === 0 || !results?.sections) return;

    // Match lawyers based on case sections, type, and location
    const matched = matchLawyers(
      allLawyers,
      results.sections,
      location.state?.caseType,
      { 
        limit: 3, 
        minScore: 20,
        userLocation: userLocation || undefined // ✨ Pass user location for proximity bonus
      }
    );

    setRecommendedLawyers(matched);
  }, [allLawyers, results?.sections, location.state?.caseType, userLocation]);

  if (!results) {
    navigate('/analyze');
    return null;
  }

  const normalizeConfidence = (conf: number) => {
    if (conf < 1) return Math.round(conf * 100);
    return Math.min(Math.max(Math.round(conf), 0), 100);
  };

  const primarySection = results.sections.find(s => s.isPrimary) || results.sections[0];
  const relatedSections = results.sections.filter(s => !s.isPrimary);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <span className="font-bold">Analysis Complete</span>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Analysis Complete!</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            We've identified applicable laws and created your action plan
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="glass rounded-2xl p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Legal Analysis</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('action-plan')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'action-plan'
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Target className="w-5 h-5" />
              <span>Action Plan</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'documents'
                ? 'bg-primary text-white shadow-lg shadow-primary/50'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>Documents</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overall Confidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 text-center"
            >
              <p className="text-sm text-muted-foreground mb-2 text-center">Overall Confidence</p>
              <div className="text-6xl font-bold gradient-text mb-2">
                {normalizeConfidence(results.overallConfidence)}%
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Based on statutory match and case information
              </p>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Case Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">{results.summary}</p>
            </motion.div>

            {/* Primary Section - Professional Card Layout */}
            {primarySection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl overflow-hidden border border-white/10"
              >
                {/* Header Section with Icon, Title and Confidence */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-primary/30 flex items-center justify-center flex-shrink-0 border border-primary/50">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2 text-left">
                          Primary Section
                        </p>
                        <h3 className="text-3xl font-bold mb-2 text-foreground text-left">
                          {primarySection.code}
                        </h3>
                        <p className="text-xl font-medium text-foreground/90 text-left">
                          {primarySection.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-4xl font-bold gradient-text mb-1">
                        {normalizeConfidence(primarySection.confidence)}%
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Confidence
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Details Grid */}
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Description
                    </h4>
                    <p className="text-base leading-relaxed text-foreground/90">
                      {primarySection.description}
                    </p>
                  </div>

                  {/* Punishment and Bail Status - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Punishment
                      </h4>
                      <p className="text-base font-semibold text-foreground">
                        {primarySection.punishment}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Bail Status
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${primarySection.bailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <p className={`text-base font-semibold ${primarySection.bailable ? 'text-green-400' : 'text-red-400'}`}>
                          {primarySection.bailable ? 'Bailable' : 'Non-Bailable'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      AI Reasoning
                    </h4>
                    <p className="text-base leading-relaxed text-foreground/90 italic">
                      {primarySection.reasoning}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Related Sections - Professional Layout */}
            {relatedSections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Related Sections
                </h3>
                <div className="space-y-4">
                  {relatedSections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className="text-lg font-mono font-bold text-foreground mb-1">
                            {section.code}
                          </p>
                          <p className="text-base font-medium text-foreground/80">
                            {section.name}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-bold text-primary">
                            {normalizeConfidence(section.confidence)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/10">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Punishment</p>
                          <p className="text-sm font-medium">{section.punishment}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Bail Status</p>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${section.bailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <p className={`text-sm font-medium ${section.bailable ? 'text-green-400' : 'text-red-400'}`}>
                              {section.bailable ? 'Bailable' : 'Non-Bailable'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recommended Lawyers */}
            {recommendedLawyers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Recommended Lawyers
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 text-left">
                      Based on your case analysis, these specialists can help
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* ✨ NEW: Location Filter */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-white/10">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        className="bg-transparent focus:outline-none text-sm cursor-pointer"
                      >
                        <option value="" className="bg-gray-900">All Locations</option>
                        <option value="Delhi" className="bg-gray-900">Delhi</option>
                        <option value="Mumbai" className="bg-gray-900">Mumbai</option>
                        <option value="Bangalore" className="bg-gray-900">Bangalore</option>
                        <option value="Chennai" className="bg-gray-900">Chennai</option>
                        <option value="Kolkata" className="bg-gray-900">Kolkata</option>
                        <option value="Hyderabad" className="bg-gray-900">Hyderabad</option>
                        <option value="Pune" className="bg-gray-900">Pune</option>
                        <option value="Ahmedabad" className="bg-gray-900">Ahmedabad</option>
                        <option value="Jaipur" className="bg-gray-900">Jaipur</option>
                        <option value="Chandigarh" className="bg-gray-900">Chandigarh</option>
                      </select>
                    </div>
                    
                    <AnimatedButton
                      onClick={() => navigate('/lawyers')}
                      variant="ghost"
                      size="sm"
                    >
                      View All
                    </AnimatedButton>
                  </div>
                </div>

                {/* ✨ Location filter active indicator */}
                {userLocation && (
                  <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Showing lawyers in <strong>{userLocation}</strong></span>
                    </div>
                    <button
                      onClick={() => setUserLocation('')}
                      className="text-xs text-primary hover:text-primary/80 underline"
                    >
                      Clear filter
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedLawyers.map((lawyer, index) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-primary/30 cursor-pointer group"
                      onClick={() => navigate('/lawyers')}
                    >
                      {/* Match Score Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <img
                              src={lawyer.image}
                              alt={lawyer.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                            />
                            {lawyer.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <BadgeCheck className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">
                            {getMatchPercentage(lawyer.matchScore)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      </div>

                      {/* Lawyer Info */}
                      <h4 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                        {lawyer.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono mb-2">
                        Bar: {lawyer.barNumber}
                      </p>

                      {/* Match Reason */}
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {lawyer.matchReason}
                      </p>

                      {/* Relevant Areas */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {lawyer.relevantAreas.slice(0, 2).map((area) => (
                          <span
                            key={area}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {area}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/10">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {lawyer.yearsOfPractice}+ yrs
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {lawyer.city}
                        </span>
                        {lawyer.rating && (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {lawyer.rating}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <p className="text-sm text-foreground/80 mb-3">
                    Ready to consult with a specialist?
                  </p>
                  <AnimatedButton
                    onClick={() => navigate('/lawyers')}
                    variant="primary"
                    icon={<MessageSquare className="w-4 h-4" />}
                  >
                    Request Consultation
                  </AnimatedButton>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <AnimatedButton
                onClick={() => setActiveTab('action-plan')}
                variant="primary"
                className="flex-1"
                icon={<Target className="w-5 h-5" />}
              >
                View Action Plan
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setActiveTab('documents')}
                variant="secondary"
                className="flex-1"
                icon={<Download className="w-5 h-5" />}
              >
                Download Documents
              </AnimatedButton>
              <AnimatedButton
                onClick={() => navigate('/lawyers')}
                variant="secondary"
                className="flex-1"
                icon={<Users className="w-5 h-5" />}
              >
                Find Lawyers
              </AnimatedButton>
            </motion.div>
          </div>
        )}

        {activeTab === 'action-plan' && results.actionPlan && (
          <ActionPlanCard actionPlan={results.actionPlan} />
        )}

        {activeTab === 'documents' && (
          <>
            {results.documents ? (
              <DocumentViewer documents={results.documents} />
            ) : (
              <div className="glass rounded-2xl p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Documents Not Available</h3>
                <p className="text-muted-foreground mb-4">
                  Premium document generation is only available for logged-in users.
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Login to access FIR drafts, written complaints, and evidence checklists.
                </p>
              </div>
            )}
          </>
        )}

        {/* No Action Plan Message */}
        {activeTab === 'action-plan' && !results.actionPlan && (
          <div className="glass rounded-2xl p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Action Plan Not Available</h3>
            <p className="text-muted-foreground mb-4">
              Premium action plan is only available for logged-in users.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Login to access personalized action plans with timelines and costs.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AnalyzeResults;