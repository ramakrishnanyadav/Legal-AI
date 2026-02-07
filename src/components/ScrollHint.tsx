import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollHintProps {
  delay?: number;
  targetId?: string;
}

const ScrollHint = ({ delay = 2.5, targetId }: ScrollHintProps) => {
  const handleClick = () => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 200, behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onClick={handleClick}
      className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
      aria-label="Scroll down for more"
    >
      <span className="text-xs">Scroll for more</span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </motion.button>
  );
};

export default ScrollHint;
