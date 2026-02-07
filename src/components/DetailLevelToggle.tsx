import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Minus, Plus } from 'lucide-react';

type DetailLevel = 'simple' | 'detailed';

interface DetailLevelContextType {
  detailLevel: DetailLevel;
  setDetailLevel: (level: DetailLevel) => void;
}

const DetailLevelContext = createContext<DetailLevelContextType>({
  detailLevel: 'simple',
  setDetailLevel: () => {},
});

export const useDetailLevel = () => useContext(DetailLevelContext);

export const DetailLevelProvider = ({ children }: { children: ReactNode }) => {
  const [detailLevel, setDetailLevel] = useState<DetailLevel>(() => {
    const saved = localStorage.getItem('detailLevel');
    return (saved as DetailLevel) || 'simple';
  });

  useEffect(() => {
    localStorage.setItem('detailLevel', detailLevel);
  }, [detailLevel]);

  return (
    <DetailLevelContext.Provider value={{ detailLevel, setDetailLevel }}>
      {children}
    </DetailLevelContext.Provider>
  );
};

// Toggle component
export const DetailLevelToggle = () => {
  const { detailLevel, setDetailLevel } = useDetailLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
    >
      <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Detail:</span>
      
      <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
        <motion.button
          onClick={() => setDetailLevel('simple')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-h-[32px] ${
            detailLevel === 'simple' 
              ? 'bg-primary/20 text-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Minus className="w-3 h-3" />
          Simple
        </motion.button>
        
        <motion.button
          onClick={() => setDetailLevel('detailed')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-h-[32px] ${
            detailLevel === 'detailed' 
              ? 'bg-primary/20 text-primary' 
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-3 h-3" />
          Detailed
        </motion.button>
      </div>
    </motion.div>
  );
};

// Wrapper for content that changes based on detail level
interface DetailContentProps {
  simple: ReactNode;
  detailed: ReactNode;
}

export const DetailContent = ({ simple, detailed }: DetailContentProps) => {
  const { detailLevel } = useDetailLevel();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={detailLevel}
        initial={{ opacity: 0, height: 'auto' }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {detailLevel === 'simple' ? simple : detailed}
      </motion.div>
    </AnimatePresence>
  );
};

export default DetailLevelToggle;
