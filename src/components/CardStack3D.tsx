
import { motion, AnimatePresence } from 'framer-motion';
import { useState, ReactNode } from 'react';
import { Scale, FileText, Shield, Gavel, Users } from 'lucide-react';

interface Card3D {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
}

const defaultCards: Card3D[] = [
  {
    id: '1',
    title: 'Criminal Defense',
    description: 'Expert representation in criminal matters',
    icon: <Gavel className="w-6 h-6" />,
    gradient: 'from-primary to-secondary',
  },
  {
    id: '2',
    title: 'Civil Rights',
    description: 'Protecting your constitutional rights',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-secondary to-accent',
  },
  {
    id: '3',
    title: 'Property Law',
    description: 'Real estate and property disputes',
    icon: <FileText className="w-6 h-6" />,
    gradient: 'from-accent to-primary',
  },
  {
    id: '4',
    title: 'Family Law',
    description: 'Divorce, custody, and family matters',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-primary to-purple-500',
  },
  {
    id: '5',
    title: 'Corporate Law',
    description: 'Business legal services',
    icon: <Scale className="w-6 h-6" />,
    gradient: 'from-purple-500 to-secondary',
  },
];

interface CardStack3DProps {
  cards?: Card3D[];
  className?: string;
}

const CardStack3D = ({ cards = defaultCards, className = '' }: CardStack3DProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleStackClick = () => {
    setIsExpanded(!isExpanded);
    setSelectedCard(null);
  };

  const handleCardClick = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCard(selectedCard === cardId ? null : cardId);
  };

  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleStackClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            // Stacked view
            <motion.div
              key="stacked"
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {cards.map((card, index) => {
                const stackOffset = isHovered ? index * 25 : index * 8;
                const rotation = isHovered ? (index - 2) * 8 : (index - 2) * 2;
                const zOffset = isHovered ? -index * 30 : -index * 10;
                
                return (
                  <motion.div
                    key={card.id}
                    className="absolute top-0 left-0 w-72 glass rounded-xl p-6"
                    initial={false}
                    animate={{
                      x: stackOffset,
                      y: isHovered ? -index * 10 : -index * 4,
                      rotateY: rotation,
                      rotateX: isHovered ? 5 : 0,
                      z: zOffset,
                      scale: 1 - index * 0.02,
                    }}
                    transition={{
                      type: 'spring',
                      damping: 20,
                      stiffness: 200,
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      zIndex: cards.length - index,
                      boxShadow: `
                        0 ${10 + index * 5}px ${30 + index * 10}px rgba(0, 0, 0, 0.3),
                        0 0 ${isHovered ? 40 : 20}px hsl(var(--primary) / ${0.1 + (cards.length - index) * 0.05})
                      `,
                    }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}>
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{card.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            // Expanded view
            <motion.div
              key="expanded"
              className="flex flex-wrap gap-6 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {cards.map((card, index) => {
                const isSelected = selectedCard === card.id;
                const row = Math.floor(index / 3);
                const col = index % 3;
                
                return (
                  <motion.div
                    key={card.id}
                    className="w-72 glass rounded-xl p-6 cursor-pointer"
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      rotateY: -30,
                      x: -100,
                      y: -50 
                    }}
                    animate={{
                      opacity: 1,
                      scale: isSelected ? 1.1 : 1,
                      rotateY: isSelected ? 0 : (col - 1) * 5,
                      rotateX: isSelected ? 0 : (row - 0.5) * 5,
                      x: 0,
                      y: isSelected ? -20 : 0,
                      z: isSelected ? 100 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      damping: 20,
                      stiffness: 200,
                      delay: index * 0.1,
                    }}
                    onClick={(e) => handleCardClick(card.id, e)}
                    whileHover={{ 
                      scale: isSelected ? 1.1 : 1.05,
                      rotateY: 0,
                      rotateX: 0,
                      z: 50,
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      boxShadow: isSelected
                        ? '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 60px hsl(var(--primary) / 0.3)'
                        : '0 10px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <motion.div 
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4`}
                      animate={{
                        rotateY: isSelected ? 360 : 0,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {card.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{card.description}</p>
                    
                    {/* Selected card extra content */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <p className="text-sm text-primary">Click again to deselect</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Instruction text */}
      <motion.p
        className="text-center text-sm text-muted-foreground mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isExpanded ? 'Click cards or background to collapse' : 'Hover to fan • Click to expand'}
      </motion.p>
    </div>
  );
};

export default CardStack3D;
