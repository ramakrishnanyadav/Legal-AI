import { ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface MobileSwipeHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}

const MobileSwipeHandler = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
}: MobileSwipeHandlerProps) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > threshold) {
      onSwipeRight?.();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft?.();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, opacity, scale, rotate }}
      whileTap={{ cursor: 'grabbing' }}
      className="touch-pan-y"
    >
      {/* Swipe indicators */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none"
        style={{
          opacity: useTransform(x, [0, 100], [0, 1]),
        }}
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center"
          animate={{ x: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <span className="text-orange-400 text-sm font-semibold">←</span>
        </motion.div>
        <span className="text-orange-400 text-sm font-medium">Victim</span>
      </motion.div>

      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none"
        style={{
          opacity: useTransform(x, [-100, 0], [1, 0]),
        }}
      >
        <span className="text-blue-400 text-sm font-medium">Accused</span>
        <motion.div
          className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center"
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <span className="text-blue-400 text-sm font-semibold">→</span>
        </motion.div>
      </motion.div>

      {children}
    </motion.div>
  );
};

export default MobileSwipeHandler;
