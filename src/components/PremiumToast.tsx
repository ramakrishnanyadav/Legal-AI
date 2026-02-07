import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToasts must be used within ToastProvider');
  return context;
};

// Individual Toast Component
const ToastItem = ({ 
  toast, 
  onRemove, 
  index 
}: { 
  toast: Toast; 
  onRemove: () => void;
  index: number;
}) => {
  const [progress, setProgress] = useState(100);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  const duration = toast.duration || 4000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        onRemove();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onRemove]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.velocity.x) > 200 || Math.abs(info.offset.x) > 100) {
      onRemove();
    }
  };

  const icons = {
    success: Check,
    error: X,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'border-l-green-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-primary',
  };

  const iconColors = {
    success: 'text-green-500 bg-green-500/10',
    error: 'text-red-500 bg-red-500/10',
    warning: 'text-yellow-500 bg-yellow-500/10',
    info: 'text-primary bg-primary/10',
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-primary',
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: index * 4, // Stack with 4px offset
      }}
      exit={{ 
        opacity: 0, 
        x: 100,
        transition: { duration: 0.2, ease: easeOut }
      }}
      transition={{ duration: 0.25, ease: easeOut }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, opacity }}
      className={`relative w-80 glass rounded-lg border-l-4 ${colors[toast.type]} overflow-hidden cursor-grab active:cursor-grabbing`}
    >
      {/* Content */}
      <div className="p-4 flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconColors[toast.type]}`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{toast.title}</p>
          {toast.message && (
            <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
          )}
        </div>

        {/* Close button */}
        <motion.button
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          onClick={onRemove}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Progress bar */}
      <div
        className={`h-0.5 ${progressColors[toast.type]}`}
        style={{ width: `${progress}%`, transition: 'width 50ms linear' }}
      />
    </motion.div>
  );
};

// Toast Container
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              index={index}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Hook for easy toast creation
export const usePremiumToast = () => {
  const { addToast } = useToasts();

  return {
    success: (title: string, message?: string) => 
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => 
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => 
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => 
      addToast({ type: 'info', title, message }),
  };
};

export default ToastProvider;
