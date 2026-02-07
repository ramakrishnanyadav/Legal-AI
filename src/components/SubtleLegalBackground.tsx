import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, createContext, useContext } from 'react';
import { Scale } from 'lucide-react';

interface LegalSymbol {
  id: number;
  x: number;
  y: number;
  type: 'scale' | 'paragraph' | 'section';
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface BackgroundSettings {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const BackgroundContext = createContext<BackgroundSettings>({
  enabled: true,
  setEnabled: () => {},
});

export const useBackgroundSettings = () => useContext(BackgroundContext);

export const BackgroundSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legalBackgroundEnabled');
      return saved !== 'false';
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('legalBackgroundEnabled', String(enabled));
  }, [enabled]);

  return (
    <BackgroundContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </BackgroundContext.Provider>
  );
};

// Single legal symbol component
const LegalSymbolElement = ({ symbol }: { symbol: LegalSymbol }) => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 1000], [0, symbol.y * 0.1]);

  const renderSymbol = () => {
    switch (symbol.type) {
      case 'scale':
        return <Scale className="w-full h-full" strokeWidth={1} />;
      case 'paragraph':
        return <span className="font-serif">¶</span>;
      case 'section':
        return <span className="font-serif">§</span>;
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none text-foreground/[0.08]"
      style={{
        left: `${symbol.x}%`,
        top: `${symbol.y}%`,
        width: symbol.size,
        height: symbol.size,
        y: parallaxY,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: symbol.opacity,
        y: [0, -20, 0],
        x: [0, 5, -5, 0],
      }}
      transition={{
        opacity: { duration: 2, delay: symbol.delay },
        y: {
          duration: symbol.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: symbol.delay,
        },
        x: {
          duration: symbol.duration * 1.3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: symbol.delay,
        },
      }}
    >
      {renderSymbol()}
    </motion.div>
  );
};

// Main background component - only for hero section
const SubtleLegalBackground = () => {
  const { enabled } = useBackgroundSettings();
  const [symbols, setSymbols] = useState<LegalSymbol[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!enabled || prefersReducedMotion) {
      setSymbols([]);
      return;
    }

    // Create sparse, subtle symbols
    const types: ('scale' | 'paragraph' | 'section')[] = ['scale', 'paragraph', 'section'];
    const newSymbols: LegalSymbol[] = [];

    // Only 8-12 symbols for subtlety
    const count = 8 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
      newSymbols.push({
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 80 + 10,
        type: types[Math.floor(Math.random() * types.length)],
        size: 16 + Math.random() * 16, // 16-32px
        opacity: 0.06 + Math.random() * 0.06, // 6-12% opacity
        duration: 20 + Math.random() * 15, // Very slow: 20-35s
        delay: Math.random() * 5,
      });
    }

    setSymbols(newSymbols);
  }, [enabled, prefersReducedMotion]);

  if (!enabled || prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((symbol) => (
        <LegalSymbolElement key={symbol.id} symbol={symbol} />
      ))}
    </div>
  );
};

export default SubtleLegalBackground;
