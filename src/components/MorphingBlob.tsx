import { motion, useScroll, useTransform } from 'framer-motion';

interface MorphingBlobProps {
  className?: string;
  color?: string;
  size?: number;
}

const MorphingBlob = ({
  className = '',
  color = 'hsl(var(--primary))',
  size = 400,
}: MorphingBlobProps) => {
  const { scrollYProgress } = useScroll();

  // Morph blob shapes based on scroll
  const borderRadius1 = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['60% 40% 30% 70% / 60% 30% 70% 40%', '30% 60% 70% 40% / 50% 60% 30% 60%', '60% 40% 30% 70% / 60% 30% 70% 40%']
  );
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <motion.div
      className={`absolute blur-3xl opacity-30 ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        borderRadius: borderRadius1,
        scale,
        rotate,
      }}
    />
  );
};

export default MorphingBlob;
