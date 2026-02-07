import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Scale, Sparkles, Check } from 'lucide-react';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  onComplete?: () => void;
}

const steps = [
  { id: 1, label: 'Processing description...', icon: FileText, range: [0, 25] },
  { id: 2, label: 'Identifying sections...', icon: Search, range: [25, 50] },
  { id: 3, label: 'Analyzing precedents...', icon: Scale, range: [50, 75] },
  { id: 4, label: 'Generating guidance...', icon: Sparkles, range: [75, 100] },
];

const AnalysisProgress = ({ isAnalyzing, onComplete }: AnalysisProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      setCurrentStep(0);
      setCompletedSteps([]);
      return;
    }

    // Simulate progress
    const duration = 2500; // Total analysis time
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);
        
        // Update current step based on progress
        const stepIndex = steps.findIndex(
          (step) => next >= step.range[0] && next < step.range[1]
        );
        if (stepIndex !== -1 && stepIndex !== currentStep) {
          setCurrentStep(stepIndex);
          if (stepIndex > 0) {
            setCompletedSteps((prev) => [...prev, stepIndex - 1]);
          }
        }
        
        if (next >= 100) {
          setCompletedSteps([0, 1, 2, 3]);
          clearInterval(timer);
          onComplete?.();
        }
        
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAnalyzing, onComplete]);

  if (!isAnalyzing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="my-8 p-6 rounded-2xl glass"
    >
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Analyzing...</span>
          <span className="text-primary font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, hsl(187 100% 50%), hsl(266 93% 58%))',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = completedSteps.includes(index);
          const isPending = index > currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isPending ? 0.4 : 1, 
                x: 0,
              }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isActive ? 'bg-primary/10 border border-primary/20' : 
                isCompleted ? 'bg-green-500/10' : 'bg-white/5'
              }`}
            >
              <motion.div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isCompleted ? 'bg-green-500/20' :
                  isActive ? 'bg-primary/20' : 'bg-muted/20'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                  >
                    <Check className="w-4 h-4 text-green-400" />
                  </motion.div>
                ) : (
                  <step.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </motion.div>
              
              <span className={`text-sm ${
                isActive ? 'text-primary font-medium' :
                isCompleted ? 'text-green-400' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="ml-auto flex gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AnalysisProgress;
