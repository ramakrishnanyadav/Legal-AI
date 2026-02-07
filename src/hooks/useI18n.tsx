import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Supported locales
export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'zh' | 'ja' | 'pt';

interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

export const locales: Record<Locale, LocaleConfig> = {
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr', dateFormat: 'MM/dd/yyyy', numberFormat: { style: 'decimal' } },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr', dateFormat: 'dd/MM/yyyy', numberFormat: { style: 'decimal' } },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr', dateFormat: 'dd/MM/yyyy', numberFormat: { style: 'decimal' } },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr', dateFormat: 'dd.MM.yyyy', numberFormat: { style: 'decimal' } },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl', dateFormat: 'yyyy/MM/dd', numberFormat: { style: 'decimal' } },
  zh: { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr', dateFormat: 'yyyy/MM/dd', numberFormat: { style: 'decimal' } },
  ja: { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr', dateFormat: 'yyyy/MM/dd', numberFormat: { style: 'decimal' } },
  pt: { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr', dateFormat: 'dd/MM/yyyy', numberFormat: { style: 'decimal' } },
};

// Translation type
type TranslationKey = string;
type Translations = Record<Locale, Record<TranslationKey, string>>;

// Default translations (English only - add others as needed)
const defaultTranslations: Translations = {
  en: {
    'nav.analyzer': 'Analyzer',
    'nav.howItWorks': 'How It Works',
    'nav.findLawyer': 'Find Lawyer',
    'nav.resources': 'Resources',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    'hero.title': 'Know Your Legal Rights Instantly',
    'hero.subtitle': 'AI-powered legal analysis at your fingertips',
    'hero.cta': 'Analyze Your Case',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Try Again',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.close': 'Close',
    'accessibility.reducedMotion': 'Reduce Motion',
    'accessibility.highContrast': 'High Contrast',
    'accessibility.largeText': 'Large Text',
    'accessibility.dyslexiaFont': 'Dyslexia-Friendly Font',
  },
  es: {
    'nav.analyzer': 'Analizador',
    'nav.howItWorks': 'Cómo Funciona',
    'nav.findLawyer': 'Buscar Abogado',
    'nav.resources': 'Recursos',
    'nav.signIn': 'Iniciar Sesión',
    'nav.getStarted': 'Comenzar',
    'hero.title': 'Conoce Tus Derechos Legales al Instante',
    'hero.subtitle': 'Análisis legal impulsado por IA',
    'hero.cta': 'Analizar Tu Caso',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.retry': 'Reintentar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.close': 'Cerrar',
    'accessibility.reducedMotion': 'Reducir Movimiento',
    'accessibility.highContrast': 'Alto Contraste',
    'accessibility.largeText': 'Texto Grande',
    'accessibility.dyslexiaFont': 'Fuente para Dislexia',
  },
  fr: {},
  de: {},
  ar: {},
  zh: {},
  ja: {},
  pt: {},
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  dir: 'ltr' | 'rtl';
  localeConfig: LocaleConfig;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    // Return default English context
    return {
      locale: 'en' as Locale,
      setLocale: () => {},
      t: (key: string) => defaultTranslations.en[key] || key,
      formatDate: (date: Date) => date.toLocaleDateString('en-US'),
      formatNumber: (num: number) => num.toLocaleString('en-US'),
      formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
      dir: 'ltr' as const,
      localeConfig: locales.en,
    };
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export const I18nProvider = ({ children, defaultLocale = 'en' }: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return defaultLocale;
    
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && locales[saved]) return saved;
    
    // Detect from browser
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (locales[browserLang]) return browserLang;
    
    return defaultLocale;
  });

  const localeConfig = locales[locale];

  // Update document direction for RTL languages
  useEffect(() => {
    document.documentElement.dir = localeConfig.dir;
    document.documentElement.lang = locale;
    localStorage.setItem('locale', locale);
  }, [locale, localeConfig.dir]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (locales[newLocale]) {
      setLocaleState(newLocale);
    }
  }, []);

  const t = useCallback((key: TranslationKey, params?: Record<string, string | number>) => {
    let translation = defaultTranslations[locale]?.[key] || defaultTranslations.en[key] || key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        translation = translation.replace(`{{${k}}}`, String(v));
      });
    }
    
    return translation;
  }, [locale]);

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat(locale).format(date);
  }, [locale]);

  const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale, options).format(num);
  }, [locale]);

  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }, [locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatDate,
        formatNumber,
        formatCurrency,
        dir: localeConfig.dir,
        localeConfig,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};
