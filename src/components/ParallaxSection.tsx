import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
}

export const ParallaxLayer = ({ children, speed = 0.5, className = '' }: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);
  const smoothY = useSpring(y, { damping: 20, stiffness: 100 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
};

export const ParallaxSection = ({ children, className = '' }: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Background color shift based on scroll
  const hue = useTransform(scrollYProgress, [0, 1], [220, 280]);
  const smoothHue = useSpring(hue, { damping: 20, stiffness: 100 });

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: useTransform(
          smoothHue,
          (h) => `linear-gradient(180deg, hsl(${h}, 50%, 5%) 0%, hsl(${h + 20}, 40%, 3%) 100%)`
        ),
      }}
    >
      {children}
    </motion.div>
  );
};

// Spotlight effect that follows scroll
export const ScrollSpotlight = () => {
  const { scrollYProgress } = useScroll();
  
  const spotlightY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const smoothSpotlightY = useSpring(spotlightY, { damping: 30, stiffness: 100 });

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: useTransform(
          smoothSpotlightY,
          (y) => `radial-gradient(circle 600px at 50% ${y}, hsl(var(--primary) / 0.08), transparent 70%)`
        ),
      }}
    />
  );
};

export default ParallaxSection;
