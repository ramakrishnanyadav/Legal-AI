import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, ReactNode } from 'react';
import { getRandomMessage, loadingMessages } from '@/lib/personality';
import { Loader2 } from 'lucide-react';

interface WittyLoaderProps {
  isLoading: boolean;
  children?: ReactNode;
}

export const WittyLoader = ({ isLoading, children }: WittyLoaderProps) => {
  const [message, setMessage] = useState(getRandomMessage(loadingMessages));

  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setMessage(getRandomMessage(loadingMessages));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-8 h-8 text-primary" />
          </motion.div>
          
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 text-sm text-muted-foreground text-center"
          >
            {message}
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Achievement notification component
interface AchievementToastProps {
  title: string;
  description: string;
  onClose: () => void;
}

export const AchievementToast = ({ title, description, onClose }: AchievementToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 glass rounded-xl p-4 flex items-center gap-4"
      initial={{ y: -100, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -100, opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <motion.div
        className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <span className="text-2xl">🏆</span>
      </motion.div>
      
      <div>
        <motion.p 
          className="font-bold text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {title}
        </motion.p>
        <motion.p 
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Empty state with illustration
interface EmptyStateProps {
  title: string;
  message: string;
  emoji: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, message, emoji, action }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="text-6xl mb-6"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {emoji}
      </motion.div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{message}</p>
      
      {action}
    </motion.div>
  );
};

// Keyboard shortcut hint
interface ShortcutHintProps {
  keys: string[];
  action: string;
}

export const ShortcutHint = ({ keys, action }: ShortcutHintProps) => {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono text-[10px]">
              {key}
            </kbd>
            {i < keys.length - 1 && <span className="mx-0.5">+</span>}
          </span>
        ))}
      </div>
      <span>{action}</span>
    </div>
  );
};
