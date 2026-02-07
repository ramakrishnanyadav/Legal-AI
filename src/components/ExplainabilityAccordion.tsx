import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, Quote, CheckCircle2 } from 'lucide-react';

interface ExplainabilityAccordionProps {
  sectionCode: string;
  sectionName: string;
  userDescription?: string;
  matchedKeywords?: string[];
  reasoning?: string;
}

const ExplainabilityAccordion = ({
  sectionCode,
  sectionName,
  userDescription = "physical altercation resulting in injury",
  matchedKeywords = ["physical force", "intent to harm", "bodily injury"],
  reasoning = "The description indicates elements that constitute this offense under Indian law. The presence of specific triggers matches the legal definition."
}: ExplainabilityAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract a relevant quote from user description
  const relevantQuote = userDescription.length > 50 
    ? `"...${userDescription.substring(0, 47)}..."` 
    : `"${userDescription}"`;

  return (
    <div className="mt-3">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
            Why this applies
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-4 rounded-xl glass space-y-4">
              {/* Quoted description */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex gap-3"
              >
                <Quote className="w-5 h-5 text-primary/60 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    From your description
                  </p>
                  <p className="text-sm italic text-foreground/80">
                    {relevantQuote}
                  </p>
                </div>
              </motion.div>

              {/* Key factors */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  Key factors that triggered this match
                </p>
                <div className="flex flex-wrap gap-2">
                  {matchedKeywords.map((keyword, index) => (
                    <motion.span
                      key={keyword}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Legal reasoning */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-3 rounded-lg bg-secondary/10 border border-secondary/20"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Legal reasoning
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <strong className="text-secondary">Applied because:</strong> Your description mentions{' '}
                  {matchedKeywords.slice(0, 2).map((kw, i) => (
                    <span key={kw}>
                      <span className="text-primary">[{kw}]</span>
                      {i < 1 ? ' and ' : ''}
                    </span>
                  ))}, which match the definition under {sectionCode} ({sectionName}).
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplainabilityAccordion;
