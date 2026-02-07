import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  parallaxElements?: boolean;
}

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

const TiltCard = ({
  children,
  className = '',
  maxTilt = 3, // Reduced from 15 to 2-3 degrees max
  glare = true,
  parallaxElements = false,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Smoother spring config
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(smoothMouseY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-maxTilt, maxTilt]);
  
  const glareX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      transition={{ duration: 0.3, ease: easeOut }}
      data-interactive
    >
      {/* Subtle glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-10"
          style={{
            opacity: isHovered ? 0.08 : 0,
            background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, white, transparent 60%)`,
          }}
          animate={{
            opacity: isHovered ? 0.08 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content with subtle parallax */}
      {parallaxElements ? (
        <motion.div
          style={{
            transformStyle: 'preserve-3d',
          }}
          animate={{
            z: isHovered ? 8 : 0,
          }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default TiltCard;
