import { TrendingUp, Clock, DollarSign } from 'lucide-react';

export const PremiumFeatureCards = ({ actionPlan }: { actionPlan: any }) => {
  const vp = actionPlan?.victoryPrediction;
  const de = actionPlan?.durationEstimate;
  const dc = actionPlan?.detailedCosts;

  if (!vp && !de && !dc) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {vp && (
        <div className="p-6 rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-700">Victory Chance</h3>
          </div>
          <div className="text-6xl font-black text-green-600 mb-2">{vp.victoryChance}%</div>
          <div className="text-sm font-semibold text-green-700">{vp.verdict}</div>
        </div>
      )}
      
      {de && (
        <div className="p-6 rounded-xl border-2 border-purple-500 bg-purple-50 dark:bg-purple-950">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-700">Duration</h3>
          </div>
          <div className="text-5xl font-black text-purple-600 mb-2">{de.totalDuration?.average}</div>
          <div className="text-xs text-purple-600">{de.totalDuration?.minimum} - {de.totalDuration?.maximum}</div>
        </div>
      )}
      
      {dc && (
        <div className="p-6 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-emerald-700">Cost</h3>
          </div>
          <div className="text-5xl font-black text-emerald-600 mb-2">{dc.summary?.averageCost}</div>
          <div className="text-xs text-emerald-600">{dc.summary?.minimumCost} - {dc.summary?.maximumCost}</div>
        </div>
      )}
    </div>
  );
};
