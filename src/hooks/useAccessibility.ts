import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/performance';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  largeText: boolean;
  animationsEnabled: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

export const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  dyslexiaFont: false,
  largeText: false,
  animationsEnabled: true,
};

export const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    return {
      settings: defaultSettings,
      updateSetting: () => {},
      toggleSetting: () => {},
      announceToScreenReader: () => {},
    };
  }
  return context;
};

// Hook for focus management
export const useFocusTrap = (isActive: boolean) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    firstElement?.focus();

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive, container]);

  return setContainer;
};

// Hook for restoring focus
export const useFocusRestore = () => {
  const [previousFocus, setPreviousFocus] = useState<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    setPreviousFocus(document.activeElement as HTMLElement);
  }, []);

  const restoreFocus = useCallback(() => {
    previousFocus?.focus();
    setPreviousFocus(null);
  }, [previousFocus]);

  return { saveFocus, restoreFocus };
};

// Hook for keyboard shortcuts
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {}
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const matchesKey = e.key.toLowerCase() === key.toLowerCase();
      const matchesCtrl = options.ctrl ? e.ctrlKey : !e.ctrlKey;
      const matchesAlt = options.alt ? e.altKey : !e.altKey;
      const matchesShift = options.shift ? e.shiftKey : !e.shiftKey;
      const matchesMeta = options.meta ? e.metaKey : !e.metaKey;

      if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options.ctrl, options.alt, options.shift, options.meta]);
};
