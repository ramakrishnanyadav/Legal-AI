import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Scale, Gavel } from 'lucide-react';

interface Floating3DObjectsProps {
  className?: string;
}

const Floating3DObjects = ({ className = '' }: Floating3DObjectsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  // Parallax transforms for different objects
  const scalesX = useTransform(smoothX, [0, 1], [-30, 30]);
  const scalesY = useTransform(smoothY, [0, 1], [-20, 20]);
  
  const gavelX = useTransform(smoothX, [0, 1], [20, -20]);
  const gavelY = useTransform(smoothY, [0, 1], [15, -15]);
  
  const paragraphX = useTransform(smoothX, [0, 1], [-15, 15]);
  const paragraphY = useTransform(smoothY, [0, 1], [-25, 25]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Scales of Justice - Slowly rotating */}
      <motion.div
        className="absolute top-[15%] left-[10%]"
        style={{
          x: scalesX,
          y: scalesY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotateY: [0, 360],
            rotateX: [0, 10, 0, -10, 0],
          }}
          transition={{
            rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
            rotateX: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 20px 40px rgba(0, 217, 255, 0.3))',
          }}
        >
          <div className="w-24 h-24 glass rounded-2xl flex items-center justify-center">
            <Scale className="w-12 h-12 text-primary" />
          </div>
          {/* 3D shadow beneath */}
          <motion.div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-primary/20 blur-md"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Gavel - Bobbing up and down */}
      <motion.div
        className="absolute top-[25%] right-[15%]"
        style={{
          x: gavelX,
          y: gavelY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="relative"
          animate={{
            y: [0, -15, 0],
            rotateZ: [0, 5, 0, -5, 0],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            rotateZ: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            filter: 'drop-shadow(0 25px 50px rgba(123, 47, 247, 0.3))',
          }}
        >
          <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center rotate-12">
            <Gavel className="w-10 h-10 text-secondary" />
          </div>
          {/* Dynamic shadow that moves with bob */}
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full bg-secondary/20 blur-md"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Paragraph Symbol (§) - Orbiting */}
      <motion.div
        className="absolute top-[60%] left-[20%]"
        style={{
          x: paragraphX,
          y: paragraphY,
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transformOrigin: '100px 0px',
          }}
        >
          <motion.div
            className="w-16 h-16 glass rounded-xl flex items-center justify-center"
            animate={{
              rotateY: [0, -360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateY: { duration: 15, repeat: Infinity, ease: 'linear' },
              scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              filter: 'drop-shadow(0 15px 30px rgba(255, 0, 110, 0.3))',
            }}
          >
            <span className="text-3xl font-bold text-accent">§</span>
          </motion.div>
          {/* Orbit shadow */}
          <motion.div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-accent/20 blur-sm"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Additional floating geometric shapes */}
      <motion.div
        className="absolute bottom-[30%] right-[25%]"
        style={{
          x: useTransform(smoothX, [0, 1], [10, -10]),
          y: useTransform(smoothY, [0, 1], [20, -20]),
        }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-primary/40 rounded-lg"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0, 217, 255, 0.2))',
          }}
        />
      </motion.div>

      {/* Small floating dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            top: `${20 + i * 15}%`,
            left: `${70 + (i % 3) * 10}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default Floating3DObjects;
