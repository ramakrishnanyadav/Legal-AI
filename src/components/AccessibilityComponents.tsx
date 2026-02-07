import { motion } from 'framer-motion';
import { useState, useEffect, ReactNode, forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/useAccessibility';

// Skip to content link
export const SkipToContent = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <a
      href="#main-content"
      className={cn(
        'fixed top-4 left-4 z-[9999] px-4 py-2 rounded-lg',
        'bg-primary text-primary-foreground font-medium',
        'transform -translate-y-full focus:translate-y-0',
        'transition-transform duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        'shadow-lg'
      )}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      Skip to main content
    </a>
  );
};

// Visually hidden text for screen readers
interface VisuallyHiddenProps {
  children: ReactNode;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const VisuallyHidden = ({ children, as: Component = 'span' }: VisuallyHiddenProps) => (
  <Component className="sr-only">{children}</Component>
);

// Live region for announcements
interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export const LiveRegion = ({ message, priority = 'polite' }: LiveRegionProps) => (
  <div
    role="status"
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// Beautiful focus ring component
interface FocusRingProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glow' | 'animated';
}

export const FocusRing = forwardRef<HTMLDivElement, FocusRingProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const focusClasses = {
      default: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      glow: 'focus-visible:shadow-[0_0_0_2px_hsl(var(--background)),0_0_0_4px_hsl(var(--primary)),0_0_20px_hsl(var(--primary)/0.5)]',
      animated: 'focus-visible:animate-focus-ring',
    };

    return (
      <div
        ref={ref}
        className={cn('focus-ring-wrapper', focusClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusRing.displayName = 'FocusRing';

// Accessible button with focus management
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  loading?: boolean;
  icon?: ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, ariaLabel, ariaDescribedBy, loading, icon, className, disabled, ...props }, ref) => {
    const { settings } = useAccessibility();

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:pointer-events-none',
          settings.reducedMotion ? 'transition-none' : 'transition-all duration-200',
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
        ) : icon ? (
          <span aria-hidden="true">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// Keyboard shortcut display
interface KeyboardHintProps {
  keys: string[];
  className?: string;
}

export const KeyboardHint = ({ keys, className }: KeyboardHintProps) => (
  <span className={cn('inline-flex items-center gap-1', className)}>
    {keys.map((key, i) => (
      <kbd
        key={i}
        className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border shadow-sm"
      >
        {key}
      </kbd>
    ))}
  </span>
);

// Focus indicator with animation
export const AnimatedFocusIndicator = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none rounded-[inherit]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] border-2 border-primary"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: '0 0 20px hsl(var(--primary) / 0.4)',
        }}
        animate={{
          boxShadow: [
            '0 0 20px hsl(var(--primary) / 0.4)',
            '0 0 30px hsl(var(--primary) / 0.6)',
            '0 0 20px hsl(var(--primary) / 0.4)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

// Accessible form field wrapper
interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export const FormField = ({ label, htmlFor, error, hint, required, children }: FormFieldProps) => {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground flex items-center gap-1"
      >
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">*</span>
        )}
        {required && <VisuallyHidden>(required)</VisuallyHidden>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      
      <div aria-describedby={cn(hintId, errorId)}>
        {children}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-destructive flex items-center gap-1" role="alert">
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Loading state with screen reader support
interface AccessibleLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
}

export const AccessibleLoading = ({ isLoading, loadingText = 'Loading...', children }: AccessibleLoadingProps) => (
  <div aria-busy={isLoading} aria-live="polite">
    {isLoading ? (
      <>
        <VisuallyHidden>{loadingText}</VisuallyHidden>
        <div className="flex items-center justify-center p-8">
          <div 
            className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
            aria-hidden="true"
          />
        </div>
      </>
    ) : children}
  </div>
);
