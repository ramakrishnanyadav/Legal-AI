import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n, locales, Locale } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

export const LanguageSelector = () => {
  const { locale, setLocale, localeConfig } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          'bg-card/50 border border-border hover:bg-card',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-lg" role="img" aria-label={localeConfig.name}>
          {localeConfig.flag}
        </span>
        <span className="text-sm font-medium hidden sm:inline">
          {localeConfig.code.toUpperCase()}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full right-0 mt-2 z-50',
              'w-56 max-h-80 overflow-auto',
              'bg-card border border-border rounded-xl shadow-xl',
              'py-2'
            )}
            role="listbox"
            aria-label="Available languages"
          >
            {Object.values(locales).map((localeOption) => (
              <button
                key={localeOption.code}
                onClick={() => handleSelect(localeOption.code)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5',
                  'hover:bg-muted/50 transition-colors',
                  'focus-visible:outline-none focus-visible:bg-muted/50',
                  locale === localeOption.code && 'bg-primary/10'
                )}
                role="option"
                aria-selected={locale === localeOption.code}
              >
                <span className="text-xl" role="img" aria-hidden="true">
                  {localeOption.flag}
                </span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground">
                    {localeOption.nativeName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {localeOption.name}
                  </p>
                </div>
                {locale === localeOption.code && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
