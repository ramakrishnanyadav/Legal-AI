import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { User, Shield, AlertCircle, CheckCircle, Phone, FileText, Scale, Gavel, Info } from 'lucide-react';
import GlassCard from './GlassCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const victimContent = {
  title: 'Your Rights as a Victim',
  icon: Shield,
  gradient: 'from-orange-500 via-amber-500 to-red-500',
  glowColor: 'rgba(249, 115, 22, 0.5)',
  bgGradient: 'radial-gradient(ellipse at 30% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
  steps: [
    { icon: Phone, title: 'Emergency Contact', description: 'Contact local police or dial emergency helpline' },
    { icon: FileText, title: 'File FIR', description: 'Lodge First Information Report at nearest police station' },
    { icon: Shield, title: 'Legal Protection', description: 'Request protection order if safety is a concern' },
    { icon: CheckCircle, title: 'Document Evidence', description: 'Preserve documents, communications, and witness information' },
  ],
};

const accusedContent = {
  title: 'Your Rights as Accused',
  icon: Scale,
  gradient: 'from-blue-500 via-indigo-500 to-purple-500',
  glowColor: 'rgba(59, 130, 246, 0.5)',
  bgGradient: 'radial-gradient(ellipse at 70% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
  steps: [
    { icon: Phone, title: 'Right to Counsel', description: 'Contact an advocate before making any statements' },
    { icon: Shield, title: 'Right to Silence', description: 'You may decline to answer self-incriminating questions' },
    { icon: FileText, title: 'Bail Application', description: 'Apply for bail through your advocate if eligible' },
    { icon: Gavel, title: 'Fair Process', description: 'Right to be informed of charges and presumption of innocence' },
  ],
};

const springConfig = { damping: 20, stiffness: 300 };

// Slide variants for panel transitions
const slideVariants = {
  enterFromRight: {
    x: 300,
    opacity: 0,
  },
  enterFromLeft: {
    x: -300,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exitToLeft: {
    x: -300,
    opacity: 0,
  },
  exitToRight: {
    x: 300,
    opacity: 0,
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', ...springConfig },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const PerspectiveSwitcher = () => {
  const [perspective, setPerspective] = useState<'victim' | 'accused'>('victim');
  const [prevPerspective, setPrevPerspective] = useState<'victim' | 'accused'>('victim');
  const [particles, setParticles] = useState<Particle[]>([]);
  const isMobile = useIsMobile();

  const content = perspective === 'victim' ? victimContent : accusedContent;
  const ContentIcon = content.icon;

  // Determine slide direction
  const getSlideDirection = () => {
    if (perspective === 'accused' && prevPerspective === 'victim') {
      return { initial: 'enterFromRight', exit: 'exitToLeft' };
    }
    return { initial: 'enterFromLeft', exit: 'exitToRight' };
  };

  // Particle burst effect
  const triggerParticleBurst = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = perspective === 'victim' 
      ? ['#3b82f6', '#6366f1', '#8b5cf6'] // Blue colors for switching TO accused
      : ['#f97316', '#f59e0b', '#ef4444']; // Orange colors for switching TO victim

    const newParticles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: centerX,
      y: centerY,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 800);
  }, [perspective]);

  const handleSwitch = (newPerspective: 'victim' | 'accused', e: React.MouseEvent) => {
    if (newPerspective !== perspective) {
      triggerParticleBurst(e);
      setPrevPerspective(perspective);
      setPerspective(newPerspective);
    }
  };

  // Mobile swipe handler
  const handleSwipeEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100 && perspective === 'accused') {
      setPrevPerspective(perspective);
      setPerspective('victim');
    } else if (info.offset.x < -100 && perspective === 'victim') {
      setPrevPerspective(perspective);
      setPerspective('accused');
    }
  };

  const slideDirection = getSlideDirection();

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: perspective === 'victim' 
            ? 'radial-gradient(ellipse 80% 50% at 30% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 70% 70%, rgba(239, 68, 68, 0.08) 0%, transparent 40%)'
            : 'radial-gradient(ellipse 80% 50% at 70% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 30% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Particle burst */}
      <AnimatePresence>
        {particles.map((particle, index) => (
          <motion.div
            key={particle.id}
            className="fixed pointer-events-none z-50 rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
            }}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: particle.x + (Math.cos((index / 12) * Math.PI * 2) * 80),
              y: particle.y + (Math.sin((index / 12) * Math.PI * 2) * 80),
              scale: [0, 1.5, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Understand Your Position</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Get tailored guidance based on your role in the legal matter
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.2 }}
        >
          <div 
            className="relative flex rounded-2xl p-1.5"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Sliding indicator */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-xl"
              initial={false}
              animate={{
                left: perspective === 'victim' ? 6 : '50%',
                width: 'calc(50% - 6px)',
                background: perspective === 'victim'
                  ? 'linear-gradient(135deg, #f97316, #ef4444)'
                  : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: perspective === 'victim'
                  ? '0 4px 20px rgba(249, 115, 22, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
                  : '0 4px 20px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
              }}
              transition={{ type: 'spring', ...springConfig }}
            />

            {/* Victim Tab */}
            <motion.button
              onClick={(e) => handleSwitch('victim', e)}
              className="relative z-10 px-8 py-4 rounded-xl font-semibold flex items-center gap-3 min-w-[180px] justify-center"
              animate={{
                scale: perspective === 'victim' ? 1.05 : 1,
                color: perspective === 'victim' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              }}
              whileHover={{ scale: perspective === 'victim' ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', ...springConfig }}
              style={{
                textShadow: perspective === 'victim' ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
              }}
            >
              <motion.div
                animate={{
                  rotate: perspective === 'victim' ? [0, -10, 10, 0] : 0,
                  scale: perspective === 'victim' ? 1.1 : 1,
                }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Shield className="w-5 h-5" />
              </motion.div>
              <span>FOR VICTIM</span>
            </motion.button>

            {/* Accused Tab */}
            <motion.button
              onClick={(e) => handleSwitch('accused', e)}
              className="relative z-10 px-8 py-4 rounded-xl font-semibold flex items-center gap-3 min-w-[180px] justify-center"
              animate={{
                scale: perspective === 'accused' ? 1.05 : 1,
                color: perspective === 'accused' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              }}
              whileHover={{ scale: perspective === 'accused' ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', ...springConfig }}
              style={{
                textShadow: perspective === 'accused' ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
              }}
            >
              <motion.div
                animate={{
                  rotate: perspective === 'accused' ? [0, -10, 10, 0] : 0,
                  scale: perspective === 'accused' ? 1.1 : 1,
                }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Scale className="w-5 h-5" />
              </motion.div>
              <span>FOR ACCUSED</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Content Area - with swipe support on mobile */}
        <motion.div
          drag={isMobile ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={handleSwipeEnd}
          className="touch-pan-y"
        >
          {/* Swipe hint on mobile */}
          {isMobile && (
            <motion.div
              className="flex justify-center mb-4 gap-2 text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span>← Swipe to switch →</span>
            </motion.div>
          )}
          
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={perspective}
              variants={slideVariants}
              initial={slideDirection.initial}
              animate="center"
              exit={slideDirection.exit}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
            <div 
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(10, 14, 39, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Content background gradient */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: content.bgGradient }}
              />

              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${content.gradient} flex items-center justify-center`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', ...springConfig }}
                    style={{ boxShadow: `0 8px 30px ${content.glowColor}` }}
                  >
                    <motion.div
                      key={perspective}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', ...springConfig, delay: 0.1 }}
                    >
                      <ContentIcon className="w-8 h-8 text-white" />
                    </motion.div>
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-2xl md:text-3xl font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', ...springConfig, delay: 0.15 }}
                    >
                      {content.title}
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', ...springConfig, delay: 0.2 }}
                    >
                      Know your rights and next steps
                    </motion.p>
                  </div>
                </div>

                {/* Steps Grid */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {content.steps.map((step, index) => (
                    <motion.div key={step.title} variants={itemVariants}>
                      <GlassCard hover={true} index={index}>
                        <div className="flex items-start gap-4">
                          <motion.div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${content.gradient} flex items-center justify-center flex-shrink-0`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', ...springConfig }}
                            style={{ boxShadow: `0 4px 15px ${content.glowColor}` }}
                          >
                            <step.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h4 className="font-semibold text-lg mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Bottom CTA with viewing indicator */}
                <motion.div
                  className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', ...springConfig, delay: 0.4 }}
                >
                  {/* Viewing indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>Viewing as: <strong className="text-foreground">{perspective === 'victim' ? 'Victim' : 'Accused'}</strong></span>
                  </div>
                  
                  <motion.button
                    className={`px-6 py-3 rounded-xl font-semibold bg-gradient-to-r ${content.gradient} text-white`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ boxShadow: `0 4px 20px ${content.glowColor}` }}
                  >
                    Connect with Advocate
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      </div>
    </section>
  );
};

export default PerspectiveSwitcher;
