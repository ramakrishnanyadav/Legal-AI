import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Zap,
  HelpCircle
} from 'lucide-react';

interface UrgencyIndicatorProps {
  isUrgent: boolean;
  onToggle: (value: boolean) => void;
}

const UrgencyIndicator = ({ isUrgent, onToggle }: UrgencyIndicatorProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div 
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <motion.button
          onClick={() => onToggle(!isUrgent)}
          className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px] ${
            isUrgent 
              ? 'bg-destructive/20 border border-destructive/30 text-destructive' 
              : 'bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ 
              scale: isUrgent ? [1, 1.15, 1] : 1,
            }}
            transition={{ 
              duration: 1.5, 
              repeat: isUrgent ? Infinity : 0,
              ease: 'easeInOut'
            }}
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </motion.div>
          <span className="text-sm font-medium">
            {isUrgent ? 'Urgent Case' : 'Mark as Urgent'}
          </span>
          <HelpCircle className="w-3.5 h-3.5 opacity-50" />
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-2 w-72 p-4 rounded-xl glass border border-border shadow-xl"
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-l border-t border-border" />
              <p className="text-sm text-foreground font-medium mb-3">When to mark as urgent:</p>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Situations involving immediate safety risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Active arrest warrant or custody</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Time-sensitive evidence that may be destroyed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-0.5">•</span>
                  <span>Ongoing threat or harassment</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UrgencyIndicator;
