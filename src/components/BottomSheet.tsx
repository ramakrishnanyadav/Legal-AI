import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useRef, useEffect } from 'react';
import { GripHorizontal, X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  title?: string;
}

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  children, 
  snapPoints = [0.5, 1],
  title,
}: BottomSheetProps) => {
  const [currentSnap, setCurrentSnap] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const maxHeight = windowHeight * 0.9;
  
  // Calculate snap heights
  const snapHeights = snapPoints.map(point => windowHeight * (1 - point));
  
  const backdropOpacity = useTransform(
    y,
    [snapHeights[snapHeights.length - 1], windowHeight],
    [0.5, 0]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const currentY = y.get();
    
    // Fast swipe down closes
    if (velocity > 500) {
      onClose();
      return;
    }
    
    // Fast swipe up goes to max
    if (velocity < -500) {
      setCurrentSnap(snapPoints.length - 1);
      return;
    }
    
    // Find nearest snap point
    let nearestSnap = 0;
    let nearestDistance = Infinity;
    
    snapHeights.forEach((height, index) => {
      const distance = Math.abs(currentY - height);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSnap = index;
      }
    });
    
    // If dragged past threshold, close
    if (currentY > windowHeight * 0.7) {
      onClose();
    } else {
      setCurrentSnap(nearestSnap);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ opacity: backdropOpacity }}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-3xl overflow-hidden"
            style={{ 
              y,
              maxHeight,
            }}
            initial={{ y: windowHeight }}
            animate={{ y: snapHeights[currentSnap] }}
            exit={{ y: windowHeight }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: snapHeights[snapHeights.length - 1], bottom: windowHeight }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <motion.div
                className="w-12 h-1.5 rounded-full bg-muted-foreground/30"
                whileHover={{ scale: 1.2, backgroundColor: 'hsl(var(--primary))' }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
            
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>
            )}
            
            {/* Content - independently scrollable */}
            <div 
              className="overflow-y-auto overscroll-contain"
              style={{ 
                height: `calc(${windowHeight * snapPoints[currentSnap]}px - ${title ? '80px' : '40px'})`,
              }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
