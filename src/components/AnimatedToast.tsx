import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// Professional ease-out timing
const easeOut = [0.25, 0.46, 0.45, 0.94];

const icons = {
  success: Check,
  error: X,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-yellow-500',
  info: 'border-l-primary',
};

const iconBg = {
  success: 'bg-green-500/20 text-green-500',
  error: 'bg-red-500/20 text-red-500',
  warning: 'bg-yellow-500/20 text-yellow-500',
  info: 'bg-primary/20 text-primary',
};

let toastId = 0;
const listeners: Set<(toast: ToastMessage) => void> = new Set();

export const showToast = (type: ToastMessage['type'], title: string, message?: string) => {
  const toast: ToastMessage = { id: ++toastId, type, title, message };
  listeners.forEach((listener) => listener(toast));
};

const AnimatedToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => {
          const Icon = icons[toast.type];

          return (
            <motion.div
              key={toast.id}
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
              className="relative max-w-sm"
            >
              <div
                className={`rounded-lg p-4 pr-12 backdrop-blur-md border-l-4 ${colors[toast.type]}`}
                style={{
                  background: 'hsl(var(--background) / 0.95)',
                  border: '1px solid hsl(var(--border))',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg[toast.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {toast.title}
                    </h4>
                    {toast.message && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {toast.message}
                      </p>
                    )}
                  </div>
                </div>

                <motion.button
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                  onClick={() => removeToast(toast.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>

                {/* Progress bar */}
                <motion.div
                  className={`absolute bottom-0 left-0 h-0.5 ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : toast.type === 'warning' ? 'bg-yellow-500' : 'bg-primary'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  style={{ borderRadius: '0 0 0 8px' }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedToast;
