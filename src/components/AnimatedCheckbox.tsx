import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const AnimatedCheckbox = ({
  checked: controlledChecked,
  onChange,
  label,
  disabled = false,
}: AnimatedCheckboxProps) => {
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
      className={`flex items-center gap-3 cursor-pointer select-none px-4 py-3 rounded-xl min-h-[48px] transition-all duration-200 ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-white/5'
      } ${isChecked ? 'bg-primary/10 border border-primary/30' : 'bg-white/5 border border-white/10'}`}
      whileHover={!disabled ? { scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={handleToggle}
    >
      <motion.div
        className="relative w-5 h-5 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{
          background: isChecked 
            ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' 
            : 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${isChecked ? 'transparent' : 'rgba(255, 255, 255, 0.2)'}`,
        }}
        animate={{
          scale: isChecked ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 14"
          fill="none"
          className="absolute"
        >
          <motion.path
            d="M2 7L5.5 10.5L12 3.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: isChecked ? 1 : 0,
              opacity: isChecked ? 1 : 0,
            }}
            transition={{ 
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
              delay: isChecked ? 0.05 : 0,
            }}
          />
        </svg>
      </motion.div>

      {label && (
        <span className={`text-sm font-medium ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>
          {label}
        </span>
      )}
    </motion.label>
  );
};

export default AnimatedCheckbox;
