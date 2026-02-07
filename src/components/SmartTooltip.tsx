import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

// Legal terms dictionary
const legalTerms: Record<string, string> = {
  'IPC': 'Indian Penal Code - The main criminal code of India that covers all aspects of criminal law.',
  'FIR': 'First Information Report - A written document prepared by police when they receive information about a cognizable offense.',
  'bail': 'Temporary release of an accused person awaiting trial, sometimes on condition of a sum of money being deposited.',
  'bailable': 'An offense for which bail may be granted as a matter of right.',
  'cognizable': 'An offense for which police can arrest without a warrant and start investigation without court permission.',
  'CrPC': 'Code of Criminal Procedure - The main legislation on procedure for criminal law in India.',
  'magistrate': 'A judicial officer who handles initial stages of criminal cases and minor offenses.',
  'charge sheet': 'A formal document filed by police after investigation, containing evidence and charges against the accused.',
  'remand': 'The detention of an accused in custody while the investigation is ongoing.',
  'anticipatory bail': 'Bail granted in anticipation of arrest, protecting someone from being arrested.',
};

// Context for managing tooltip state
interface TooltipContextType {
  dismissedTerms: string[];
  dismissTerm: (term: string) => void;
  dismissAll: () => void;
}

const TooltipContext = createContext<TooltipContextType>({
  dismissedTerms: [],
  dismissTerm: () => {},
  dismissAll: () => {},
});

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const [dismissedTerms, setDismissedTerms] = useState<string[]>(() => {
    const saved = localStorage.getItem('dismissedTooltips');
    return saved ? JSON.parse(saved) : [];
  });

  const dismissTerm = (term: string) => {
    setDismissedTerms((prev) => {
      const updated = [...prev, term];
      localStorage.setItem('dismissedTooltips', JSON.stringify(updated));
      return updated;
    });
  };

  const dismissAll = () => {
    const allTerms = Object.keys(legalTerms);
    setDismissedTerms(allTerms);
    localStorage.setItem('dismissedTooltips', JSON.stringify(allTerms));
  };

  return (
    <TooltipContext.Provider value={{ dismissedTerms, dismissTerm, dismissAll }}>
      {children}
    </TooltipContext.Provider>
  );
};

// Smart Tooltip Component
interface SmartTooltipProps {
  term: string;
  children: ReactNode;
  className?: string;
}

export const SmartTooltip = ({ term, children, className = '' }: SmartTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { dismissedTerms, dismissTerm } = useContext(TooltipContext);

  const definition = legalTerms[term.toLowerCase()];
  const isDismissed = dismissedTerms.includes(term.toLowerCase());

  const handleMouseEnter = () => {
    if (isDismissed || !definition) return;
    
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500); // 500ms delay
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    dismissTerm(term.toLowerCase());
    setIsVisible(false);
  };

  if (!definition) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="border-b border-dashed border-primary/50 cursor-help">
        {children}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64"
          >
            <div className="glass-strong rounded-xl p-3 text-sm relative">
              {/* Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 glass-strong rotate-45" />
              
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-primary">{term}</span>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <p className="text-muted-foreground text-xs leading-relaxed relative z-10">
                {definition}
              </p>
              
              <button
                onClick={handleDismiss}
                className="mt-2 text-xs text-primary hover:underline"
              >
                Got it, don't show again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

// Guided Tooltip for first-time users
interface GuidedTooltipProps {
  id: string;
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  step?: number;
  totalSteps?: number;
}

export const GuidedTooltip = ({ 
  id, 
  children, 
  content, 
  position = 'top',
  step,
  totalSteps 
}: GuidedTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(`guidedTooltip_${id}`);
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setHasBeenDismissed(true);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    localStorage.setItem(`guidedTooltip_${id}`, 'true');
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: '-bottom-1.5 left-1/2 -translate-x-1/2',
    bottom: '-top-1.5 left-1/2 -translate-x-1/2',
    left: '-right-1.5 top-1/2 -translate-y-1/2',
    right: '-left-1.5 top-1/2 -translate-y-1/2',
  };

  if (hasBeenDismissed) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 w-56 ${positionClasses[position]}`}
          >
            <div className="glass-strong rounded-xl p-3 text-sm relative border border-primary/20">
              <div className={`absolute w-3 h-3 glass-strong rotate-45 ${arrowClasses[position]}`} />
              
              {step && totalSteps && (
                <div className="text-xs text-primary mb-1">
                  Step {step} of {totalSteps}
                </div>
              )}
              
              <p className="text-foreground text-xs leading-relaxed mb-2 relative z-10">
                {content}
              </p>
              
              <button
                onClick={handleDismiss}
                className="w-full py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartTooltip;
