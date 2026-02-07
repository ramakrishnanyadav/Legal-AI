import { motion, Variants } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import { useInView } from 'framer-motion';

type RevealType = 'fade' | 'slide' | 'scale';

interface ScrollRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

// Subtle fade with small slide (10-20px max)
const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

// Subtle slide
const slideVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

// Subtle scale
const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

const getVariants = (type: RevealType): Variants => {
  switch (type) {
    case 'slide':
      return slideVariants;
    case 'scale':
      return scaleVariants;
    default:
      return fadeVariants;
  }
};

const ScrollReveal = ({
  children,
  type = 'fade',
  delay = 0,
  duration = 0.4,
  className = '',
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger when 20% visible
  const isInView = useInView(ref, { once, amount: 0.2 });

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={getVariants(type)}
      transition={{
        duration,
        delay,
        ease: easeOut,
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered children reveal
export const StaggeredReveal = ({
  children,
  staggerDelay = 0.05, // 50ms between elements
  className = '',
}: {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: easeOut,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  );
};

// Masked reveal component - simplified
export const MaskedReveal = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const clipPaths = {
    up: ['inset(100% 0 0 0)', 'inset(0 0 0 0)'],
    down: ['inset(0 0 100% 0)', 'inset(0 0 0 0)'],
    left: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
    right: ['inset(0 0 0 100%)', 'inset(0 0 0 0)'],
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: clipPaths[direction][0], opacity: 0 }}
        animate={isInView ? { clipPath: clipPaths[direction][1], opacity: 1 } : {}}
        transition={{ duration: 0.5, delay, ease: easeOut }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;
