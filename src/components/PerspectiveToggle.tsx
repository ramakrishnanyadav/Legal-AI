import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, AlertCircle, CheckCircle, Phone, FileText } from 'lucide-react';
import GlassCard from './GlassCard';

const victimContent = {
  title: 'Your Rights as a Victim',
  icon: Shield,
  color: 'from-orange-500 to-red-500',
  steps: [
    { icon: Phone, title: 'Emergency Contact', description: 'Call 100 or visit nearest police station' },
    { icon: FileText, title: 'File FIR', description: 'Lodge First Information Report within 24 hours' },
    { icon: Shield, title: 'Legal Protection', description: 'Seek protection order if needed' },
    { icon: CheckCircle, title: 'Gather Evidence', description: 'Collect documents, witnesses, and records' },
  ],
};

const accusedContent = {
  title: 'Your Rights as Accused',
  icon: User,
  color: 'from-blue-500 to-purple-500',
  steps: [
    { icon: Phone, title: 'Right to Counsel', description: 'Contact a lawyer immediately' },
    { icon: Shield, title: 'Right to Silence', description: 'You can refuse to answer questions' },
    { icon: FileText, title: 'Bail Application', description: 'Apply for bail if eligible' },
    { icon: AlertCircle, title: 'Fair Trial', description: 'Right to be presumed innocent' },
  ],
};

const springConfig = { damping: 20, stiffness: 300 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
};

const PerspectiveToggle = () => {
  const [perspective, setPerspective] = useState<'victim' | 'accused'>('victim');

  const content = perspective === 'victim' ? victimContent : accusedContent;

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
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

        {/* Toggle Switch */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.2 }}
        >
          <div className="relative glass rounded-full p-1 flex">
            {/* Sliding indicator */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-full"
              initial={false}
              animate={{
                left: perspective === 'victim' ? '4px' : '50%',
                width: 'calc(50% - 4px)',
              }}
              transition={{ type: 'spring', ...springConfig }}
              style={{
                background: perspective === 'victim'
                  ? 'linear-gradient(135deg, #f97316, #ef4444)'
                  : 'linear-gradient(135deg, #3b82f6, #a855f7)',
              }}
            />

            <motion.button
              onClick={() => setPerspective('victim')}
              className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-colors duration-300 ${
                perspective === 'victim' ? 'text-white' : 'text-muted-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', ...springConfig }}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Victim
              </span>
            </motion.button>

            <motion.button
              onClick={() => setPerspective('accused')}
              className={`relative z-10 px-8 py-3 rounded-full font-semibold transition-colors duration-300 ${
                perspective === 'accused' ? 'text-white' : 'text-muted-foreground'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', ...springConfig }}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Accused
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={perspective}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', ...springConfig }}
          >
            <div className="relative">
              {/* Background gradient */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${
                    perspective === 'victim'
                      ? 'hsl(25 100% 55%), hsl(0 85% 55%)'
                      : 'hsl(210 100% 60%), hsl(266 93% 58%)'
                  })`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ type: 'spring', ...springConfig }}
              />

              <div className="relative glass rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${content.color} flex items-center justify-center`}
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', ...springConfig }}
                  >
                    <content.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <motion.h3 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', ...springConfig, delay: 0.1 }}
                  >
                    {content.title}
                  </motion.h3>
                </div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {content.steps.map((step, index) => (
                    <motion.div key={step.title} variants={itemVariants}>
                      <GlassCard hover={false} index={index}>
                        <div className="flex items-start gap-4">
                          <motion.div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${content.color} flex items-center justify-center flex-shrink-0`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', ...springConfig }}
                          >
                            <step.icon className="w-5 h-5 text-white" />
                          </motion.div>
                          <div>
                            <h4 className="font-semibold mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PerspectiveToggle;
