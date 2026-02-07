import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface FlipTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

const FlipTabs = ({ tabs, defaultTab, className = '' }: FlipTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [direction, setDirection] = useState(0);

  const handleTabChange = (newTab: string) => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    const newIndex = tabs.findIndex((t) => t.id === newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveTab(newTab);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab buttons */}
      <div 
        className="flex gap-2 p-1.5 rounded-xl mb-6"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: activeTab !== tab.id ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeTab === tab.id && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.1))',
                  border: '1px solid hsl(var(--primary) / 0.3)',
                }}
                layoutId="activeTab"
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Content with 3D flip effect */}
      <div className="relative" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            initial={{
              rotateY: direction * 90,
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              rotateY: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              rotateY: direction * -90,
              opacity: 0,
              scale: 0.9,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FlipTabs;
