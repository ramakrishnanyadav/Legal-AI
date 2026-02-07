import { Suspense, lazy, ComponentType, memo, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMode } from '@/hooks/usePerformance';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Generic lazy loader with suspense
interface LazyLoaderProps {
  fallback?: ReactNode;
  children: ReactNode;
}

export const LazyLoader = ({ fallback, children }: LazyLoaderProps) => {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

// Skeleton fallback for sections
interface SectionSkeletonProps {
  className?: string;
  rows?: number;
}

export const SectionSkeleton = ({ className, rows = 3 }: SectionSkeletonProps) => (
  <div className={cn('space-y-4 p-6', className)}>
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-2/3" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-24 w-full" />
    ))}
  </div>
);

// Performance-aware motion wrapper
interface OptimizedMotionProps {
  children: ReactNode;
  className?: string;
  animate?: any;
  initial?: any;
  whileHover?: any;
  whileTap?: any;
  transition?: any;
  layoutId?: string;
}

export const OptimizedMotion = memo(({
  children,
  className,
  animate,
  initial,
  whileHover,
  whileTap,
  transition,
  layoutId,
}: OptimizedMotionProps) => {
  const { shouldAnimate } = usePerformanceMode();

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
      layoutId={layoutId}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </motion.div>
  );
});

OptimizedMotion.displayName = 'OptimizedMotion';

// Deferred render for non-critical components
interface DeferredProps {
  children: ReactNode;
  delay?: number;
  fallback?: ReactNode;
}

export const Deferred = ({ children, delay = 100, fallback = null }: DeferredProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) return <>{fallback}</>;
  return <>{children}</>;
};

// Progressive enhancement wrapper
interface ProgressiveProps {
  children: ReactNode;
  enhancedChildren: ReactNode;
}

export const Progressive = ({ children, enhancedChildren }: ProgressiveProps) => {
  const { shouldUseHeavyEffects } = usePerformanceMode();
  return <>{shouldUseHeavyEffects ? enhancedChildren : children}</>;
};

// Fade transition wrapper
interface FadeTransitionProps {
  children: ReactNode;
  show: boolean;
  duration?: number;
}

export const FadeTransition = ({ children, show, duration = 0.3 }: FadeTransitionProps) => (
  <AnimatePresence mode="wait">
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Create lazy component with preload capability
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFn);
  
  // Attach preload function
  (LazyComponent as any).preload = importFn;
  
  return LazyComponent;
}
