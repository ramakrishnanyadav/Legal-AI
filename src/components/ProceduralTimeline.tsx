import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FileText, Users, Scale, Clock, CheckCircle, ArrowRight, Check, Gavel } from 'lucide-react';
import { useRef, useState } from 'react';

const timelineSteps = [
  {
    icon: FileText,
    title: 'File FIR / Complaint',
    description: 'Lodge your complaint at the police station with all evidence and documentation',
    duration: '1-2 Days',
    status: 'completed' as const,
    details: 'Visit your nearest police station with ID proof, evidence, and any witnesses. The officer will record your statement and issue an FIR number.',
  },
  {
    icon: Users,
    title: 'Investigation',
    description: 'Police conducts investigation and collects evidence',
    duration: '30-90 Days',
    status: 'current' as const,
    details: 'Investigation officer will collect evidence, record statements, visit crime scene, and prepare a case diary for court proceedings.',
  },
  {
    icon: Scale,
    title: 'Charge Sheet',
    description: 'Formal charges filed in court based on investigation',
    duration: '60-180 Days',
    status: 'pending' as const,
    details: 'Police submits charge sheet to magistrate containing evidence, witness list, and recommended charges under applicable sections.',
  },
  {
    icon: Gavel,
    title: 'Trial Process',
    description: 'Court hearings, witness examination, and arguments',
    duration: '1-3 Years',
    status: 'pending' as const,
    details: 'Regular court appearances for evidence presentation, witness cross-examination, and legal arguments from both prosecution and defense.',
  },
  {
    icon: CheckCircle,
    title: 'Judgment',
    description: 'Final verdict by the court after trial completion',
    duration: 'Variable',
    status: 'pending' as const,
    details: 'Court delivers judgment based on evidence and arguments. Options for appeal exist within 30-90 days of judgment.',
  },
];

const springConfig = { damping: 20, stiffness: 300 };

const TimelineNode = ({ 
  step, 
  index, 
  isEven 
}: { 
  step: typeof timelineSteps[0]; 
  index: number; 
  isEven: boolean;
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  
  const isCompleted = step.status === 'completed';
  const isCurrent = step.status === 'current';

  return (
    <motion.div
      ref={nodeRef}
      className={`relative flex items-center mb-16 last:mb-0 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ type: 'spring', ...springConfig, delay: index * 0.15 }}
    >
      {/* Duration - Left side on desktop */}
      <div className={`hidden md:flex md:w-1/2 ${isEven ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
        {isEven && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: index * 0.15 + 0.3 }}
          >
            <Clock className="w-4 h-4 text-electric" />
            <span className="text-sm font-mono text-electric font-medium">{step.duration}</span>
          </motion.div>
        )}
        {!isEven && (
          <motion.div
            className="glass rounded-2xl p-6 max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ type: 'spring', ...springConfig, delay: index * 0.15 + 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {step.title}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-green-400" />
                </motion.div>
              )}
            </h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </motion.div>
        )}
      </div>

      {/* Center node with connecting line */}
      <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 z-10 flex flex-col items-center">
        {/* Animated connecting line segment */}
        {index < timelineSteps.length - 1 && (
          <motion.div
            className="absolute top-14 w-0.5 h-20 origin-top"
            style={{
              background: isCompleted 
                ? 'linear-gradient(180deg, hsl(142 76% 36%), hsl(142 76% 36% / 0.3))'
                : isCurrent
                ? 'linear-gradient(180deg, hsl(var(--electric)), hsl(var(--electric) / 0.3))'
                : 'linear-gradient(180deg, hsl(var(--muted-foreground) / 0.3), transparent)',
            }}
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
          />
        )}

        {/* Node circle */}
        <motion.div
          className="relative cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.2 }}
          transition={{ type: 'spring', ...springConfig }}
        >
          <motion.div
            className={`w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden ${
              isCompleted
                ? 'bg-gradient-to-br from-green-400 to-green-600'
                : isCurrent
                ? 'bg-gradient-to-br from-electric to-purple'
                : 'glass border border-border/50'
            }`}
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ type: 'spring', ...springConfig, delay: index * 0.15 }}
          >
            {/* Pulse animation for current step */}
            {isCurrent && (
              <motion.div
                className="absolute inset-0 rounded-full bg-electric/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Checkmark animation for completed */}
            {isCompleted ? (
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
              >
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </motion.div>
            ) : (
              <step.icon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
            )}
          </motion.div>

          {/* Glow effect for current */}
          {isCurrent && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 20px hsl(var(--electric) / 0.4)',
                  '0 0 40px hsl(var(--electric) / 0.6)',
                  '0 0 20px hsl(var(--electric) / 0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          {/* Tooltip on hover */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={isHovered ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="glass-strong rounded-xl p-4 text-sm relative">
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 glass-strong rotate-45" />
              <p className="text-foreground/90 relative z-10">{step.details}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content - Right side on desktop */}
      <div className={`ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-8' : 'md:pr-8 md:text-right'}`}>
        {isEven && (
          <motion.div
            className="glass rounded-2xl p-6 max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ type: 'spring', ...springConfig, delay: index * 0.15 + 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {step.title}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-green-400" />
                </motion.div>
              )}
            </h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </motion.div>
        )}
        {!isEven && (
          <motion.div
            className="flex items-center gap-2 md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ delay: index * 0.15 + 0.3 }}
          >
            <Clock className="w-4 h-4 text-electric" />
            <span className="text-sm font-mono text-electric font-medium">{step.duration}</span>
          </motion.div>
        )}
      </div>

      {/* Mobile: Show all content on right */}
      <div className="md:hidden ml-20">
        <motion.div
          className="glass rounded-2xl p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ type: 'spring', ...springConfig, delay: index * 0.15 + 0.2 }}
        >
          <div className="flex items-center gap-2 text-xs text-electric mb-2">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{step.duration}</span>
          </div>
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            {step.title}
            {isCompleted && <Check className="w-4 h-4 text-green-400" />}
          </h3>
          <p className="text-muted-foreground text-sm">{step.description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProceduralTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section className="py-24 px-4 overflow-hidden" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig }}
          className="text-center mb-20"
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full glass text-sm text-electric mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Procedural Overview
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Procedural Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Overview of the criminal justice process from filing to judgment
          </p>
        </motion.div>

        <div className="relative">
          {/* Main vertical gradient line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-0.5">
            {/* Background track */}
            <div className="absolute inset-0 bg-gradient-to-b from-border/50 via-border/30 to-transparent" />
            
            {/* Animated progress line */}
            <motion.div
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-electric via-purple to-pink/50"
              style={{ height: lineHeight }}
            />
            
            {/* Glow effect */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full opacity-50 blur-md bg-gradient-to-b from-electric via-purple/50 to-transparent"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline nodes */}
          {timelineSteps.map((step, index) => (
            <TimelineNode 
              key={step.title} 
              step={step} 
              index={index} 
              isEven={index % 2 === 0}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', ...springConfig, delay: 0.5 }}
        >
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-electric hover:bg-electric/10 font-medium transition-colors"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', ...springConfig }}
          >
            View Complete Procedural Guide
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProceduralTimeline;
