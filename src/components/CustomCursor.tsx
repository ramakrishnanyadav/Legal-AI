import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

interface CursorState {
  type: 'default' | 'interactive' | 'link' | 'button';
}

const CustomCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>({ type: 'default' });
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Smoother spring config for professional feel
  const springConfig = { damping: 30, stiffness: 300 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    
    // Max 3 trailing dots
    setTrails(prev => {
      const newTrails = [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }];
      return newTrails.slice(-3);
    });
  }, [cursorX, cursorY]);

  const handleMouseDown = useCallback(() => {
    setIsClicking(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsClicking(false);
  }, []);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('button') || target.closest('[role="button"]')) {
        setCursorState({ type: 'button' });
      } else if (target.closest('a')) {
        setCursorState({ type: 'link' });
      } else if (target.closest('[data-interactive]') || target.closest('.glass-card')) {
        setCursorState({ type: 'interactive' });
      } else {
        setCursorState({ type: 'default' });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleElementHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      (el as HTMLElement).style.cursor = 'none';
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleElementHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [handleMouseMove, handleMouseDown, handleMouseUp]);

  // Cursor sizes: default 6px, expanded 16px max
  const getCursorSize = () => {
    switch (cursorState.type) {
      case 'interactive':
      case 'button':
      case 'link':
        return 16;
      default:
        return 6;
    }
  };

  return (
    <>
      {/* Subtle trailing dots - max 3, small size */}
      {trails.map((trail, index) => (
        <motion.div
          key={`trail-${trail.id}-${index}`}
          className="fixed pointer-events-none z-[9998]"
          initial={{ opacity: 0.2, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            left: trail.x - 2,
            top: trail.y - 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'hsl(var(--primary) / 0.4)',
          }}
        />
      ))}

      {/* Main cursor - small dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: getCursorSize(),
          height: getCursorSize(),
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ 
          duration: 0.15, 
          ease: [0.25, 0.46, 0.45, 0.94] // ease-out
        }}
      >
        {/* Default small dot */}
        {cursorState.type === 'default' && (
          <motion.div
            className="w-full h-full rounded-full bg-primary"
            style={{
              boxShadow: '0 0 8px hsl(var(--primary) / 0.3)',
            }}
          />
        )}

        {/* Interactive/button/link - subtle expansion */}
        {cursorState.type !== 'default' && (
          <motion.div
            className="w-full h-full rounded-full border flex items-center justify-center"
            style={{
              borderColor: 'hsl(var(--primary) / 0.6)',
              background: 'hsl(var(--primary) / 0.1)',
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
