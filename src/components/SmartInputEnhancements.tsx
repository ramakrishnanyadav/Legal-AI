import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lightbulb, FileText, Upload, Image, Trash2 } from 'lucide-react';

// Dynamic placeholder examples
const placeholderExamples = [
  "Someone stole my phone from the metro station...",
  "I was assaulted during a road rage incident...",
  "Received threatening messages on WhatsApp...",
  "My landlord is refusing to return my security deposit...",
  "Found fraudulent transactions on my bank account...",
];

// Category tags
export const categoryTags = [
  { id: 'financial', icon: '💰', label: 'Financial', tooltip: 'Fraud, cheating, property disputes' },
  { id: 'violence', icon: '👊', label: 'Violence', tooltip: 'Assault, threats, physical harm' },
  { id: 'cyber', icon: '📱', label: 'Cyber', tooltip: 'Online fraud, harassment, data theft' },
  { id: 'traffic', icon: '🚗', label: 'Traffic', tooltip: 'Accidents, hit and run, violations' },
  { id: 'other', icon: '⚖️', label: 'Other', tooltip: 'Other legal matters' },
];

// Legal keywords for highlighting
const legalKeywords = [
  { word: 'stole', type: 'theft', section: 'Theft (IPC 378-382)' },
  { word: 'stolen', type: 'theft', section: 'Theft (IPC 378-382)' },
  { word: 'hit', type: 'assault', section: 'Assault (IPC 351-358)' },
  { word: 'assaulted', type: 'assault', section: 'Assault (IPC 351-358)' },
  { word: 'attacked', type: 'assault', section: 'Assault (IPC 351-358)' },
  { word: 'threatened', type: 'intimidation', section: 'Criminal Intimidation (IPC 503-507)' },
  { word: 'threatening', type: 'intimidation', section: 'Criminal Intimidation (IPC 503-507)' },
  { word: 'cheated', type: 'fraud', section: 'Cheating (IPC 415-420)' },
  { word: 'fraud', type: 'fraud', section: 'Cheating (IPC 415-420)' },
  { word: 'harassed', type: 'harassment', section: 'Harassment (IPC 354A-D)' },
  { word: 'stalking', type: 'stalking', section: 'Stalking (IPC 354D)' },
  { word: 'defamed', type: 'defamation', section: 'Defamation (IPC 499-502)' },
  { word: 'extortion', type: 'extortion', section: 'Extortion (IPC 383-389)' },
  { word: 'blackmail', type: 'extortion', section: 'Extortion (IPC 383-389)' },
  { word: 'kidnapped', type: 'kidnapping', section: 'Kidnapping (IPC 359-369)' },
  { word: 'bribe', type: 'corruption', section: 'Bribery (Prevention of Corruption Act)' },
];

// Dynamic Placeholder Component
export const DynamicPlaceholder = ({ isEmpty }: { isEmpty: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isEmpty) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholderExamples.length);
        setIsVisible(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, [isEmpty]);

  if (!isEmpty) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute top-6 left-6 right-20 text-muted-foreground text-base md:text-lg leading-relaxed"
        >
          {placeholderExamples[currentIndex]}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

// Smart Suggestions Component
export const SmartSuggestions = ({ wordCount }: { wordCount: number }) => {
  const getSuggestion = () => {
    if (wordCount === 0) return null;
    if (wordCount < 10) return null;
    if (wordCount < 30) {
      return {
        icon: '✓',
        text: 'Good start! Add more details about: when, where, who was involved',
        color: 'text-primary',
      };
    }
    if (wordCount < 50) {
      return {
        icon: '✓',
        text: 'Getting better! Consider adding: what evidence you have',
        color: 'text-primary',
      };
    }
    return {
      icon: '✓',
      text: 'Excellent detail! You can analyze now or add more context',
      color: 'text-success',
    };
  };

  const suggestion = getSuggestion();

  return (
    <AnimatePresence>
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`flex items-center gap-2 text-sm ${suggestion.color}`}
        >
          <span>{suggestion.icon}</span>
          <span>{suggestion.text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Auto-save Indicator
export const AutoSaveIndicator = ({ lastTypedAt }: { lastTypedAt: number }) => {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (lastTypedAt === 0) return;

    const showTimer = setTimeout(() => setShowSaved(true), 2000);
    const hideTimer = setTimeout(() => setShowSaved(false), 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [lastTypedAt]);

  return (
    <AnimatePresence>
      {showSaved && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="flex items-center gap-2 text-xs text-success"
        >
          <Check className="w-3 h-3" />
          <span>Auto-saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Category Tags Component
interface CategoryTagsProps {
  selectedCategories: string[];
  onToggle: (categoryId: string) => void;
}

export const CategoryTags = ({ selectedCategories, onToggle }: CategoryTagsProps) => {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">What type of situation? (optional - helps accuracy)</p>
      <div className="flex flex-wrap gap-2">
        {categoryTags.map((tag) => {
          const isSelected = selectedCategories.includes(tag.id);
          return (
            <div key={tag.id} className="relative">
              <motion.button
                type="button"
                onClick={() => onToggle(tag.id)}
                onMouseEnter={() => setHoveredTag(tag.id)}
                onMouseLeave={() => setHoveredTag(null)}
                className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-200 border min-h-[44px] ${
                  isSelected
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </motion.button>
              
              <AnimatePresence>
                {hoveredTag === tag.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-background border border-border shadow-lg text-xs whitespace-nowrap z-20"
                  >
                    {tag.tooltip}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-background border-r border-b border-border" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// File Upload Component
interface FileUploadProps {
  files: File[];
  onAdd: (files: FileList) => void;
  onRemove: (index: number) => void;
}

export const FileUpload = ({ files, onAdd, onRemove }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onAdd(e.dataTransfer.files);
    }
  }, [onAdd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-primary/50 bg-primary/10'
            : 'border-white/10 hover:border-white/20 bg-white/5'
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple
          onChange={(e) => e.target.files && onAdd(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            <span className="text-primary">📎 Attach evidence</span> (photos, documents, screenshots)
          </p>
          <p className="text-xs text-muted-foreground/70">JPG, PNG, PDF • Max 10MB each • Up to 5 files</p>
        </div>
      </motion.div>

      {/* File thumbnails */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
            >
              {file.type.startsWith('image/') ? (
                <Image className="w-4 h-4 text-primary" />
              ) : (
                <FileText className="w-4 h-4 text-warning" />
              )}
              <span className="text-sm text-muted-foreground max-w-[120px] truncate">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 p-1.5 rounded-full hover:bg-destructive/20 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <X className="w-3 h-3 text-destructive" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example Button
export const ExampleButton = ({ onFill }: { onFill: () => void }) => {
  return (
    <motion.button
      type="button"
      onClick={onFill}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground bg-transparent hover:bg-white/5 border border-white/10 transition-all duration-200 min-h-[44px]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Lightbulb className="w-4 h-4" />
      <span>See Example</span>
    </motion.button>
  );
};

// Clear Button
interface ClearButtonProps {
  onClear: () => void;
  hasContent: boolean;
}

export const ClearButton = ({ onClear, hasContent }: ClearButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!hasContent) return null;

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-destructive/20 border border-white/10 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </motion.button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full right-0 mt-2 p-4 rounded-xl bg-background border border-border shadow-xl z-30"
          >
            <p className="text-sm text-foreground mb-4">Clear your description?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-sm bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors duration-200 min-h-[44px]"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors duration-200 min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loading Progress Overlay
export const LoadingProgressOverlay = ({ isLoading }: { isLoading: boolean }) => {
  const [progressStep, setProgressStep] = useState(0);
  
  const progressSteps = [
    { text: 'Reading description...', icon: '📖' },
    { text: 'Identifying legal sections...', icon: '⚖️' },
    { text: 'Analyzing procedures...', icon: '📋' },
    { text: 'Preparing results...', icon: '✨' },
  ];

  useEffect(() => {
    if (!isLoading) {
      setProgressStep(0);
      return;
    }

    const interval = setInterval(() => {
      setProgressStep((prev) => Math.min(prev + 1, progressSteps.length - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, progressSteps.length]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 rounded-2xl flex items-center justify-center z-20"
      style={{
        background: 'rgba(10, 14, 39, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto flex items-center justify-center text-3xl"
        >
          {progressSteps[progressStep].icon}
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={progressStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg text-cyan-400"
          >
            {progressSteps[progressStep].text}
          </motion.p>
        </AnimatePresence>
        <div className="flex justify-center gap-1">
          {progressSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= progressStep ? 'bg-cyan-400' : 'bg-white/20'
              }`}
              animate={index === progressStep ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Highlighted Text with Keywords
export const getHighlightedText = (text: string) => {
  const words = text.split(/(\s+)/);
  return words.map((word, index) => {
    const lowerWord = word.toLowerCase().replace(/[.,!?]/g, '');
    const keyword = legalKeywords.find(k => k.word === lowerWord);
    
    if (keyword) {
      return {
        word,
        isKeyword: true,
        type: keyword.type,
        section: keyword.section,
        key: index,
      };
    }
    return { word, isKeyword: false, key: index };
  });
};

// Sample case description for example button
export const sampleCaseDescription = `On December 15, 2024, around 8:30 PM, I was traveling on the Delhi Metro Blue Line from Rajiv Chowk to Dwarka. While standing near the door, someone bumped into me from behind. I realized later that my wallet was missing from my back pocket.

The wallet contained:
- ₹5,000 in cash
- My Aadhaar card
- PAN card
- Two debit cards (SBI and HDFC)
- Some important receipts

I immediately reported to the Metro security at Dwarka station. The security guard noted down my complaint but said they cannot do anything without CCTV footage. I have not yet filed an FIR.

I need to know:
1. What legal sections apply to this theft?
2. How do I file an FIR?
3. What are my options for recovering the money?
4. How do I protect my cards from misuse?`;
