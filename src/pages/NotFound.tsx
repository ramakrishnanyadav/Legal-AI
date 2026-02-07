import { motion } from 'framer-motion';
import { Scale, Gavel, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Mini game: Catch the falling gavels
const MiniGame = () => {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [items, setItems] = useState<{ id: number; x: number; y: number; caught: boolean }[]>([]);

  useEffect(() => {
    if (!gameActive) return;

    const spawnInterval = setInterval(() => {
      setItems(prev => [
        ...prev.filter(i => i.y < 100 && !i.caught),
        { id: Date.now(), x: Math.random() * 80 + 10, y: 0, caught: false }
      ]);
    }, 1000);

    const moveInterval = setInterval(() => {
      setItems(prev => prev.map(i => ({ ...i, y: i.y + 2 })));
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [gameActive]);

  const catchItem = (id: number) => {
    setItems(prev => prev.map(i => 
      i.id === id ? { ...i, caught: true } : i
    ));
    setScore(s => s + 1);
  };

  return (
    <div className="relative w-full h-64 glass rounded-xl overflow-hidden">
      {!gameActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground mb-4">Catch the falling gavels!</p>
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameActive(true)}
          >
            Start Game
          </motion.button>
        </div>
      ) : (
        <>
          <div className="absolute top-2 right-2 text-sm font-mono text-primary">
            Score: {score}
          </div>
          {items.filter(i => !i.caught).map(item => (
            <motion.button
              key={item.id}
              className="absolute w-8 h-8 cursor-pointer"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => catchItem(item.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            >
              <Gavel className="w-full h-full text-secondary" />
            </motion.button>
          ))}
          <motion.button
            className="absolute bottom-2 right-2 text-xs text-muted-foreground"
            onClick={() => { setGameActive(false); setScore(0); setItems([]); }}
          >
            End Game
          </motion.button>
        </>
      )}
    </div>
  );
};

const NotFound = () => {
  const location = useLocation();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-[150px] font-bold leading-none gradient-text"
            animate={{ 
              rotateY: [0, 10, 0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ perspective: 1000 }}
          >
            404
          </motion.div>
          
          {/* Floating scale */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Scale className="w-16 h-16 text-primary/30" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl font-bold text-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Case Dismissed!
        </motion.h1>

        {/* Witty message */}
        <motion.p
          className="text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          This page has been struck from the record. 
          Our legal team is investigating, but in the meantime...
        </motion.p>

        {/* Actions */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              Return to Safety
            </motion.button>
          </Link>
          
          <motion.button 
            className="px-6 py-3 rounded-xl glass text-foreground font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGame(!showGame)}
          >
            {showGame ? 'Hide Game' : 'Play a Game?'}
          </motion.button>
        </motion.div>

        {/* Mini game */}
        {showGame && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <MiniGame />
          </motion.div>
        )}

        {/* Easter egg hint */}
        <motion.p
          className="text-xs text-muted-foreground/50 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Psst... try the Konami code anywhere on the site 🎮
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
