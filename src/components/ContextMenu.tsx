import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { Share2, Bookmark, Copy, ExternalLink, Flag } from 'lucide-react';

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  onClose: () => void;
  items?: { icon: ReactNode; label: string; onClick: () => void }[];
}

const defaultItems = [
  { icon: <Share2 className="w-4 h-4" />, label: 'Share', onClick: () => {} },
  { icon: <Bookmark className="w-4 h-4" />, label: 'Save', onClick: () => {} },
  { icon: <Copy className="w-4 h-4" />, label: 'Copy', onClick: () => {} },
  { icon: <ExternalLink className="w-4 h-4" />, label: 'Open', onClick: () => {} },
  { icon: <Flag className="w-4 h-4" />, label: 'Report', onClick: () => {} },
];

const ContextMenu = ({ isOpen, x, y, onClose, items = defaultItems }: ContextMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            className="fixed z-[101] min-w-[160px] rounded-xl overflow-hidden"
            style={{
              left: x,
              top: y,
              background: 'hsl(var(--card) / 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid hsl(var(--border) / 0.5)',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)',
            }}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: 'spring',
                damping: 20,
                stiffness: 300,
              }
            }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
          >
            {items.map((item, index) => (
              <motion.button
                key={item.label}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-primary/10 transition-colors text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.05 }
                }}
                whileHover={{ x: 4 }}
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
              >
                <span className="text-primary">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
