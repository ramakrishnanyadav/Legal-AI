import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ScrollSnapSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const ScrollSnapSection = ({ children, className = '', id }: ScrollSnapSectionProps) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`min-h-screen snap-start snap-always ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: isInView ? 1 : 0.5 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.section>
  );
};

// Container for scroll snap
export const ScrollSnapContainer = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`snap-y snap-mandatory overflow-y-auto h-screen ${className}`}>
      {children}
    </div>
  );
};

// Horizontal scroll snap
export const HorizontalSnapScroll = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div 
      className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide ${className}`}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
};

export const HorizontalSnapItem = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`flex-shrink-0 snap-center ${className}`}>
      {children}
    </div>
  );
};

export default ScrollSnapSection;
