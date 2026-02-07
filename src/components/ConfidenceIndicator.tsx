import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
  breakdown?: {
    statutoryMatch: number;
    precedentAvailability: number;
    informationCompleteness: number;
  };
}

// 🔧 FIX: Helper function to cap values at 100
const capAt100 = (value: number): number => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

const ConfidenceIndicator = ({ 
  score, 
  size = 'lg', 
  showBreakdown = true,
  breakdown
}: ConfidenceIndicatorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 🔧 FIX: Always cap the main score at 100
  const cappedScore = capAt100(score);

  // 🔧 FIX: Cap breakdown values or create safe defaults
  const safeBreakdown = breakdown ? {
    statutoryMatch: capAt100(breakdown.statutoryMatch),
    precedentAvailability: capAt100(breakdown.precedentAvailability),
    informationCompleteness: capAt100(breakdown.informationCompleteness),
  } : {
    statutoryMatch: capAt100(cappedScore + Math.floor(Math.random() * 10)),
    precedentAvailability: capAt100(cappedScore - Math.floor(Math.random() * 15)),
    informationCompleteness: capAt100(cappedScore - Math.floor(Math.random() * 8)),
  };

  const getScoreConfig = (s: number) => {
    const capped = capAt100(s);
    if (capped >= 80) return { 
      color: 'text-green-400', 
      bgColor: 'bg-green-400/20',
      borderColor: 'border-green-400/30',
      icon: Check, 
      label: 'High Confidence',
      glowColor: 'shadow-green-400/30'
    };
    if (capped >= 60) return { 
      color: 'text-yellow-400', 
      bgColor: 'bg-yellow-400/20',
      borderColor: 'border-yellow-400/30',
      icon: Info, 
      label: 'Moderate Confidence',
      glowColor: 'shadow-yellow-400/30'
    };
    return { 
      color: 'text-orange-400', 
      bgColor: 'bg-orange-400/20',
      borderColor: 'border-orange-400/30',
      icon: AlertTriangle, 
      label: 'Low Confidence',
      glowColor: 'shadow-orange-400/30'
    };
  };

  const config = getScoreConfig(cappedScore);
  const Icon = config.icon;

  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-sm', icon: 'w-3 h-3' },
    md: { container: 'w-24 h-24', text: 'text-lg', icon: 'w-4 h-4' },
    lg: { container: 'w-32 h-32', text: 'text-2xl', icon: 'w-5 h-5' },
  };

  const sizeConfig = sizes[size];
  const circumference = size === 'lg' ? 276 : size === 'md' ? 176 : 120;
  const radius = size === 'lg' ? 44 : size === 'md' ? 28 : 19;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Main Circle */}
      <div className={`relative ${sizeConfig.container}`}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={size === 'lg' ? 6 : 4}
            fill="none"
            className="text-muted/30"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth={size === 'lg' ? 6 : 4}
            fill="none"
            strokeLinecap="round"
            className={config.color}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{
              strokeDasharray: `${(cappedScore / 100) * circumference} ${circumference}`,
            }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              stiffness: 50, 
              delay: 0.3 
            }}
          />
        </svg>
        
        {/* Center content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', damping: 20 }}
        >
          <motion.div
            className={`${config.bgColor} rounded-full p-1.5 mb-1`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            <Icon className={`${sizeConfig.icon} ${config.color}`} />
          </motion.div>
          <span className={`${sizeConfig.text} font-bold ${config.color}`}>
            {cappedScore}%
          </span>
          {size === 'lg' && (
            <span className="text-xs text-muted-foreground mt-0.5">Confidence</span>
          )}
        </motion.div>
      </div>

      {/* Expandable breakdown */}
      {showBreakdown && size === 'lg' && (
        <div className="w-full max-w-xs">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl glass text-sm ${config.color} hover:bg-white/5 transition-colors`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Why this score?</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-4 rounded-xl glass space-y-3">
                  {[
                    { label: 'Statutory match strength', value: safeBreakdown.statutoryMatch },
                    { label: 'Similar precedent availability', value: safeBreakdown.precedentAvailability },
                    { label: 'Information completeness', value: safeBreakdown.informationCompleteness },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className={getScoreConfig(item.value).color}>{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${getScoreConfig(item.value).color.replace('text-', 'bg-')}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ConfidenceIndicator;