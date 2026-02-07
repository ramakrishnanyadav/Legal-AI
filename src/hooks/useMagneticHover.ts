import { useRef, useState, useCallback } from 'react';

interface MagneticState {
  x: number;
  y: number;
}

export const useMagneticHover = (strength: number = 0.3, radius: number = 100) => {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState<MagneticState>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        const factor = (1 - distance / radius) * strength;
        setPosition({
          x: distanceX * factor,
          y: distanceY * factor,
        });
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};
