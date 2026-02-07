import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const springConfig = { damping: 20, stiffness: 300 };

const AnimatedToggle = ({
  checked: controlledChecked,
  onChange,
  label,
  disabled = false,
}: AnimatedToggleProps) => {
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setInternalChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <motion.label
      className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{ type: 'spring', ...springConfig }}
    >
      <motion.div
        className="relative w-14 h-8 rounded-full p-1 cursor-pointer"
        style={{
          background: isChecked 
            ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))' 
            : 'rgba(255, 255, 255, 0.1)',
          boxShadow: isChecked
            ? '0 0 20px rgba(0, 217, 255, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
            : 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
        onClick={handleToggle}
        animate={{
          background: isChecked 
            ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))' 
            : 'rgba(255, 255, 255, 0.1)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Track glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isChecked 
              ? '0 0 30px rgba(0, 217, 255, 0.4)' 
              : 'none',
          }}
          transition={{ type: 'spring', ...springConfig }}
        />

        {/* Thumb */}
        <motion.div
          className="w-6 h-6 rounded-full relative"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            x: isChecked ? 24 : 0,
            scale: isChecked ? 1 : 0.9,
          }}
          transition={{ type: 'spring', ...springConfig }}
        >
          {/* Inner highlight */}
          <motion.div
            className="absolute inset-1 rounded-full"
            style={{
              background: isChecked 
                ? 'radial-gradient(circle at 30% 30%, rgba(0, 217, 255, 0.3), transparent)'
                : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent)',
            }}
          />
        </motion.div>
      </motion.div>

      {label && (
        <span className="text-foreground">{label}</span>
      )}
    </motion.label>
  );
};

export default AnimatedToggle;
