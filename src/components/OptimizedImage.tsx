import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/usePerformance';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'skeleton';
  blurDataURL?: string;
}

const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'skeleton',
  blurDataURL,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(
    priority ? src : (placeholder === 'blur' && blurDataURL ? blurDataURL : null)
  );
  const { ref, hasIntersected } = useIntersectionObserver({ rootMargin: '200px' });

  useEffect(() => {
    if (!priority && !hasIntersected) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
    };
  }, [src, hasIntersected, priority]);

  const showSkeleton = !currentSrc && placeholder === 'skeleton';
  const showBlur = !isLoaded && placeholder === 'blur' && currentSrc === blurDataURL;

  return (
    <div
      ref={ref as any}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {currentSrc && (
        <motion.img
          src={currentSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            showBlur && 'blur-lg scale-110'
          )}
          initial={showBlur ? { filter: 'blur(20px)', scale: 1.1 } : false}
          animate={
            isLoaded 
              ? { filter: 'blur(0px)', scale: 1, opacity: 1 }
              : { opacity: showBlur ? 1 : 0 }
          }
          transition={{ duration: 0.4, ease: 'easeOut' }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            transform: 'translateZ(0)',
            willChange: isLoaded ? 'auto' : 'transform, opacity, filter',
          }}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;

// Responsive image with srcset support
interface ResponsiveImageProps extends OptimizedImageProps {
  srcSet?: { src: string; width: number }[];
  sizes?: string;
}

export const ResponsiveImage = memo(({
  src,
  srcSet,
  sizes = '100vw',
  alt,
  className = '',
  priority = false,
  ...props
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, hasIntersected } = useIntersectionObserver({ rootMargin: '200px' });

  const srcSetString = srcSet
    ?.map(({ src, width }) => `${src} ${width}w`)
    .join(', ');

  if (!priority && !hasIntersected) {
    return (
      <div ref={ref as any} className={cn('relative', className)}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <motion.img
      ref={ref as any}
      src={src}
      srcSet={srcSetString}
      sizes={sizes}
      alt={alt}
      className={cn('object-cover', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      onLoad={() => setIsLoaded(true)}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...props}
    />
  );
});

ResponsiveImage.displayName = 'ResponsiveImage';
