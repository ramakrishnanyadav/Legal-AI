import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

// Check for low-end device
const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  return cores <= 2 || memory <= 2;
};

interface PerformanceContextType {
  isLowEnd: boolean;
  reducedMotion: boolean;
  shouldAnimate: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
  isLowEnd: false,
  reducedMotion: false,
  shouldAnimate: true,
});

export const usePerformance = () => useContext(PerformanceContext);

// Performance provider for mobile optimizations
export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const reducedMotion = useReducedMotion() || false;
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    setIsLowEnd(isLowEndDevice());
  }, []);

  const shouldAnimate = !reducedMotion && !isLowEnd;

  return (
    <PerformanceContext.Provider value={{ isLowEnd, reducedMotion, shouldAnimate }}>
      {children}
    </PerformanceContext.Provider>
  );
};

// Optimized motion wrapper
interface OptimizedMotionProps {
  children: ReactNode;
  className?: string;
  animate?: any;
  initial?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
}

export const OptimizedMotion = ({
  children,
  className = '',
  animate,
  initial,
  whileHover,
  whileTap,
  transition,
}: OptimizedMotionProps) => {
  const { shouldAnimate } = usePerformance();

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      style={{
        // Force GPU acceleration
        transform: 'translateZ(0)',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  );
};

// Lazy image with blur-up placeholder
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className = '',
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3C/svg%3E'
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <motion.div className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ filter: 'blur(10px)', scale: 1.1 }}
        animate={{ 
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
          scale: isLoaded ? 1 : 1.1,
        }}
        transition={{ duration: 0.5 }}
        loading="lazy"
      />
    </motion.div>
  );
};

// Virtual list item wrapper for performance
interface VirtualItemProps {
  children: ReactNode;
  index: number;
  isVisible: boolean;
}

export const VirtualItem = ({ children, index, isVisible }: VirtualItemProps) => {
  if (!isVisible) {
    // Render placeholder with same height
    return <div className="h-20 bg-transparent" data-index={index} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
    >
      {children}
    </motion.div>
  );
};

// GPU-optimized transform wrapper
interface GPULayerProps {
  children: ReactNode;
  className?: string;
}

export const GPULayer = ({ children, className = '' }: GPULayerProps) => {
  return (
    <div 
      className={className}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
