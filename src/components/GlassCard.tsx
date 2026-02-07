import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: boolean;
  index?: number;
  variant?: 'default' | 'dark' | 'strong';
  padding?: 'sm' | 'md' | 'lg';
}

// Consistent easing from design system
const easeOut = [0.4, 0.0, 0.2, 1];

const GlassCard = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  gradient = false,
  index = 0,
  variant = 'default',
  padding = 'md',
}: GlassCardProps) => {
  // Calculate stagger delay (50ms between elements)
  const staggerDelay = delay + index * 0.05;

  const variantClasses = {
    default: 'glass',
    dark: 'glass-dark',
    strong: 'glass-strong',
  };

  // Consistent padding based on 8px grid
  const paddingClasses = {
    sm: 'p-4',   // 16px
    md: 'p-6',   // 24px
    lg: 'p-8',   // 32px
  };

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ 
        duration: 0.3,
        delay: staggerDelay,
        ease: easeOut,
      }}
      whileHover={hover ? { 
        y: -4, 
        transition: { duration: 0.2, ease: easeOut }
      } : undefined}
    >
      {gradient && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' }}
        />
      )}
      
      <div className={`relative ${variantClasses[variant]} rounded-2xl ${paddingClasses[padding]} h-full overflow-hidden transition-all duration-200`}>
        {/* Subtle inner glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            background: 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.05) 0%, transparent 50%)',
          }}
        />
        
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

export default GlassCard;
