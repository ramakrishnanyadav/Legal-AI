import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface VirtualListOptions {
  itemHeight: number;
  overscan?: number;
  containerHeight?: number;
}

interface VirtualListResult<T> {
  virtualItems: { item: T; index: number; offsetTop: number }[];
  totalHeight: number;
  containerRef: React.RefObject<HTMLDivElement>;
  scrollToIndex: (index: number) => void;
}

export const useVirtualList = <T>(
  items: T[],
  options: VirtualListOptions
): VirtualListResult<T> => {
  const { itemHeight, overscan = 3, containerHeight: fixedHeight } = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(fixedHeight || 400);

  // Update container height on resize
  useEffect(() => {
    if (fixedHeight) return;
    
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [fixedHeight]);

  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate visible items
  const virtualItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

    const visibleItems: { item: T; index: number; offsetTop: number }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        item: items[i],
        index: i,
        offsetTop: i * itemHeight,
      });
    }

    return visibleItems;
  }, [items, scrollTop, containerHeight, itemHeight, overscan]);

  const totalHeight = items.length * itemHeight;

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    container.scrollTop = index * itemHeight;
  }, [itemHeight]);

  return { virtualItems, totalHeight, containerRef, scrollToIndex };
};

// Infinite scroll hook
interface InfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = (options: InfiniteScrollOptions) => {
  const { hasMore, isLoading, onLoadMore, threshold = 0.8 } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore();
          }
        },
        { threshold }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, hasMore, onLoadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
};
