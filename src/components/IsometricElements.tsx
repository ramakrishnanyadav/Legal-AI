import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, Clock, FileText, Scale, Shield, Gavel } from 'lucide-react';

// Isometric 3D Timeline
interface TimelineStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'current' | 'pending';
}

const defaultSteps: TimelineStep[] = [
  { id: '1', title: 'Case Filing', description: 'Submit initial documentation', duration: '1-2 days', status: 'completed' },
  { id: '2', title: 'Evidence Review', description: 'Analysis of all materials', duration: '1 week', status: 'completed' },
  { id: '3', title: 'Discovery Phase', description: 'Information exchange', duration: '2-4 weeks', status: 'current' },
  { id: '4', title: 'Pre-Trial', description: 'Motions and negotiations', duration: '2 weeks', status: 'pending' },
  { id: '5', title: 'Trial', description: 'Court proceedings', duration: '1-2 weeks', status: 'pending' },
];

interface IsometricTimelineProps {
  steps?: TimelineStep[];
  className?: string;
}

export const IsometricTimeline = ({ steps = defaultSteps, className = '' }: IsometricTimelineProps) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(60deg) rotateZ(-45deg)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {steps.map((step, index) => {
          const isHovered = hoveredStep === step.id;
          const colors = {
            completed: 'from-green-500 to-green-600',
            current: 'from-primary to-secondary',
            pending: 'from-muted to-muted-foreground',
          };

          return (
            <motion.div
              key={step.id}
              className="relative mb-4"
              initial={{ opacity: 0, x: -50, z: -100 }}
              animate={{ 
                opacity: 1, 
                x: index * 20, 
                z: index * -30,
                y: isHovered ? -10 : 0,
              }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              onHoverStart={() => setHoveredStep(step.id)}
              onHoverEnd={() => setHoveredStep(null)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3D Block */}
              <motion.div
                className={`relative w-48 h-20 rounded-lg cursor-pointer`}
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: isHovered
                    ? '10px 10px 30px rgba(0, 0, 0, 0.4), 0 0 40px hsl(var(--primary) / 0.3)'
                    : '5px 5px 15px rgba(0, 0, 0, 0.3)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Top face */}
                <div 
                  className={`absolute inset-0 rounded-lg bg-gradient-to-br ${colors[step.status]}`}
                  style={{ transform: 'translateZ(15px)' }}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && <Check className="w-4 h-4" />}
                      {step.status === 'current' && <Clock className="w-4 h-4 animate-pulse" />}
                      <span className="text-sm font-semibold text-primary-foreground">{step.title}</span>
                    </div>
                    <p className="text-xs text-primary-foreground/80 mt-1">{step.duration}</p>
                  </div>
                </div>
                
                {/* Right face */}
                <div 
                  className={`absolute top-0 right-0 w-4 h-full bg-gradient-to-b ${colors[step.status]} opacity-70 rounded-r-lg`}
                  style={{ 
                    transform: 'rotateY(90deg) translateZ(calc(12rem - 8px))',
                    transformOrigin: 'right',
                  }}
                />
                
                {/* Bottom face */}
                <div 
                  className={`absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r ${colors[step.status]} opacity-50 rounded-b-lg`}
                  style={{ 
                    transform: 'rotateX(-90deg) translateZ(calc(5rem - 8px))',
                    transformOrigin: 'bottom',
                  }}
                />
              </motion.div>

              {/* Connector line to next step */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute w-1 bg-gradient-to-b from-primary/50 to-transparent"
                  style={{
                    height: '30px',
                    left: '50%',
                    bottom: '-30px',
                    transform: 'translateX(-50%) rotateX(-90deg)',
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// Isometric 3D Bar Chart
interface BarData {
  label: string;
  value: number;
  color: string;
}

const defaultBars: BarData[] = [
  { label: 'Cases Won', value: 85, color: 'from-green-500 to-green-600' },
  { label: 'In Progress', value: 45, color: 'from-primary to-secondary' },
  { label: 'Consultations', value: 120, color: 'from-secondary to-accent' },
  { label: 'Appeals', value: 30, color: 'from-accent to-pink-500' },
];

interface IsometricBarChartProps {
  data?: BarData[];
  className?: string;
  maxValue?: number;
}

export const IsometricBarChart = ({ 
  data = defaultBars, 
  className = '',
  maxValue = 150 
}: IsometricBarChartProps) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      <motion.div
        className="flex items-end justify-center gap-8 p-8"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(15deg) rotateY(-15deg)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {data.map((bar, index) => {
          const height = (bar.value / maxValue) * 200;
          const isHovered = hoveredBar === index;

          return (
            <motion.div
              key={bar.label}
              className="relative cursor-pointer"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5, ease: 'easeOut' }}
              onHoverStart={() => setHoveredBar(index)}
              onHoverEnd={() => setHoveredBar(null)}
              style={{ 
                transformOrigin: 'bottom',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* 3D Bar */}
              <motion.div
                className="relative"
                style={{
                  width: '60px',
                  height: `${height}px`,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  y: isHovered ? -10 : 0,
                  scale: isHovered ? 1.05 : 1,
                }}
              >
                {/* Front face */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t ${bar.color} rounded-t-lg`}
                  style={{ transform: 'translateZ(15px)' }}
                />
                
                {/* Top face */}
                <div 
                  className={`absolute top-0 left-0 w-full h-8 bg-gradient-to-br ${bar.color} rounded-t-lg`}
                  style={{ 
                    transform: 'rotateX(90deg) translateZ(-4px)',
                    transformOrigin: 'top',
                    filter: 'brightness(1.2)',
                  }}
                />
                
                {/* Right face */}
                <div 
                  className={`absolute top-0 right-0 w-8 bg-gradient-to-b ${bar.color} rounded-tr-lg`}
                  style={{ 
                    height: '100%',
                    transform: 'rotateY(90deg) translateZ(26px)',
                    transformOrigin: 'right',
                    filter: 'brightness(0.8)',
                  }}
                />

                {/* Value tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -top-12 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-lg whitespace-nowrap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <span className="text-sm font-bold text-primary">{bar.value}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label */}
              <motion.p
                className="text-xs text-muted-foreground text-center mt-4 w-16"
                animate={{ opacity: isHovered ? 1 : 0.7 }}
              >
                {bar.label}
              </motion.p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// 3D Book Component
interface Book3DProps {
  title?: string;
  pages?: string[];
  className?: string;
}

export const Book3D = ({ 
  title = 'Legal Document',
  pages = ['Page 1 content...', 'Page 2 content...', 'Page 3 content...'],
  className = '' 
}: Book3DProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ perspective: '1500px' }}>
      <motion.div
        className="relative cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {/* Book cover */}
        <motion.div
          className="relative w-64 h-80 rounded-r-lg bg-gradient-to-br from-amber-800 to-amber-900"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left',
          }}
          animate={{
            rotateY: isOpen ? -160 : 0,
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Cover front */}
          <div 
            className="absolute inset-0 p-6 flex flex-col items-center justify-center rounded-r-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Scale className="w-12 h-12 text-amber-200 mb-4" />
            <h3 className="text-lg font-bold text-amber-100">{title}</h3>
            <p className="text-xs text-amber-300 mt-2">Click to open</p>
          </div>
          
          {/* Cover back (inside) */}
          <div 
            className="absolute inset-0 p-4 bg-amber-100 rounded-l-lg"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xs text-amber-800">Table of Contents</p>
          </div>

          {/* Spine depth */}
          <div 
            className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-amber-900 to-amber-800"
            style={{ 
              transform: 'rotateY(-90deg) translateZ(0px)',
              transformOrigin: 'left',
            }}
          />
        </motion.div>

        {/* Pages */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              className="absolute top-0 left-4 w-60 h-80 bg-amber-50 rounded-r-lg p-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                key={currentPage}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-amber-900 mb-2">Page {currentPage + 1} of {pages.length}</p>
                <p className="text-sm text-amber-800">{pages[currentPage]}</p>
              </motion.div>

              {/* Navigation */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={(e) => { e.stopPropagation(); prevPage(); }}
                  disabled={currentPage === 0}
                  className="px-3 py-1 text-xs bg-amber-200 rounded disabled:opacity-50 text-amber-800"
                >
                  Prev
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextPage(); }}
                  disabled={currentPage === pages.length - 1}
                  className="px-3 py-1 text-xs bg-amber-200 rounded disabled:opacity-50 text-amber-800"
                >
                  Next
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); setCurrentPage(0); }}
                  className="px-3 py-1 text-xs bg-amber-800 text-amber-100 rounded"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shadow */}
        <motion.div
          className="absolute -bottom-4 left-4 w-56 h-4 bg-black/30 blur-lg rounded-full"
          animate={{
            scaleX: isOpen ? 1.2 : 1,
            opacity: isOpen ? 0.5 : 0.3,
          }}
        />
      </motion.div>
    </div>
  );
};
