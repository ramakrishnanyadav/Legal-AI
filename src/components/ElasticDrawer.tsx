import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { X } from 'lucide-react';

interface ElasticDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right' | 'bottom';
  width?: string;
}

const ElasticDrawer = ({
  isOpen,
  onClose,
  children,
  side = 'right',
  width = '400px',
}: ElasticDrawerProps) => {
  const [dragOffset, setDragOffset] = useState(0);

  const getInitialPosition = () => {
    switch (side) {
      case 'left':
        return { x: '-100%', y: 0 };
      case 'right':
        return { x: '100%', y: 0 };
      case 'bottom':
        return { x: 0, y: '100%' };
      default:
        return { x: '100%', y: 0 };
    }
  };

  const handleDrag = (_: any, info: PanInfo) => {
    if (side === 'right' && info.offset.x > 0) {
      setDragOffset(info.offset.x);
    } else if (side === 'left' && info.offset.x < 0) {
      setDragOffset(Math.abs(info.offset.x));
    } else if (side === 'bottom' && info.offset.y > 0) {
      setDragOffset(info.offset.y);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setDragOffset(0);
    if (
      (side === 'right' && info.offset.x > 100) ||
      (side === 'left' && info.offset.x < -100) ||
      (side === 'bottom' && info.offset.y > 100)
    ) {
      onClose();
    }
  };

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    bottom: 'left-0 right-0 bottom-0',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className={`fixed ${positionClasses[side]} z-50 overflow-hidden`}
            style={{
              width: side === 'bottom' ? '100%' : width,
              height: side === 'bottom' ? 'auto' : '100%',
              maxHeight: side === 'bottom' ? '80vh' : undefined,
            }}
            initial={getInitialPosition()}
            animate={{ 
              x: 0, 
              y: 0,
              transition: {
                type: 'spring',
                damping: 20,
                stiffness: 300,
                // Elastic bounce at end
                bounce: 0.3,
              },
            }}
            exit={{
              ...getInitialPosition(),
              transition: {
                type: 'spring',
                damping: 25,
                stiffness: 200,
              },
            }}
            drag={side === 'bottom' ? 'y' : 'x'}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={{ left: 0, right: 0.5, top: 0, bottom: 0.5 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <div
              className="h-full rounded-l-2xl overflow-hidden"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Drag handle */}
              {side === 'bottom' && (
                <div className="flex justify-center py-3">
                  <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              )}
              
              {/* Close button */}
              <motion.button
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
              
              <div className="p-6 pt-12 h-full overflow-auto">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ElasticDrawer;
