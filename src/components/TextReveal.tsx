import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useMemo } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  type?: 'word' | 'letter' | 'stroke';
  stagger?: number;
  delay?: number;
  once?: boolean;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: { opacity: 1, y: 0, rotateX: 0 },
};

const TextReveal = ({
  text,
  className = '',
  type = 'word',
  stagger = 0.05,
  delay = 0,
  once = true,
}: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });

  const words = useMemo(() => text.split(' '), [text]);
  const letters = useMemo(() => text.split(''), [text]);

  if (type === 'stroke') {
    return (
      <div ref={ref} className={className}>
        <motion.span
          className="relative inline-block"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.1, delay }}
        >
          {/* Stroke version */}
          <motion.span
            className="absolute inset-0"
            style={{
              WebkitTextStroke: '1px currentColor',
              WebkitTextFillColor: 'transparent',
            }}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {text}
          </motion.span>
          {/* Fill version */}
          <motion.span
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
            transition={{ duration: 1, delay: delay + 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {text}
          </motion.span>
        </motion.span>
      </div>
    );
  }

  if (type === 'letter') {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ perspective: 1000 }}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            transition={{
              duration: 0.5,
              delay: delay + index * stagger,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="inline-block"
            style={{ 
              transformStyle: 'preserve-3d',
              whiteSpace: letter === ' ' ? 'pre' : 'normal',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  // Default: word by word
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          transition={{
            duration: 0.4,
            delay: delay + index * stagger,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
