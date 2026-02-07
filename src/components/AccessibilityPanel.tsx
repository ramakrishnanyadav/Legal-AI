import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Volume2, Type, Zap, X, Check } from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/utils';
import { KeyboardHint } from './AccessibilityComponents';

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
}

const SettingToggle = ({ label, description, checked, onChange, icon }: SettingToggleProps) => (
  <button
    onClick={onChange}
    className={cn(
      'w-full flex items-start gap-3 p-3 rounded-lg text-left',
      'transition-colors duration-200',
      'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    )}
    role="switch"
    aria-checked={checked}
  >
    <span className={cn(
      'flex-shrink-0 p-2 rounded-lg',
      checked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
    )}>
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <span className={cn(
      'flex-shrink-0 w-10 h-6 rounded-full p-1 transition-colors duration-200',
      checked ? 'bg-primary' : 'bg-muted'
    )}>
      <motion.span
        className="block w-4 h-4 rounded-full bg-foreground shadow-sm"
        animate={{ x: checked ? 16 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </span>
  </button>
);

export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, toggleSetting, announceToScreenReader } = useAccessibility();

  // Keyboard shortcut to open panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggle = (key: keyof typeof settings, label: string) => {
    toggleSetting(key);
    const newValue = !settings[key];
    announceToScreenReader(`${label} ${newValue ? 'enabled' : 'disabled'}`);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-20 left-4 z-50 p-3 rounded-full',
          'bg-card/90 backdrop-blur-xl border border-border',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'group'
        )}
        aria-label="Open accessibility settings"
        title="Accessibility settings (Alt+A)"
      >
        <Settings className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Panel content */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm',
                'bg-card border-r border-border shadow-2xl',
                'flex flex-col'
              )}
              role="dialog"
              aria-modal="true"
              aria-label="Accessibility settings"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Accessibility</h2>
                  <p className="text-sm text-muted-foreground">Customize your experience</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'p-2 rounded-lg hover:bg-muted',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-ring'
                  )}
                  aria-label="Close accessibility settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <SettingToggle
                  label="Reduce Motion"
                  description="Minimize animations and movement"
                  checked={settings.reducedMotion}
                  onChange={() => handleToggle('reducedMotion', 'Reduced motion')}
                  icon={<Zap className="w-4 h-4" />}
                />

                <SettingToggle
                  label="High Contrast"
                  description="Increase color contrast for better visibility"
                  checked={settings.highContrast}
                  onChange={() => handleToggle('highContrast', 'High contrast')}
                  icon={<Eye className="w-4 h-4" />}
                />

                <SettingToggle
                  label="Dyslexia-Friendly Font"
                  description="Use a font designed for easier reading"
                  checked={settings.dyslexiaFont}
                  onChange={() => handleToggle('dyslexiaFont', 'Dyslexia font')}
                  icon={<Type className="w-4 h-4" />}
                />

                <SettingToggle
                  label="Large Text"
                  description="Increase text size throughout the app"
                  checked={settings.largeText}
                  onChange={() => handleToggle('largeText', 'Large text')}
                  icon={<Type className="w-5 h-5" />}
                />

                <SettingToggle
                  label="Enable Animations"
                  description="Show smooth transitions and effects"
                  checked={settings.animationsEnabled}
                  onChange={() => handleToggle('animationsEnabled', 'Animations')}
                  icon={<Zap className="w-4 h-4" />}
                />
              </div>

              {/* Footer with keyboard hints */}
              <div className="p-4 border-t border-border bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">Keyboard shortcuts:</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Toggle this panel</span>
                    <KeyboardHint keys={['Alt', 'A']} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Skip to content</span>
                    <KeyboardHint keys={['Tab']} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityPanel;
