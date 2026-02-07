import { useState, useEffect, useCallback, useRef } from 'react';
import { isLowEndDevice, prefersReducedMotion, debounce, throttle } from '@/lib/performance';

// Hook to detect performance capabilities
export const usePerformanceMode = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsLowEnd(isLowEndDevice());
    setReducedMotion(prefersReducedMotion());

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldAnimate = !isLowEnd && !reducedMotion;
  const shouldUseHeavyEffects = !isLowEnd;

  return { isLowEnd, reducedMotion, shouldAnimate, shouldUseHeavyEffects };
};

// Hook for debounced scroll tracking
export const useDebouncedScroll = (callback: (scrollY: number) => void, delay = 16) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const debouncedHandler = debounce(() => {
      callbackRef.current(window.scrollY);
    }, delay);

    window.addEventListener('scroll', debouncedHandler, { passive: true });
    return () => window.removeEventListener('scroll', debouncedHandler);
  }, [delay]);
};

// Hook for throttled resize tracking
export const useThrottledResize = (callback: (width: number, height: number) => void, limit = 100) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const throttledHandler = throttle(() => {
      callbackRef.current(window.innerWidth, window.innerHeight);
    }, limit);

    window.addEventListener('resize', throttledHandler, { passive: true });
    return () => window.removeEventListener('resize', throttledHandler);
  }, [limit]);
};

// Hook for intersection observer with performance optimizations
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return { ref, isIntersecting, hasIntersected };
};

// Hook for RAF-based animations
export const useAnimationFrame = (callback: (deltaTime: number) => void, isActive = true) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!isActive) return;

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callbackRef.current(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive]);
};

// Hook for preloading images
export const useImagePreload = (src: string | undefined) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(new Error(`Failed to load image: ${src}`));

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { isLoaded, error };
};
