import { motion } from 'framer-motion';
import { Clock, Calendar, Zap, TrendingUp, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface DurationEstimateProps {
  estimate: {
    totalDuration: {
      minimum: string;
      maximum: string;
      average: string;
      mostLikely: string;
    };
    phaseBreakdown: Array<{
      phase: string;
      duration: string;
      description: string;
      canExpedite: boolean;
      expediteTip: string;
    }>;
    factorsAffectingDuration: string[];
    expeditingOptions: Array<{
      option: string;
      applicable: boolean;
      benefit: string;
      requirement: string;
    }>;
    settlementTimeline: {
      mediation: string;
      compromise: string;
      civilSuit: string;
    };
  };
}

const DurationEstimate = ({ estimate }: DurationEstimateProps) => {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Case Duration Estimate</h3>
              <p className="text-sm text-gray-600">Expected timeline from FIR to resolution</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <div className="text-xs font-semibold text-purple-600 mb-1">BEST CASE</div>
              <div className="text-2xl font-black text-purple-900">{estimate.totalDuration.minimum}</div>
            </div>
            <div className="bg-purple-600 p-4 rounded-lg border-2 border-purple-700 shadow-lg">
              <div className="text-xs font-semibold text-purple-100 mb-1">MOST LIKELY</div>
              <div className="text-2xl font-black text-white">{estimate.totalDuration.average}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <div className="text-xs font-semibold text-purple-600 mb-1">WORST CASE</div>
              <div className="text-2xl font-black text-purple-900">{estimate.totalDuration.maximum}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Phase Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Phase-by-Phase Timeline
          </h4>

          <div className="space-y-4">
            {estimate.phaseBreakdown.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-gray-900">{phase.phase}</h5>
                        <Badge variant="outline" className="ml-2">
                          {phase.duration}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                      
                      {phase.canExpedite && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-semibold text-green-700 mb-1">CAN BE EXPEDITED</div>
                              <div className="text-xs text-green-800">{phase.expediteTip}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < estimate.phaseBreakdown.length - 1 && (
                  <div className="ml-5 h-6 w-0.5 bg-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Expediting Options */}
      {estimate.expeditingOptions && estimate.expeditingOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="p-6 border-green-200 bg-green-50/50">
            <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Ways to Speed Up Your Case
            </h4>
            
            <div className="space-y-3">
              {estimate.expeditingOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    option.applicable 
                      ? 'bg-white border-green-300' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-bold text-gray-900">{option.option}</h5>
                    {option.applicable && (
                      <Badge className="bg-green-600 text-white">Applicable</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Benefit: </span>
                        <span className="text-gray-700">{option.benefit}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Requirement: </span>
                        <span className="text-gray-700">{option.requirement}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Factors Affecting Duration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="p-6 border-orange-200 bg-orange-50/50">
          <h4 className="text-lg font-bold text-orange-900 mb-4">⚠️ Factors That May Affect Timeline</h4>
          <ul className="grid md:grid-cols-2 gap-2">
            {estimate.factorsAffectingDuration.map((factor, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-start gap-2 text-sm text-orange-800"
              >
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full flex-shrink-0 mt-2" />
                <span>{factor}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Settlement Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="p-6 border-blue-200 bg-blue-50/50">
          <h4 className="text-lg font-bold text-blue-900 mb-4">⚡ Alternative Resolution Timelines</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-xs font-semibold text-blue-600 mb-2">MEDIATION</div>
              <div className="text-xl font-bold text-blue-900">{estimate.settlementTimeline.mediation}</div>
              <div className="text-xs text-gray-600 mt-1">Fastest resolution</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-xs font-semibold text-blue-600 mb-2">COMPROMISE (CrPC 320)</div>
              <div className="text-xl font-bold text-blue-900">{estimate.settlementTimeline.compromise}</div>
              <div className="text-xs text-gray-600 mt-1">Court-approved settlement</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-xs font-semibold text-blue-600 mb-2">CIVIL SUIT</div>
              <div className="text-xl font-bold text-blue-900">{estimate.settlementTimeline.civilSuit}</div>
              <div className="text-xs text-gray-600 mt-1">Parallel to criminal case</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DurationEstimate;
