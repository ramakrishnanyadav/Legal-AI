import { useState, useRef, useCallback, useEffect } from 'react';

interface LongPressOptions {
  threshold?: number;
  onLongPress?: () => void;
}

interface SwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface PullToRefreshOptions {
  threshold?: number;
  resistance?: number;
  onRefresh?: () => Promise<void>;
}

export const useLongPress = (options: LongPressOptions = {}) => {
  const { threshold = 500, onLongPress } = options;
  const [isLongPressed, setIsLongPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsLongPressed(true);
      onLongPress?.();
    }, threshold);
  }, [threshold, onLongPress]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsLongPressed(false);
  }, []);

  return {
    isLongPressed,
    handlers: {
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: clear,
    },
  };
};

export const useSwipe = (options: SwipeOptions = {}) => {
  const { threshold = 50, onSwipeLeft, onSwipeRight } = options;
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }
  }, [threshold, onSwipeLeft, onSwipeRight]);

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

export const usePullToRefresh = (options: PullToRefreshOptions = {}) => {
  const { threshold = 80, resistance = 2.5, onRefresh } = options;
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number>(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (elementRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (startY.current === 0) return;
    
    const currentY = e.touches[0].clientY;
    const diff = (currentY - startY.current) / resistance;
    
    if (diff > 0) {
      setPullDistance(Math.min(diff, threshold * 1.5));
    }
  }, [resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh?.();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    startY.current = 0;
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  return {
    pullDistance,
    isRefreshing,
    elementRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

export const useDragToReorder = <T,>(initialItems: T[]) => {
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null) return;
    setTargetIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null || targetIndex === null) {
      setDraggedIndex(null);
      setTargetIndex(null);
      return;
    }

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(null);
    setTargetIndex(null);
  };

  return {
    items,
    draggedIndex,
    targetIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export const useMomentumScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);
  const velocity = useRef<number>(0);
  const lastX = useRef<number>(0);
  const animationFrame = useRef<number | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    lastX.current = e.pageX;
    
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    
    velocity.current = e.pageX - lastX.current;
    lastX.current = e.pageX;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // Apply momentum
    const decelerate = () => {
      if (!containerRef.current || Math.abs(velocity.current) < 0.5) return;
      
      containerRef.current.scrollLeft -= velocity.current;
      velocity.current *= 0.95;
      
      animationFrame.current = requestAnimationFrame(decelerate);
    };
    
    animationFrame.current = requestAnimationFrame(decelerate);
  }, []);

  return {
    containerRef,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
};
