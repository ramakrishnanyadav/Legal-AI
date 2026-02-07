import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

// Holographic Shimmer Effect
interface HolographicTextProps {
  children: ReactNode;
  className?: string;
}

export const HolographicText = ({ children, className = '' }: HolographicTextProps) => {
  return (
    <span 
      className={`relative inline-block ${className}`}
      style={{
        background: 'linear-gradient(90deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%), hsl(187 100% 50%))',
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: 'holographic-shift 4s ease-in-out infinite',
      }}
    >
      {children}
      <style>{`
        @keyframes holographic-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </span>
  );
};

// Liquid Metal Effect
interface LiquidMetalProps {
  children: ReactNode;
  className?: string;
}

export const LiquidMetal = ({ children, className = '' }: LiquidMetalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        background: `
          radial-gradient(
            circle at calc(var(--mouse-x, 50) * 100%) calc(var(--mouse-y, 50) * 100%),
            rgba(255, 255, 255, 0.3) 0%,
            rgba(0, 217, 255, 0.2) 20%,
            rgba(123, 47, 247, 0.1) 40%,
            transparent 60%
          ),
          linear-gradient(135deg, 
            hsl(230 50% 20%) 0%, 
            hsl(230 50% 15%) 50%, 
            hsl(230 50% 12%) 100%
          )
        `,
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
          transform: `perspective(500px) rotateX(${useTransform(smoothY, [0, 1], [2, -2])}deg) rotateY(${useTransform(smoothX, [0, 1], [-2, 2])}deg)`,
        }}
      />
      {children}
    </motion.div>
  );
};

// Chromatic Aberration Effect
interface ChromaticAberrationProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const ChromaticAberration = ({ 
  children, 
  className = '', 
  intensity = 2 
}: ChromaticAberrationProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Red channel offset */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          color: 'rgba(255, 0, 0, 0.5)',
          mixBlendMode: 'screen',
        }}
        animate={{
          x: isHovered ? -intensity : 0,
          y: isHovered ? -intensity / 2 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      {/* Blue channel offset */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          color: 'rgba(0, 0, 255, 0.5)',
          mixBlendMode: 'screen',
        }}
        animate={{
          x: isHovered ? intensity : 0,
          y: isHovered ? intensity / 2 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      {/* Main content */}
      <div className="relative">{children}</div>
    </motion.div>
  );
};

// Distortion Wave Effect
interface DistortionWaveProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export const DistortionWave = ({ 
  children, 
  className = '', 
  active = false 
}: DistortionWaveProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={active ? {
        filter: [
          'blur(0px)',
          'blur(2px)',
          'blur(4px)',
          'blur(2px)',
          'blur(0px)',
        ],
      } : {}}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={active ? {
          skewX: [0, 2, -2, 1, 0],
          scaleX: [1, 1.02, 0.98, 1.01, 1],
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      
      {/* Scan line effect */}
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ y: '-100%' }}
          animate={{ y: '100%' }}
          transition={{ duration: 0.3, ease: 'linear' }}
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(0, 217, 255, 0.3), transparent)',
            height: '50%',
          }}
        />
      )}
    </motion.div>
  );
};

// Glitch Effect
interface GlitchEffectProps {
  children: ReactNode;
  className?: string;
}

export const GlitchEffect = ({ children, className = '' }: GlitchEffectProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsGlitching(true)}
      onHoverEnd={() => setIsGlitching(false)}
    >
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ color: 'rgba(0, 217, 255, 0.8)' }}
            animate={{
              x: [-2, 2, -1, 3, 0],
              opacity: [0, 1, 0, 1, 0],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            {children}
          </motion.div>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ color: 'rgba(255, 0, 110, 0.8)' }}
            animate={{
              x: [2, -2, 1, -3, 0],
              opacity: [0, 1, 0, 1, 0],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 0.05,
            }}
          >
            {children}
          </motion.div>
        </>
      )}
      
      <div className="relative">{children}</div>
    </motion.div>
  );
};

// Neon Glow Text
interface NeonGlowProps {
  children: ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
}

export const NeonGlow = ({ children, className = '', color = 'primary' }: NeonGlowProps) => {
  const colors = {
    primary: 'hsl(187 100% 50%)',
    secondary: 'hsl(266 93% 58%)',
    accent: 'hsl(336 100% 50%)',
  };

  const glowColor = colors[color];

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={{
        textShadow: [
          `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
          `0 0 20px ${glowColor}, 0 0 40px ${glowColor}, 0 0 60px ${glowColor}`,
          `0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ color: glowColor }}
    >
      {children}
    </motion.span>
  );
};
