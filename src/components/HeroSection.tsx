import { motion, useScroll, useTransform } from 'framer-motion';
import { Scale, Shield, Gavel, ArrowRight } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { useRef } from 'react';

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 30%, hsl(var(--primary) / 0.15) 0%, transparent 60%)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 60% 40% at 70% 60%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto"
        style={{ y, opacity, scale }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 bg-primary/10 border border-primary/20"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">AI-Powered Legal Analysis</span>
        </motion.div>

        {/* Clean heading - no animation artifacts */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          <span className="block">Understand Your</span>
          <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Legal Position
          </span>
        </motion.h1>

        {/* Accent line */}
        <motion.div
          className="h-1 mx-auto rounded-full max-w-xs"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        />

        {/* Subtitle */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.7 }}
        >
          AI-powered legal information based on Indian criminal law. Receive preliminary analysis of applicable statutes and procedural guidance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.9 }}
        >
          <AnimatedButton
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Begin Analysis
          </AnimatedButton>

          <AnimatedButton variant="secondary" size="lg">
            View Process
          </AnimatedButton>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          {[
            { icon: Shield, text: 'Secure & Confidential', color: 'text-primary' },
            { icon: Scale, text: 'Based on IPC & CrPC', color: 'text-secondary' },
            { icon: Gavel, text: 'Advocate-Reviewed', color: 'text-primary' },
          ].map((item, index) => (
            <motion.div 
              key={item.text}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
