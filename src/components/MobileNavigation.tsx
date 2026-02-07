import { motion, AnimatePresence } from 'framer-motion';
import { useState, ReactNode } from 'react';
import { Menu, X, Home, Scale, FileText, Users, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" />, href: '#' },
  { id: 'analyze', label: 'Analyze', icon: <Scale className="w-5 h-5" />, href: '#analyzer' },
  { id: 'timeline', label: 'Timeline', icon: <FileText className="w-5 h-5" />, href: '#timeline' },
  { id: 'lawyers', label: 'Lawyers', icon: <Users className="w-5 h-5" />, href: '#lawyers' },
  { id: 'chat', label: 'Chat', icon: <MessageCircle className="w-5 h-5" />, href: '#chat' },
];

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation = ({ className = '' }: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.id);
    setIsOpen(false);
    
    // Smooth scroll to section
    const element = document.querySelector(item.href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <motion.button
        className={`fixed top-4 left-4 z-[60] w-12 h-12 glass rounded-xl flex items-center justify-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-6 h-5 flex flex-col justify-between">
          {/* Morphing hamburger lines */}
          <motion.span
            className="w-full h-0.5 bg-foreground rounded-full origin-left"
            animate={isOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-full h-0.5 bg-foreground rounded-full"
            animate={isOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-full h-0.5 bg-foreground rounded-full origin-left"
            animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.button>

      {/* Slide-in Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.nav
              className="fixed top-0 left-0 bottom-0 z-50 w-72 glass-dark border-r border-border"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
              }}
              drag="x"
              dragConstraints={{ left: -288, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.velocity.x < -200 || info.offset.x < -100) {
                  setIsOpen(false);
                }
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-border">
                <motion.h2 
                  className="text-xl font-bold gradient-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  LegalAI
                </motion.h2>
              </div>

              {/* Nav Items */}
              <div className="p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                      activeItem === item.id 
                        ? 'bg-primary/20 text-primary' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onClick={() => handleNavClick(item)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={activeItem === item.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {activeItem === item.id && (
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-primary"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', damping: 20 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-40 glass-dark border-t border-border safe-area-inset-bottom"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <motion.button
              key={item.id}
              className={`relative flex flex-col items-center gap-1 p-2 min-w-[60px] ${
                activeItem === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => handleNavClick(item)}
              whileTap={{ scale: 0.9 }}
            >
              {/* Active background circle */}
              {activeItem === item.id && (
                <motion.div
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary/20"
                  layoutId="bottomNavActive"
                  transition={{ type: 'spring', damping: 20 }}
                />
              )}
              
              <motion.div
                className="relative z-10"
                animate={activeItem === item.id ? { 
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.3 }}
              >
                {item.icon}
              </motion.div>
              
              <span className="text-[10px] relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Add safe area styles */}
      <style>{`
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </>
  );
};

export default MobileNavigation;
