import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface IrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  originX?: number;
  originY?: number;
}

const IrisModal = ({
  isOpen,
  onClose,
  children,
  originX = 50,
  originY = 50,
}: IrisModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal with iris expand effect */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              className="relative max-w-lg w-full mx-4 rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                transformOrigin: `${originX}% ${originY}%`,
              }}
              initial={{
                clipPath: `circle(0% at ${originX}% ${originY}%)`,
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                clipPath: 'circle(150% at 50% 50%)',
                scale: 1,
                opacity: 1,
              }}
              exit={{
                clipPath: `circle(0% at ${originX}% ${originY}%)`,
                scale: 0.8,
                opacity: 0,
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
            >
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
              
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Hook to track click position for iris effect
export const useIrisModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const open = useCallback((e?: React.MouseEvent) => {
    if (e) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin({ x, y });
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close, origin };
};

export default IrisModal;
