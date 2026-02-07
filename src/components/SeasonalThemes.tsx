import { createContext, useContext, ReactNode } from 'react';

// Simplified seasonal context - no particle effects
interface SeasonalTheme {
  season: 'winter' | 'spring' | 'summer' | 'fall' | 'none';
  isHoliday: boolean;
  holidayName?: string;
}

const SeasonalContext = createContext<SeasonalTheme>({
  season: 'none',
  isHoliday: false,
});

export const useSeasonal = () => useContext(SeasonalContext);

// Detect current season (for potential theming, not effects)
const getSeasonalTheme = (): SeasonalTheme => {
  const now = new Date();
  const month = now.getMonth();

  // Seasons (Northern Hemisphere) - no particles, just context
  if (month >= 11 || month <= 1) return { season: 'winter', isHoliday: false };
  if (month >= 2 && month <= 4) return { season: 'spring', isHoliday: false };
  if (month >= 5 && month <= 7) return { season: 'summer', isHoliday: false };
  return { season: 'fall', isHoliday: false };
};

// Clean provider - no snowflakes, no leaves, no holiday banners
export const SeasonalProvider = ({ children }: { children: ReactNode }) => {
  const theme = getSeasonalTheme();

  return (
    <SeasonalContext.Provider value={theme}>
      {children}
    </SeasonalContext.Provider>
  );
};

export default SeasonalProvider;
