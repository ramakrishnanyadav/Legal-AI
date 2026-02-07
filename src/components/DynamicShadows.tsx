import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';

// Multi-layer shadow card that responds to cursor
interface DynamicShadowCardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}

export const DynamicShadowCard = ({ 
  children, 
  className = '', 
  elevated = false 
}: DynamicShadowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Transform mouse position to shadow offsets
  const shadowX = useTransform(smoothX, [0, 1], [15, -15]);
  const shadowY = useTransform(smoothY, [0, 1], [15, -15]);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: elevated ? -8 : -4 }}
      style={{
        boxShadow: isHovered
          ? `
              ${shadowX.get()}px ${shadowY.get()}px 20px rgba(0, 0, 0, 0.2),
              ${shadowX.get() * 0.5}px ${shadowY.get() * 0.5}px 40px rgba(0, 0, 0, 0.15),
              ${shadowX.get() * 0.25}px ${shadowY.get() * 0.25}px 60px rgba(0, 217, 255, 0.1),
              0 0 80px rgba(0, 217, 255, 0.05)
            `
          : `
              0 4px 20px rgba(0, 0, 0, 0.2),
              0 8px 40px rgba(0, 0, 0, 0.1)
            `,
      }}
    >
      {/* Inner highlight based on cursor */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(circle at ${smoothX.get() * 100}% ${smoothY.get() * 100}%, rgba(255, 255, 255, 0.1), transparent 50%)`
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};

// Scroll-based shadow that simulates light source movement
interface ScrollShadowProps {
  children: ReactNode;
  className?: string;
}

export const ScrollShadow = ({ children, className = '' }: ScrollShadowProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [elementTop, setElementTop] = useState(0);
  
  useEffect(() => {
    if (elementRef.current) {
      setElementTop(elementRef.current.offsetTop);
    }
  }, []);

  // Calculate shadow based on scroll position (simulated light from top-right)
  const shadowAngle = useTransform(
    scrollY,
    [elementTop - 500, elementTop, elementTop + 500],
    [45, 90, 135]
  );
  
  const shadowDistance = useTransform(
    scrollY,
    [elementTop - 500, elementTop, elementTop + 500],
    [20, 10, 20]
  );

  return (
    <motion.div
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        boxShadow: useTransform(
          [shadowAngle, shadowDistance],
          ([angle, dist]) => {
            const rad = (angle as number * Math.PI) / 180;
            const x = Math.cos(rad) * (dist as number);
            const y = Math.sin(rad) * (dist as number);
            return `
              ${x}px ${y}px 20px rgba(0, 0, 0, 0.2),
              ${x * 0.5}px ${y * 0.5}px 40px rgba(0, 0, 0, 0.1),
              0 0 60px rgba(0, 217, 255, 0.05)
            `;
          }
        ),
      }}
    >
      {children}
    </motion.div>
  );
};

// Layered depth shadow for rich 3D feel
interface LayeredShadowProps {
  children: ReactNode;
  className?: string;
  depth?: 'shallow' | 'medium' | 'deep';
}

export const LayeredShadow = ({ 
  children, 
  className = '', 
  depth = 'medium' 
}: LayeredShadowProps) => {
  const depthStyles = {
    shallow: `
      0 1px 2px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.08),
      0 4px 8px rgba(0, 0, 0, 0.06)
    `,
    medium: `
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.06),
      0 16px 32px rgba(0, 0, 0, 0.04),
      0 0 40px rgba(0, 217, 255, 0.03)
    `,
    deep: `
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 4px 8px rgba(0, 0, 0, 0.1),
      0 8px 16px rgba(0, 0, 0, 0.08),
      0 16px 32px rgba(0, 0, 0, 0.06),
      0 32px 64px rgba(0, 0, 0, 0.04),
      0 0 60px rgba(0, 217, 255, 0.05),
      0 0 100px rgba(123, 47, 247, 0.03)
    `,
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        boxShadow: depthStyles[depth],
      }}
      whileHover={{
        boxShadow: depth === 'shallow' 
          ? depthStyles.medium 
          : depth === 'medium' 
            ? depthStyles.deep 
            : `
                0 4px 8px rgba(0, 0, 0, 0.15),
                0 8px 16px rgba(0, 0, 0, 0.12),
                0 16px 32px rgba(0, 0, 0, 0.1),
                0 32px 64px rgba(0, 0, 0, 0.08),
                0 64px 128px rgba(0, 0, 0, 0.06),
                0 0 80px rgba(0, 217, 255, 0.08),
                0 0 120px rgba(123, 47, 247, 0.05)
              `,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Floating shadow that creates depth illusion
interface FloatingShadowProps {
  children: ReactNode;
  className?: string;
}

export const FloatingShadow = ({ children, className = '' }: FloatingShadowProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* Shadow layer underneath */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-black/20 blur-xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: 'translateY(20px) scale(0.95)',
        }}
      />
      
      {/* Main content */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
