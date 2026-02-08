import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Info, Download, Wallet } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface DetailedCostsProps {
  costs: {
    summary: {
      minimumCost: string;
      averageCost: string;
      maximumCost: string;
      note: string;
    };
    phaseWiseCosts: Array<{
      phase: string;
      items: Array<{
        item: string;
        cost: string;
        mandatory: boolean;
      }>;
      total: string;
      timeline: string;
    }>;
    additionalCosts: Array<{
      category: string;
      cost: string;
      when: string;
    }>;
    costSavingTips: string[];
    paymentStructure: {
      options: Array<{
        type: string;
        amount: string;
        pros: string;
        cons: string;
      }>;
      recommended: string;
    };
    financialAssistance: Array<{
      source: string;
      eligibility: string;
      benefit: string;
    }>;
  };
}

const DetailedCosts = ({ costs }: DetailedCostsProps) => {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Cost Estimation</h3>
              <p className="text-sm text-gray-600">Complete financial breakdown for your case</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border-2 border-emerald-200">
              <div className="text-xs font-semibold text-emerald-600 mb-1">MINIMUM</div>
              <div className="text-2xl font-black text-emerald-900">{costs.summary.minimumCost}</div>
            </div>
            <div className="bg-emerald-600 p-4 rounded-lg border-2 border-emerald-700 shadow-lg">
              <div className="text-xs font-semibold text-emerald-100 mb-1">AVERAGE (EXPECTED)</div>
              <div className="text-2xl font-black text-white">{costs.summary.averageCost}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-emerald-200">
              <div className="text-xs font-semibold text-emerald-600 mb-1">MAXIMUM</div>
              <div className="text-2xl font-black text-emerald-900">{costs.summary.maximumCost}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-emerald-200">
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{costs.summary.note}</span>
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Phase-wise Costs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Phase-by-Phase Cost Breakdown
          </h4>

          <div className="space-y-6">
            {costs.phaseWiseCosts.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gray-50 p-5 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-bold text-gray-900 text-lg">{phase.phase}</h5>
                    <p className="text-xs text-gray-500">{phase.timeline}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Total Cost</div>
                    <div className="text-xl font-black text-emerald-600">{phase.total}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {phase.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-800">{item.item}</span>
                        {item.mandatory && (
                          <Badge variant="destructive" className="text-xs px-2 py-0">
                            Required
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item.cost}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Additional Costs */}
      {costs.additionalCosts && costs.additionalCosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="p-6 border-orange-200 bg-orange-50/50">
            <h4 className="text-lg font-bold text-orange-900 mb-4">⚠️ Potential Additional Costs</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {costs.additionalCosts.map((cost, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-orange-200"
                >
                  <div className="font-bold text-gray-900 mb-1">{cost.category}</div>
                  <div className="text-sm text-emerald-700 font-semibold mb-2">{cost.cost}</div>
                  <div className="text-xs text-gray-600">{cost.when}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Cost Saving Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="p-6 border-green-200 bg-green-50/50">
          <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Money-Saving Tips
          </h4>
          <div className="space-y-2">
            {costs.costSavingTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="bg-white p-3 rounded-lg border border-green-200"
              >
                <p className="text-sm text-green-900">{tip}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Payment Structure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card className="p-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4">💳 Payment Structure Options</h4>
          
          <div className="space-y-3 mb-4">
            {costs.paymentStructure.options.map((option, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-bold text-gray-900">{option.type}</h5>
                  <Badge variant="outline">{option.amount}</Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-start gap-1">
                    <span className="text-green-600 font-semibold">Pros:</span>
                    <span className="text-gray-700">{option.pros}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="text-red-600 font-semibold">Cons:</span>
                    <span className="text-gray-700">{option.cons}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm font-medium text-emerald-900">
              ✅ <strong>Recommended:</strong> {costs.paymentStructure.recommended}
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Financial Assistance */}
      {costs.financialAssistance && costs.financialAssistance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="p-6 border-blue-200 bg-blue-50/50">
            <h4 className="text-lg font-bold text-blue-900 mb-4">🤝 Financial Assistance Options</h4>
            <div className="space-y-3">
              {costs.financialAssistance.map((assistance, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-blue-200"
                >
                  <div className="font-bold text-gray-900 mb-2">{assistance.source}</div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Eligibility: </span>
                      <span className="text-gray-900 font-medium">{assistance.eligibility}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Benefit: </span>
                      <span className="text-blue-700 font-medium">{assistance.benefit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DetailedCosts;
