import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface VictoryPredictionProps {
  prediction: {
    victoryChance: number;
    partialVictoryChance: number;
    lossChance: number;
    verdict: string;
    confidence: string;
    confidenceColor: string;
    successFactors: string[];
    riskFactors: string[];
    recommendation: string;
    detailedAnalysis: {
      convictionProbability: number;
      settlementProbability: number;
      dismissalProbability: number;
      acquittalProbability: number;
    };
    improvementTips: string[];
  };
}

const VictoryPrediction = ({ prediction }: VictoryPredictionProps) => {
  const getColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Verdict Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Case Victory Prediction</h3>
            <Badge className={`${getConfidenceColor(prediction.confidenceColor)} border-2 px-4 py-2 text-sm font-semibold`}>
              {prediction.confidence} CONFIDENCE
            </Badge>
          </div>
          
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <div className={`text-6xl font-black ${getColor(prediction.victoryChance)} mb-2`}>
                {prediction.victoryChance}%
              </div>
              <div className="text-xl font-semibold text-gray-700">
                Chance of Victory
              </div>
            </motion.div>
          </div>

          <div className="text-center mb-4">
            <div className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${getConfidenceColor(prediction.confidenceColor)}`}>
              {prediction.verdict}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <p className="text-sm font-medium text-gray-700 flex items-start gap-2">
              <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>{prediction.recommendation}</span>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Outcome Probabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Detailed Outcome Analysis</h4>
          
          <div className="space-y-4">
            {/* Victory */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Full Victory (Conviction)</span>
                </div>
                <span className="text-green-600 font-bold">{prediction.victoryChance}%</span>
              </div>
              <Progress value={prediction.victoryChance} className="h-3 bg-gray-200" />
            </div>

            {/* Partial Victory */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Partial Victory (Settlement)</span>
                </div>
                <span className="text-blue-600 font-bold">{prediction.partialVictoryChance}%</span>
              </div>
              <Progress value={prediction.partialVictoryChance} className="h-3 bg-gray-200" />
            </div>

            {/* Loss */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-900">Unfavorable Outcome</span>
                </div>
                <span className="text-red-600 font-bold">{prediction.lossChance}%</span>
              </div>
              <Progress value={prediction.lossChance} className="h-3 bg-gray-200" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Success & Risk Factors */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Success Factors */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-6 border-green-200 bg-green-50/50">
            <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Strengths of Your Case
            </h4>
            <ul className="space-y-2">
              {prediction.successFactors.map((factor, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-green-800"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Risk Factors */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-6 border-orange-200 bg-orange-50/50">
            <h4 className="text-lg font-bold text-orange-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Areas of Concern
            </h4>
            <ul className="space-y-2">
              {prediction.riskFactors.map((factor, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-orange-800"
                >
                  <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Improvement Tips */}
      {prediction.improvementTips && prediction.improvementTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="p-6 border-blue-200 bg-blue-50/50">
            <h4 className="text-lg font-bold text-blue-900 mb-4">💡 How to Improve Your Chances</h4>
            <div className="space-y-2">
              {prediction.improvementTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white p-3 rounded-lg border border-blue-200"
                >
                  <p className="text-sm font-medium text-blue-900">{tip}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VictoryPrediction;
