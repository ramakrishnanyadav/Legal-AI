import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}

const PremiumModal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = '' 
}: PremiumModalProps) => {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Ripple effect on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create ripple element
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: ripple-out 0.6s ease-out forwards;
    `;
    
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackdropClick}
            style={{ perspective: '1000px' }}
          >
            {/* Blur backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(12px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
            />
            
            {/* Modal */}
            <motion.div
              className={`relative z-10 w-full max-w-lg mx-4 glass rounded-2xl overflow-hidden ${className}`}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50,
                rotateX: -15 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                rotateX: 0 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 50,
                rotateX: 15 
              }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className="relative px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <motion.h2 
                      className="text-xl font-bold text-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {title}
                    </motion.h2>
                    
                    {/* Close button */}
                    <motion.button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  </div>
                  
                  {/* Animated gradient underline */}
                  <motion.div
                    className="absolute bottom-0 left-6 right-6 h-px"
                    style={{
                      background: 'linear-gradient(90deg, hsl(187 100% 50%), hsl(266 93% 58%), hsl(336 100% 50%))',
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  />
                </div>
              )}
              
              {/* Content */}
              <motion.div
                className="px-6 pb-6 pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {children}
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Ripple animation styles */}
          <style>{`
            @keyframes ripple-out {
              to {
                width: 500px;
                height: 500px;
                opacity: 0;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
