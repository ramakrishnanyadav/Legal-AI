import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AccessibilityContext, AccessibilitySettings, defaultSettings } from '@/hooks/useAccessibility';
import { prefersReducedMotion } from '@/lib/performance';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === 'undefined') return defaultSettings;
    
    const saved = localStorage.getItem('accessibility-settings');
    const parsed = saved ? JSON.parse(saved) : defaultSettings;
    
    return {
      ...parsed,
      reducedMotion: parsed.reducedMotion || prefersReducedMotion(),
    };
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setSettings(prev => ({ ...prev, reducedMotion: true }));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    const html = document.documentElement;
    html.classList.toggle('reduced-motion', settings.reducedMotion || !settings.animationsEnabled);
    html.classList.toggle('high-contrast', settings.highContrast);
    html.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    html.classList.toggle('large-text', settings.largeText);
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((key: keyof AccessibilitySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }, []);

  const value = { settings, updateSetting, toggleSetting, announceToScreenReader };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
