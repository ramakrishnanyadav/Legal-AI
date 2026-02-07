import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { Scale, Check } from 'lucide-react';

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

// Legal-themed spinner component
export const LegalSpinner = ({ 
  size = 40, 
  className = '' 
}: { 
  size?: number; 
  className?: string;
}) => (
  <motion.div
    className={`relative ${className}`}
    style={{ width: size, height: size }}
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
  >
    <Scale className="w-full h-full text-primary" strokeWidth={1.5} />
  </motion.div>
);

// Paragraph symbol spinner
export const SectionSpinner = ({ 
  size = 40, 
  className = '' 
}: { 
  size?: number; 
  className?: string;
}) => (
  <motion.div
    className={`flex items-center justify-center font-serif text-primary ${className}`}
    style={{ width: size, height: size, fontSize: size * 0.7 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
  >
    §
  </motion.div>
);

// Full Page Loader with legal theme
interface FullPageLoaderProps {
  isLoading: boolean;
  variant?: 'scales' | 'section';
}

export const FullPageLoader = ({ 
  isLoading, 
  variant = 'scales' 
}: FullPageLoaderProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: easeOut }}
        >
          {variant === 'scales' ? (
            <LegalSpinner size={80} />
          ) : (
            <SectionSpinner size={80} />
          )}

          <motion.p
            className="absolute bottom-1/3 text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Reviewing applicable statutes...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Skeleton with subtle shimmer
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect';
}

export const Skeleton = ({ className = '', variant = 'rect' }: SkeletonProps) => {
  const baseClass = variant === 'circle' 
    ? 'rounded-full' 
    : variant === 'text' 
      ? 'rounded h-4' 
      : 'rounded-lg';

  return (
    <div 
      className={`relative overflow-hidden bg-muted ${baseClass} ${className}`}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      />
    </div>
  );
};

// Skeleton Card
export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`glass rounded-xl p-6 ${className}`}>
    <div className="flex items-start gap-4">
      <Skeleton variant="circle" className="w-12 h-12 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
    </div>
  </div>
);

// Animated Loading Button
interface LoadingButtonProps {
  isLoading: boolean;
  isSuccess?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const LoadingButton = ({ 
  isLoading, 
  isSuccess = false,
  children, 
  onClick, 
  className = '',
  disabled = false,
}: LoadingButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold overflow-hidden ${className}`}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.15, ease: easeOut }}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <LegalSpinner size={20} />
            <span>Reviewing...</span>
          </motion.div>
        ) : isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>Complete</span>
          </motion.div>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Progress Steps with subtle animations
interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressSteps = ({ 
  steps, 
  currentStep, 
  className = '' 
}: ProgressStepsProps) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {index > 0 && (
                <motion.div
                  className="absolute top-4 right-1/2 h-0.5 -translate-y-1/2"
                  style={{ width: 'calc(100% - 32px)', right: '50%', marginRight: '16px' }}
                  initial={{ scaleX: 0, backgroundColor: 'hsl(var(--muted))' }}
                  animate={{ 
                    scaleX: isCompleted || isCurrent ? 1 : 0,
                    backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))'
                  }}
                  transition={{ duration: 0.4, ease: easeOut }}
                />
              )}

              {/* Step circle */}
              <motion.div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-primary border-primary' 
                    : isCurrent 
                      ? 'bg-primary/20 border-primary' 
                      : 'bg-muted border-muted'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <span className={`text-xs font-bold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                      {index + 1}
                    </span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Step label */}
              <motion.p
                className={`mt-2 text-xs text-center transition-opacity duration-300 ${
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}
                style={{ opacity: isPending ? 0.5 : 1 }}
              >
                {step.label}
              </motion.p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Circular Progress with smooth draw
interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgress = ({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  className = '' 
}: CircularProgressProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  // Animate number counting
  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startProgress = displayProgress;
    const diff = progress - startProgress;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress01 = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress01, 3);
      setDisplayProgress(startProgress + diff * eased);

      if (progress01 < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [progress]);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="hsl(var(--muted))"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="hsl(var(--primary))"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: easeOut }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-foreground">{Math.round(displayProgress)}%</span>
      </div>
      
      {/* Completion checkmark */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-primary rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            <Check className="w-8 h-8 text-primary-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
