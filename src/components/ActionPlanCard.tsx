import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Shield,
  Smartphone,
  Camera,
  Flag,
  Briefcase,
  Hospital,
  Target,
  Info,
  Lightbulb
} from 'lucide-react';

const iconMap: Record<string, any> = {
  'shield-alert': Shield,
  'hospital': Hospital,
  'smartphone': Smartphone,
  'camera': Camera,
  'flag': Flag,
  'file-text': FileText,
  'briefcase': Briefcase,
  'users': Users,
};

interface ActionStep {
  priority: number;
  action: string;
  description: string;
  deadline: string;
  icon: string;
}

interface DocumentationItem {
  category: string;
  items: Array<{
    name: string;
    required: boolean;
    obtained: boolean;
  }>;
}

interface LegalStrategy {
  primaryApproach: string;
  reasoning: string;
  strengthOfCase: string;
  recommendedAction: string;
  prosecutionProbability: number;
}

interface RiskAssessment {
  successProbability: number;
  convictionChance: number;
  strengths: string[];
  risks: string[];
  criticalFactors: string[];
  recommendation: string;
}

interface ActionPlan {
  immediateSteps: ActionStep[];
  documentationNeeded: DocumentationItem[];
  legalStrategy: LegalStrategy;
  estimatedTimeline: {
    phases: Array<{
      phase: string;
      duration: string;
      description: string;
    }>;
    totalEstimate: string;
  };
  costEstimate: {
    breakdown: Array<{
      stage: string;
      cost: string;
      description: string;
    }>;
    minimumEstimate: string;
    maximumEstimate: string;
    averageEstimate: string;
    note?: string; // Γ£à FIXED: Made note optional
  };
  riskAssessment: RiskAssessment;
  alternativeOptions: Array<{
    option: string;
    description: string;
    pros: string[];
    cons: string[];
    suitability: string;
    estimatedTime: string;
    estimatedCost: string;
  }>;
  urgencyLevel: string;
  nextStepDeadline: string;
}

interface ActionPlanCardProps {
  actionPlan: ActionPlan;
}

const ActionPlanCard = ({ actionPlan }: ActionPlanCardProps) => {
  const [expandedSection, setExpandedSection] = useState<string>('steps');
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  // ✨ Extract premium features
  const victoryPrediction = (actionPlan as any)?.victoryPrediction;
  const durationEstimate = (actionPlan as any)?.durationEstimate;
  const detailedCosts = (actionPlan as any)?.detailedCosts;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const toggleDoc = (category: string, itemName: string) => {
    const key = `${category}-${itemName}`;
    const newChecked = new Set(checkedDocs);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedDocs(newChecked);
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'border-red-500 bg-red-500/10';
    if (priority === 2) return 'border-yellow-500 bg-yellow-500/10';
    return 'border-blue-500 bg-blue-500/10';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return 'CRITICAL';
    if (priority === 2) return 'HIGH';
    return 'MEDIUM';
  };

  const getUrgencyColor = (level: string) => {
    if (level === 'HIGH') return 'bg-red-500';
    if (level === 'MEDIUM') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getStrengthColor = (strength: string) => {
    if (strength.includes('Strong')) return 'text-green-400';
    if (strength.includes('Medium')) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSuitabilityColor = (suitability: string) => {
    if (suitability === 'HIGH') return 'text-green-400';
    if (suitability === 'MEDIUM') return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* ✨ PREMIUM FEATURES Display */}
      {(victoryPrediction || durationEstimate || detailedCosts) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {victoryPrediction && (
            <div className="glass rounded-2xl p-6 border-2 border-green-500/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-green-600">Victory Chance</h3>
              </div>
              <div className="text-6xl font-black text-green-600 text-center mb-2">
                {victoryPrediction.victoryChance}%
              </div>
              <div className="text-center text-sm font-semibold text-green-700">
                {victoryPrediction.verdict}
              </div>
            </div>
          )}
          {durationEstimate && (
            <div className="glass rounded-2xl p-6 border-2 border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-purple-600">Duration</h3>
              </div>
              <div className="text-5xl font-black text-purple-600 text-center mb-2">
                {durationEstimate.totalDuration?.average || 'N/A'}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {durationEstimate.totalDuration?.minimum} - {durationEstimate.totalDuration?.maximum}
              </p>
            </div>
          )}
          {detailedCosts && (
            <div className="glass rounded-2xl p-6 border-2 border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-emerald-600">Cost</h3>
              </div>
              <div className="text-5xl font-black text-emerald-600 text-center mb-2">
                {detailedCosts.summary?.averageCost || 'N/A'}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {detailedCosts.summary?.minimumCost} - {detailedCosts.summary?.maximumCost}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Header with Urgency Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              <span className="gradient-text">Your Personalized Action Plan</span>
            </h2>
            <p className="text-muted-foreground">
              Step-by-step guide to handle your legal situation
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${getUrgencyColor(actionPlan.urgencyLevel)} text-white font-semibold text-sm`}>
            {actionPlan.urgencyLevel} PRIORITY
          </div>
        </div>

        {/* Next Deadline Alert */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30">
          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Next Critical Deadline</p>
            <p className="text-sm text-muted-foreground">{actionPlan.nextStepDeadline}</p>
          </div>
        </div>
      </motion.div>

      {/* Immediate Steps - Always Expanded by Default */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleSection('steps')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Immediate Action Steps</h3>
            <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              {actionPlan.immediateSteps.length} steps
            </span>
          </div>
          {expandedSection === 'steps' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'steps' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6 space-y-4">
                {actionPlan.immediateSteps.map((step, index) => {
                  const IconComponent = iconMap[step.icon] || FileText;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border-l-4 ${getPriorityColor(step.priority)}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <span className="text-xs font-semibold text-muted-foreground">
                                {getPriorityLabel(step.priority)} PRIORITY
                              </span>
                              <h4 className="font-bold text-lg mt-1">{step.action}</h4>
                            </div>
                            <div className="text-right">
                              <Clock className="w-4 h-4 inline mr-1 text-yellow-400" />
                              <span className="text-sm font-semibold text-yellow-400">
                                {step.deadline}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Documentation Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleSection('docs')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Documentation Checklist</h3>
          </div>
          {expandedSection === 'docs' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'docs' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6 space-y-6">
                {actionPlan.documentationNeeded.map((docCategory, catIndex) => (
                  <div key={catIndex}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {docCategory.category}
                    </h4>
                    <div className="space-y-2">
                      {docCategory.items.map((item: any, itemIndex: number) => {
                        const key = `${docCategory.category}-${item.name}`;
                        const isChecked = checkedDocs.has(key);
                        return (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: itemIndex * 0.05 }}
                            className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-green-500/20 border border-green-500/50'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            onClick={() => toggleDoc(docCategory.category, item.name)}
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isChecked
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-white/30'
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              {item.required && (
                                <span className="text-xs text-red-400">* Required</span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Legal Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleSection('strategy')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Legal Strategy & Risk Assessment</h3>
          </div>
          {expandedSection === 'strategy' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'strategy' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6 space-y-6">
                {/* Strategy Overview */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Primary Approach</p>
                    <p className="font-semibold">{actionPlan.legalStrategy.primaryApproach}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reasoning</p>
                    <p className="text-sm">{actionPlan.legalStrategy.reasoning}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-muted-foreground mb-1">Case Strength</p>
                      <p className={`font-bold text-lg ${getStrengthColor(actionPlan.legalStrategy.strengthOfCase)}`}>
                        {actionPlan.legalStrategy.strengthOfCase}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                      <p className="text-sm text-muted-foreground mb-1">Success Probability</p>
                      <p className="font-bold text-lg text-primary">
                        {Math.round(actionPlan.legalStrategy.prosecutionProbability * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="pt-6 border-t border-white/10">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Risk Assessment
                  </h4>
                  
                  {/* Success Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                      <p className="text-3xl font-bold text-green-400 mb-1">
                        {actionPlan.riskAssessment.successProbability}%
                      </p>
                      <p className="text-xs text-muted-foreground">Success Probability</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                      <p className="text-3xl font-bold text-blue-400 mb-1">
                        {actionPlan.riskAssessment.convictionChance}%
                      </p>
                      <p className="text-xs text-muted-foreground">Conviction Chance</p>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-green-400 mb-2">✓ Strengths</p>
                    <ul className="space-y-2">
                      {actionPlan.riskAssessment.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-yellow-400 mb-2">⚠ Risks</p>
                    <ul className="space-y-2">
                      {actionPlan.riskAssessment.risks.map((risk, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className={`p-4 rounded-xl ${
                    actionPlan.riskAssessment.recommendation === 'PROCEED'
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-yellow-500/10 border border-yellow-500/30'
                  }`}>
                    <p className="font-semibold mb-1">Recommendation</p>
                    <p className={`text-lg font-bold ${
                      actionPlan.riskAssessment.recommendation === 'PROCEED'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}>
                      {actionPlan.riskAssessment.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleSection('timeline')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Estimated Timeline</h3>
          </div>
          {expandedSection === 'timeline' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'timeline' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6">
                <div className="mb-6 text-center p-4 rounded-xl bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Total Estimated Duration</p>
                  <p className="text-xl font-bold text-primary">
                    {actionPlan.estimatedTimeline.totalEstimate}
                  </p>
                </div>

                <div className="space-y-4">
                  {actionPlan.estimatedTimeline.phases.map((phase, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        {index < actionPlan.estimatedTimeline.phases.length - 1 && (
                          <div className="w-0.5 h-full bg-white/10 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <h4 className="font-semibold mb-1">{phase.phase}</h4>
                        <p className="text-sm text-primary mb-2">{phase.duration}</p>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cost Estimate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <button
          onClick={() => toggleSection('cost')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Cost Estimate</h3>
          </div>
          {expandedSection === 'cost' ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'cost' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10"
            >
              <div className="p-6">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Minimum</p>
                    <p className="font-bold text-green-400">
                      {actionPlan.costEstimate.minimumEstimate}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">Average</p>
                    <p className="font-bold text-lg text-primary">
                      {actionPlan.costEstimate.averageEstimate}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Maximum</p>
                    <p className="font-bold text-red-400">
                      {actionPlan.costEstimate.maximumEstimate}
                    </p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3">
                  {actionPlan.costEstimate.breakdown.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold">{item.stage}</p>
                        <p className="font-bold text-primary">{item.cost}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="flex gap-2">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      {/* Γ£à FIXED: Safe access with optional chaining and fallback */}
                      {actionPlan.costEstimate.note || 'Costs vary based on lawyer experience, city, and case complexity'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Victory Prediction - Enhanced */}
      {victoryPrediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Case Victory Analysis</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Victory Percentage Card */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
              <div className="text-7xl font-black text-green-400 mb-3">
                {victoryPrediction.victoryChance}%
              </div>
              <div className="text-xl font-bold text-green-300 mb-2">
                {victoryPrediction.verdict}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on statutory match and case information
              </p>
            </div>

            {/* Strengths & Risks Column */}
            <div className="space-y-4">
              {/* Strengths Section */}
              <div className="p-5 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <p className="font-semibold text-green-400">Case Strengths</p>
                </div>
                <ul className="space-y-2">
                  {victoryPrediction.strengths?.slice(0, 3).map((strength, index) => (
                    <li key={index} className="text-sm flex items-start gap-2 text-muted-foreground">
                      <span className="text-green-400 mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks Section */}
              <div className="p-5 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <p className="font-semibold text-yellow-400">Potential Challenges</p>
                </div>
                <ul className="space-y-2">
                  {victoryPrediction.risks?.slice(0, 3).map((risk, index) => (
                    <li key={index} className="text-sm flex items-start gap-2 text-muted-foreground">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Improvement Tips */}
          {victoryPrediction.improvementTips && victoryPrediction.improvementTips.length > 0 && (
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <p className="font-semibold text-blue-400">How to Strengthen Your Case</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {victoryPrediction.improvementTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5 text-sm">•</span>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Alternative Options */}
      {actionPlan.alternativeOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => toggleSection('alternatives')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Alternative Resolution Options</h3>
            </div>
            {expandedSection === 'alternatives' ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          <AnimatePresence>
            {expandedSection === 'alternatives' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-white/10"
              >
                <div className="p-6 space-y-4">
                  {actionPlan.alternativeOptions.map((option, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">{option.option}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSuitabilityColor(option.suitability)}`}>
                          {option.suitability} SUITABILITY
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{option.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-green-400 mb-2">✓ Pros</p>
                          <ul className="space-y-1">
                            {option.pros.map((pro, i) => (
                              <li key={i} className="text-xs text-muted-foreground">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-red-400 mb-2">✗ Cons</p>
                          <ul className="space-y-1">
                            {option.cons.map((con, i) => (
                              <li key={i} className="text-xs text-muted-foreground">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{option.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span>{option.estimatedCost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ActionPlanCard;
