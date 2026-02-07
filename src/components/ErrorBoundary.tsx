import { Component, ReactNode, ErrorInfo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    
    // Send to analytics/monitoring (placeholder)
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('error', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// Beautiful error fallback component
interface ErrorFallbackProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export const ErrorFallback = ({
  error,
  onRetry,
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again.",
}: ErrorFallbackProps) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onRetry?.();
    setIsRetrying(false);
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </motion.div>
        </motion.div>

        {/* Error message */}
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="gap-2"
            >
              <motion.div
                animate={isRetrying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, repeat: isRetrying ? Infinity : 0, ease: 'linear' }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Error details (collapsed by default) */}
        {error && process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Technical Details
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  );
};

// Import React for the useState hook
import React from 'react';

// Section-level error boundary with custom styling
interface SectionErrorBoundaryProps {
  children: ReactNode;
  sectionName?: string;
}

export const SectionErrorBoundary = ({ children, sectionName }: SectionErrorBoundaryProps) => (
  <ErrorBoundary
    fallback={
      <div className="py-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
          <AlertTriangle className="w-4 h-4" />
          {sectionName ? `${sectionName} couldn't load` : 'This section couldn\'t load'}
        </div>
      </div>
    }
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
