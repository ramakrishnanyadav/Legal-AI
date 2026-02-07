import { useEffect, useRef } from 'react';

interface MeshGradientCanvasProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

const MeshGradientCanvas = ({ 
  className = '',
  colors = ['#00D9FF', '#7B2FFF', '#FF006E', '#00D9FF'],
  speed = 0.002,
}: MeshGradientCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    // Control points for the mesh
    const points = [
      { x: 0.2, y: 0.2, vx: 0.001, vy: 0.0015 },
      { x: 0.8, y: 0.3, vx: -0.0012, vy: 0.001 },
      { x: 0.3, y: 0.7, vx: 0.0008, vy: -0.001 },
      { x: 0.7, y: 0.8, vx: -0.001, vy: -0.0008 },
      { x: 0.5, y: 0.5, vx: 0.0005, vy: 0.0005 },
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      const { width, height } = canvas;

      // Clear with dark background
      ctx.fillStyle = 'hsl(230, 60%, 10%)';
      ctx.fillRect(0, 0, width, height);

      // Update point positions
      points.forEach(point => {
        point.x += point.vx + Math.sin(time * 2 + point.x * 10) * 0.0005;
        point.y += point.vy + Math.cos(time * 2 + point.y * 10) * 0.0005;

        // Bounce off edges
        if (point.x < 0.1 || point.x > 0.9) point.vx *= -1;
        if (point.y < 0.1 || point.y > 0.9) point.vy *= -1;

        // Keep in bounds
        point.x = Math.max(0.05, Math.min(0.95, point.x));
        point.y = Math.max(0.05, Math.min(0.95, point.y));
      });

      // Draw gradient circles at each point
      points.forEach((point, i) => {
        const x = point.x * width;
        const y = point.y * height;
        const radius = Math.min(width, height) * 0.5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, colors[i % colors.length] + '40');
        gradient.addColorStop(0.5, colors[i % colors.length] + '20');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      // Add noise/grain texture
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 10;
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
      
      ctx.putImageData(imageData, 0, 0);

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
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
};

export default MeshGradientCanvas;
