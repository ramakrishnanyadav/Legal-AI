import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  particleCount?: number;
  origin?: { x: number; y: number };
}

const colors = [
  'hsl(187, 100%, 50%)', // Electric blue
  'hsl(266, 93%, 58%)',  // Purple
  'hsl(336, 100%, 50%)', // Pink
  'hsl(45, 100%, 60%)',  // Gold
  'hsl(142, 76%, 50%)',  // Green
];

const shapes = ['square', 'circle', 'triangle'] as const;

const Confetti = ({
  active,
  onComplete,
  particleCount = 50,
  origin = { x: 0.5, y: 0.5 },
}: ConfettiProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: origin.x * window.innerWidth,
        y: origin.y * window.innerHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 30,
        velocityY: Math.random() * -20 - 10,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, particleCount, origin, onComplete]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-[100]"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 0,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: particle.x + particle.velocityX * 20,
            y: particle.y + particle.velocityY * -15 + 400,
            scale: [0, 1, 1, 0.5],
            rotate: particle.rotation + Math.random() * 720,
            opacity: [1, 1, 1, 0],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 2.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            boxShadow: `0 0 10px ${particle.color}`,
          }}
        />
      ))}
    </AnimatePresence>
  );
};

export default Confetti;
