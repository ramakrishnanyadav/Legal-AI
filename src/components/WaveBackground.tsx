import { useEffect, useRef } from 'react';

interface WaveBackgroundProps {
  className?: string;
  color?: string;
  speed?: number;
  amplitude?: number;
}

const WaveBackground = ({ 
  className = '',
  color = 'hsl(187 100% 50%)',
  speed = 0.02,
  amplitude = 50,
}: WaveBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 0.5;
        const layerAmplitude = amplitude * (1 - layer * 0.2);
        const layerOpacity = 0.1 - layer * 0.03;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 5) {
          const y = height / 2 + 
            Math.sin(x * 0.01 + time + layerOffset) * layerAmplitude +
            Math.sin(x * 0.02 + time * 1.5 + layerOffset) * (layerAmplitude * 0.5) +
            Math.cos(x * 0.005 + time * 0.5 + layerOffset) * (layerAmplitude * 0.3);
          
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Create gradient fill
        const gradient = ctx.createLinearGradient(0, height / 2 - amplitude, 0, height);
        gradient.addColorStop(0, `hsla(187, 100%, 50%, ${layerOpacity})`);
        gradient.addColorStop(0.5, `hsla(266, 93%, 58%, ${layerOpacity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fill();
      }

      time += speed;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [color, speed, amplitude]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default WaveBackground;
