import { useEffect, useState, createContext, useContext, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import { useAudio } from './AudioManager';

// Easter egg types
interface EasterEggState {
  konamiActivated: boolean;
  matrixMode: boolean;
  secretStats: boolean;
  achievementsUnlocked: string[];
}

interface EasterEggContextType extends EasterEggState {
  unlockAchievement: (id: string) => void;
  toggleMatrixMode: () => void;
}

const EasterEggContext = createContext<EasterEggContextType | null>(null);

export const useEasterEggs = () => {
  const context = useContext(EasterEggContext);
  if (!context) {
    return {
      konamiActivated: false,
      matrixMode: false,
      secretStats: false,
      achievementsUnlocked: [],
      unlockAchievement: () => {},
      toggleMatrixMode: () => {},
    };
  }
  return context;
};

// Konami code sequence
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

// Console art
const CONSOLE_ART = `
%c
   ██╗     ███████╗ ██████╗  █████╗ ██╗      █████╗ ██╗
   ██║     ██╔════╝██╔════╝ ██╔══██╗██║     ██╔══██╗██║
   ██║     █████╗  ██║  ███╗███████║██║     ███████║██║
   ██║     ██╔══╝  ██║   ██║██╔══██║██║     ██╔══██║██║
   ███████╗███████╗╚██████╔╝██║  ██║███████╗██║  ██║██║
   ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝
   
   🔍 Found me! You're clearly a power user.
   Type 'legalai.secrets()' for surprises!
   
`;

// Achievement definitions
const ACHIEVEMENTS = {
  'first_analysis': { title: 'First Case', description: 'Analyzed your first legal situation' },
  'power_user': { title: 'Power User', description: 'Used 10 features' },
  'explorer': { title: 'Explorer', description: 'Visited all sections' },
  'night_owl': { title: 'Night Owl', description: 'Used the app after midnight' },
  'speed_demon': { title: 'Speed Demon', description: 'Completed an analysis in under 30 seconds' },
  'konami_master': { title: 'Konami Master', description: 'Discovered the secret code' },
};

// Easter Egg Provider
export const EasterEggProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<EasterEggState>({
    konamiActivated: false,
    matrixMode: false,
    secretStats: false,
    achievementsUnlocked: JSON.parse(localStorage.getItem('achievements') || '[]'),
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [konamiProgress, setKonamiProgress] = useState<string[]>([]);
  const { playSound } = useAudio();

  // Console art on load
  useEffect(() => {
    console.log(CONSOLE_ART, 'color: #00D9FF; font-family: monospace;');
    
    // Add secret function to window
    (window as any).legalai = {
      secrets: () => {
        console.log('%c🎉 Secret functions:', 'color: #7B2FFF; font-size: 16px;');
        console.log('%c• legalai.matrix() - Toggle matrix mode', 'color: #00D9FF;');
        console.log('%c• legalai.confetti() - Party time!', 'color: #FF006E;');
        console.log('%c• legalai.achievements() - View achievements', 'color: #00D9FF;');
      },
      matrix: () => {
        setState(s => ({ ...s, matrixMode: !s.matrixMode }));
        console.log('%c🖥️ Matrix mode toggled!', 'color: #00FF00;');
      },
      confetti: () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        console.log('%c🎊 Party time!', 'color: #FF006E;');
      },
      achievements: () => {
        const unlocked = JSON.parse(localStorage.getItem('achievements') || '[]');
        console.log('%c🏆 Achievements:', 'color: #FFD700; font-size: 16px;');
        Object.entries(ACHIEVEMENTS).forEach(([id, { title, description }]) => {
          const status = unlocked.includes(id) ? '✅' : '🔒';
          console.log(`${status} ${title}: ${description}`);
        });
      },
    };
  }, []);

  // Konami code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newProgress = [...konamiProgress, e.code].slice(-KONAMI_CODE.length);
      setKonamiProgress(newProgress);

      if (newProgress.join(',') === KONAMI_CODE.join(',')) {
        setState(s => ({ ...s, konamiActivated: true }));
        setShowConfetti(true);
        playSound('success');
        setTimeout(() => setShowConfetti(false), 5000);
        unlockAchievement('konami_master');
      }

      // Shift key reveals secret stats
      if (e.shiftKey) {
        setState(s => ({ ...s, secretStats: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        setState(s => ({ ...s, secretStats: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [konamiProgress, playSound]);

  // Night owl achievement
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 5) {
      unlockAchievement('night_owl');
    }
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setState(s => {
      if (s.achievementsUnlocked.includes(id)) return s;
      
      const newUnlocked = [...s.achievementsUnlocked, id];
      localStorage.setItem('achievements', JSON.stringify(newUnlocked));
      
      // Show toast notification for achievement
      console.log(`%c🏆 Achievement Unlocked: ${ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS]?.title}`, 
        'color: #FFD700; font-size: 14px; font-weight: bold;');
      
      return { ...s, achievementsUnlocked: newUnlocked };
    });
  }, []);

  const toggleMatrixMode = useCallback(() => {
    setState(s => ({ ...s, matrixMode: !s.matrixMode }));
  }, []);

  return (
    <EasterEggContext.Provider value={{ ...state, unlockAchievement, toggleMatrixMode }}>
      {children}
      
      {/* Konami confetti */}
      <Confetti active={showConfetti} particleCount={100} />
      
      {/* Matrix mode overlay */}
      <AnimatePresence>
        {state.matrixMode && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              mixBlendMode: 'multiply',
            }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, rgba(0,255,0,0.03) 1px, transparent 1px, transparent 2px)',
                animation: 'matrix-scroll 0.5s linear infinite',
              }}
            />
            <style>{`
              @keyframes matrix-scroll {
                0% { transform: translateY(0); }
                100% { transform: translateY(20px); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret stats overlay */}
      <AnimatePresence>
        {state.secretStats && (
          <motion.div
            className="fixed top-20 right-4 z-50 glass rounded-xl p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <p className="text-xs text-primary font-mono">Secret Stats</p>
            <p className="text-xs text-muted-foreground">FPS: 60</p>
            <p className="text-xs text-muted-foreground">Memory: 128MB</p>
            <p className="text-xs text-muted-foreground">Achievements: {state.achievementsUnlocked.length}/{Object.keys(ACHIEVEMENTS).length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </EasterEggContext.Provider>
  );
};

export default EasterEggProvider;
