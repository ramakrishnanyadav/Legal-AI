// Performance utilities and configuration

// Check for low-end device
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const connection = (navigator as any).connection;
  const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';
  
  return cores <= 2 || memory <= 2 || slowConnection;
};

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// RAF-based animation frame scheduler
export const scheduleAnimation = (callback: () => void): number => {
  return requestAnimationFrame(callback);
};

// Cancel scheduled animation
export const cancelAnimation = (id: number): void => {
  cancelAnimationFrame(id);
};

// Preload route on hover
export const preloadRoute = (routeImport: () => Promise<any>): void => {
  routeImport();
};

// Image loading with blur-up
export const loadImageWithBlur = (
  src: string,
  onLoad: (src: string) => void
): void => {
  const img = new Image();
  img.src = src;
  img.onload = () => onLoad(src);
};

// Check WebP support
let webpSupported: boolean | null = null;
export const supportsWebP = async (): Promise<boolean> => {
  if (webpSupported !== null) return webpSupported;
  
  if (typeof window === 'undefined') return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      webpSupported = img.width > 0 && img.height > 0;
      resolve(webpSupported);
    };
    img.onerror = () => {
      webpSupported = false;
      resolve(false);
    };
    img.src = webpData;
  });
};

// Performance-optimized animation styles
export const gpuAcceleratedStyles = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  willChange: 'transform, opacity',
};

// SWR-like cache configuration for React Query
export const queryCacheConfig = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 2,
};
