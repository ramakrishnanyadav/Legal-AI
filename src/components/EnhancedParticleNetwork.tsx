import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  originalOpacity: number;
  pulsePhase: number;
}

interface Connection {
  from: number;
  to: number;
  progress: number;
  speed: number;
  active: boolean;
}

const EnhancedParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.floor((width * height) / 15000);
    
    for (let i = 0; i < Math.min(particleCount, 80); i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        originalOpacity: Math.random() * 0.5 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    
    particlesRef.current = particles;
    
    // Initialize some random connections with flowing data
    const connections: Connection[] = [];
    for (let i = 0; i < 10; i++) {
      connections.push({
        from: Math.floor(Math.random() * particles.length),
        to: Math.floor(Math.random() * particles.length),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
        active: Math.random() > 0.5,
      });
    }
    connectionsRef.current = connections;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      
      const { width, height } = canvas;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const connections = connectionsRef.current;
      const time = Date.now() * 0.001;

      // Clear with fade effect for trails
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Calculate distance to mouse
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        // Glow effect near cursor
        const glowRadius = 150;
        const glowIntensity = Math.max(0, 1 - distToMouse / glowRadius);
        
        // Pulse animation
        particle.pulsePhase += 0.02;
        const pulse = Math.sin(particle.pulsePhase) * 0.3 + 1;
        
        // Dynamic opacity based on cursor proximity
        particle.opacity = particle.originalOpacity + glowIntensity * 0.5;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3 * pulse
        );
        
        const baseColor = glowIntensity > 0.3 
          ? `rgba(0, 217, 255, ${particle.opacity})` 
          : `rgba(0, 217, 255, ${particle.opacity * 0.6})`;
        
        gradient.addColorStop(0, baseColor);
        gradient.addColorStop(0.5, `rgba(0, 217, 255, ${particle.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (distance < maxDist) {
            const opacity = (1 - distance / maxDist) * 0.3;
            
            // Check if connection is near mouse for enhanced effect
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const distToMouse = Math.sqrt(
              Math.pow(midX - mouse.x, 2) + Math.pow(midY - mouse.y, 2)
            );
            const nearMouse = distToMouse < 100;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = nearMouse 
              ? `rgba(0, 217, 255, ${opacity * 2})` 
              : `rgba(0, 217, 255, ${opacity})`;
            ctx.lineWidth = nearMouse ? 1.5 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw flowing data through connections
      connections.forEach((conn, idx) => {
        if (!conn.active || !particles[conn.from] || !particles[conn.to]) return;
        
        const p1 = particles[conn.from];
        const p2 = particles[conn.to];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 200) {
          // Reset connection to random particles
          conn.from = Math.floor(Math.random() * particles.length);
          conn.to = Math.floor(Math.random() * particles.length);
          conn.progress = 0;
          return;
        }

        // Update progress
        conn.progress += conn.speed;
        if (conn.progress > 1) {
          conn.progress = 0;
          // Occasionally switch connections
          if (Math.random() > 0.7) {
            conn.from = conn.to;
            conn.to = Math.floor(Math.random() * particles.length);
          }
        }

        // Draw data pulse
        const pulseX = p1.x + dx * conn.progress;
        const pulseY = p1.y + dy * conn.progress;
        
        const pulseGradient = ctx.createRadialGradient(
          pulseX, pulseY, 0,
          pulseX, pulseY, 8
        );
        pulseGradient.addColorStop(0, 'rgba(123, 47, 247, 0.8)');
        pulseGradient.addColorStop(0.5, 'rgba(0, 217, 255, 0.4)');
        pulseGradient.addColorStop(1, 'rgba(0, 217, 255, 0)');

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 8, 0, Math.PI * 2);
        ctx.fillStyle = pulseGradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default EnhancedParticleNetwork;
