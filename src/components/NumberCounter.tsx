import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface NumberCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

const NumberCounter = ({
  value,
  duration = 1.5, // Slightly faster for professionalism
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: NumberCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  // Use duration-based easing for natural feel
  const springValue = useSpring(0, {
    damping: 40,
    stiffness: 80,
  });

  const displayValue = useTransform(springValue, (latest) => {
    return latest.toFixed(decimals);
  });

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        springValue.set(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, springValue, delay]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

export default NumberCounter;
