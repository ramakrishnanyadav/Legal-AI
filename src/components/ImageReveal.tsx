import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  parallaxStrength?: number;
  delay?: number;
}

const ImageReveal = ({
  src,
  alt,
  className = '',
  parallaxStrength = 0.2,
  delay = 0,
}: ImageRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50 * parallaxStrength, 50 * parallaxStrength]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 1.1 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          style={{ y }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </div>
  );
};

export default ImageReveal;
