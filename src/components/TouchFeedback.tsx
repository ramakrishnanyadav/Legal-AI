import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ReactNode, useState } from 'react';

// Ripple effect component
interface RippleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

const Ripple = ({ x, y, onComplete }: RippleProps) => (
  <motion.span
    className="absolute rounded-full bg-white/30 pointer-events-none"
    style={{ left: x, top: y, translateX: '-50%', translateY: '-50%' }}
    initial={{ width: 0, height: 0, opacity: 0.5 }}
    animate={{ width: 200, height: 200, opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    onAnimationComplete={onComplete}
  />
);

// Touch feedback wrapper
interface TouchFeedbackProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export const TouchFeedback = ({ 
  children, 
  className = '', 
  onPress,
  disabled = false,
}: TouchFeedbackProps) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : (e as React.MouseEvent).clientY - rect.top;
    
    setRipples(prev => [...prev, { id: Date.now(), x, y }]);
    onPress?.();
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {children}
      {ripples.map(ripple => (
        <Ripple 
          key={ripple.id} 
          x={ripple.x} 
          y={ripple.y} 
          onComplete={() => removeRipple(ripple.id)} 
        />
      ))}
    </motion.div>
  );
};

// Swipeable card with actions
interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftActions,
  rightActions,
  className = '',
}: SwipeableCardProps) => {
  const x = useMotionValue(0);
  const leftOpacity = useTransform(x, [0, 100], [0, 1]);
  const rightOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipeRight?.();
    } else if (info.offset.x < -100) {
      onSwipeLeft?.();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Left actions (revealed on swipe right) */}
      {leftActions && (
        <motion.div 
          className="absolute left-0 top-0 bottom-0 flex items-center px-4 bg-green-500/20"
          style={{ opacity: leftOpacity }}
        >
          {leftActions}
        </motion.div>
      )}

      {/* Right actions (revealed on swipe left) */}
      {rightActions && (
        <motion.div 
          className="absolute right-0 top-0 bottom-0 flex items-center px-4 bg-red-500/20"
          style={{ opacity: rightOpacity }}
        >
          {rightActions}
        </motion.div>
      )}

      {/* Main card */}
      <motion.div
        className="relative bg-card"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -150, right: 150 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Peek cards effect
interface PeekCardProps {
  children: ReactNode;
  isActive: boolean;
  className?: string;
}

export const PeekCard = ({ children, isActive, className = '' }: PeekCardProps) => {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        scale: isActive ? 1 : 0.95,
        y: isActive ? 0 : 10,
        opacity: isActive ? 1 : 0.7,
      }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 200,
      }}
    >
      {children}
    </motion.div>
  );
};

// Flip card
interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export const FlipCard = ({ front, back, className = '' }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
};

// Haptic feedback simulation
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
    };
    navigator.vibrate(patterns[type]);
  }
};

// Visual punch effect
interface VisualPunchProps {
  children: ReactNode;
  className?: string;
}

export const VisualPunch = ({ children, className = '' }: VisualPunchProps) => {
  const [isPunched, setIsPunched] = useState(false);

  const handleClick = () => {
    setIsPunched(true);
    triggerHaptic('medium');
    setTimeout(() => setIsPunched(false), 150);
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onClick={handleClick}
      animate={isPunched ? {
        scale: [1, 0.9, 1.05, 1],
        rotate: [0, -2, 2, 0],
      } : {}}
      transition={{ duration: 0.15 }}
    >
      {children}
      
      {/* Glow effect on punch */}
      {isPunched && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/30 pointer-events-none"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Form field with shake error animation
interface ShakeFieldProps {
  children: ReactNode;
  hasError: boolean;
  errorMessage?: string;
  className?: string;
}

export const ShakeField = ({ 
  children, 
  hasError, 
  errorMessage,
  className = '' 
}: ShakeFieldProps) => {
  return (
    <div className={className}>
      <motion.div
        animate={hasError ? {
          x: [0, -10, 10, -10, 10, -5, 5, 0],
        } : {}}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
      
      {/* Error message */}
      <motion.div
        initial={false}
        animate={hasError ? { 
          height: 'auto', 
          opacity: 1,
          y: 0,
        } : { 
          height: 0, 
          opacity: 0,
          y: -10,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
          <motion.span
            animate={hasError ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            ⚠️
          </motion.span>
          {errorMessage}
        </p>
      </motion.div>
    </div>
  );
};
