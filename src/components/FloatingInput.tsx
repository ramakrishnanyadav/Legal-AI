import { motion } from 'framer-motion';
import { useState, forwardRef } from 'react';

interface FloatingInputProps {
  label: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const springConfig = { damping: 20, stiffness: 300 };

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className = '', value, defaultValue, onChange, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value || !!defaultValue);

    const isFloating = isFocused || hasValue;

    return (
      <div className={`relative ${className}`}>
        <motion.label
          className="absolute left-4 pointer-events-none origin-left"
          initial={false}
          animate={{
            y: isFloating ? -24 : 12,
            scale: isFloating ? 0.85 : 1,
            color: isFocused 
              ? 'hsl(187 100% 50%)' 
              : error 
                ? 'hsl(0 84% 60%)' 
                : 'hsl(225 15% 60%)',
          }}
          transition={{ type: 'spring', ...springConfig }}
        >
          {label}
        </motion.label>

        <input
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          {...props}
          className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 text-foreground bg-transparent"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${error ? 'hsl(0 84% 60%)' : isFocused ? 'hsl(187 100% 50%)' : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: isFocused 
              ? '0 0 20px rgba(0, 217, 255, 0.2), inset 0 1px 2px rgba(0, 0, 0, 0.2)' 
              : 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            onChange?.(e);
          }}
        />

        {error && (
          <motion.span
            className="absolute -bottom-5 left-0 text-xs text-destructive"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', ...springConfig }}
          >
            {error}
          </motion.span>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export default FloatingInput;
