import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Loader2, Info } from 'lucide-react';
import {
  DynamicPlaceholder,
  SmartSuggestions,
  AutoSaveIndicator,
  CategoryTags,
  FileUpload,
  ExampleButton,
  ClearButton,
  LoadingProgressOverlay,
  sampleCaseDescription,
} from './SmartInputEnhancements';

interface PremiumCrimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  maxLength?: number;
}

const easeOut = [0.25, 0.46, 0.45, 0.94];

const PremiumCrimeInput = ({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  maxLength = 2000,
}: PremiumCrimeInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [lastTypedAt, setLastTypedAt] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '200px';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, 200), 500)}px`;
    }
  }, [value]);

  // Track typing for auto-save
  const handleChange = (newValue: string) => {
    onChange(newValue);
    setLastTypedAt(Date.now());
  };

  // Word count
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  // Character count color
  const getCharCountColor = () => {
    if (value.length >= maxLength) return 'text-red-400';
    if (value.length >= 1500) return 'text-yellow-400';
    if (value.length >= 100) return 'text-cyan-400';
    return 'text-muted-foreground';
  };

  const getCharCountBg = () => {
    if (value.length >= maxLength) return 'bg-red-500/10';
    if (value.length >= 1500) return 'bg-yellow-500/10';
    if (value.length >= 100) return 'bg-cyan-500/10';
    return 'bg-white/5';
  };

  // Toggle category
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // File handling
  const handleAddFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter((file) => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Voice input
  const toggleMicrophone = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        handleChange(value + " [Voice transcription would appear here]");
        setIsListening(false);
      }, 3000);
    }
  };

  // Fill example
  const fillExample = () => {
    onChange(sampleCaseDescription);
    setLastTypedAt(Date.now());
  };

  // Clear input
  const handleClear = () => {
    onChange('');
    setUploadedFiles([]);
    setSelectedCategories([]);
  };

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    setHasClicked(true);
    onSubmit();
    setTimeout(() => setHasClicked(false), 500);
  };

  const isButtonEnabled = value.trim().length > 0 && !isLoading;
  const showPulse = value.length >= 50 && !isLoading;

  return (
    <div className="space-y-4">
      {/* Category Tags */}
      <CategoryTags
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
      />

      {/* Auto-save indicator and Example button row */}
      <div className="flex items-center justify-between">
        <AutoSaveIndicator lastTypedAt={lastTypedAt} />
        <ExampleButton onFill={fillExample} />
      </div>

      {/* Main Input Container */}
      <div className="relative">
        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && <LoadingProgressOverlay isLoading={isLoading} />}
        </AnimatePresence>

        {/* Animated gradient border */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl pointer-events-none"
          style={{
            background: isFocused
              ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))'
              : isListening
                ? 'linear-gradient(135deg, hsl(0 85% 55%), hsl(336 100% 50%))'
                : 'rgba(255, 255, 255, 0.1)',
          }}
          animate={{
            boxShadow: isFocused
              ? '0 0 20px rgba(0, 217, 255, 0.3)'
              : isListening
                ? '0 0 30px rgba(239, 68, 68, 0.4)'
                : 'none',
          }}
          transition={{ duration: 0.3, ease: easeOut }}
        />

        {/* Glass container */}
        <div
          className={`relative rounded-2xl overflow-hidden transition-opacity ${isLoading ? 'opacity-50' : ''}`}
          style={{
            background: 'rgba(10, 14, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Textarea */}
          <div className="relative group">
            {/* Dynamic placeholder */}
            <DynamicPlaceholder isEmpty={value.length === 0} />

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={maxLength}
              disabled={isLoading}
              placeholder=""
              className="w-full p-6 pr-20 bg-transparent border-none outline-none resize-none text-foreground text-base md:text-lg leading-relaxed"
              style={{
                caretColor: 'hsl(187 100% 50%)',
                minHeight: '200px',
                maxHeight: '500px',
                fontSize: '16px',
              }}
            />

            {/* Top right buttons - Clear and Mic */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <ClearButton onClear={handleClear} hasContent={value.length > 0} />

              {/* Microphone button */}
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={toggleMicrophone}
                  onMouseEnter={() => setShowTooltip('mic')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    background: isListening
                      ? 'linear-gradient(135deg, hsl(0 85% 55%), hsl(336 100% 50%))'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  animate={isListening ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 20px rgba(239, 68, 68, 0.3)',
                      '0 0 40px rgba(239, 68, 68, 0.5)',
                      '0 0 20px rgba(239, 68, 68, 0.3)',
                    ],
                  } : {}}
                  transition={isListening ? { duration: 1, repeat: Infinity } : { duration: 0.2 }}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 text-white" />
                  ) : (
                    <Mic className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.button>

                {/* Mic tooltip */}
                <AnimatePresence>
                  {showTooltip === 'mic' && !isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-lg bg-background border border-border shadow-lg text-xs whitespace-nowrap z-10"
                    >
                      Voice input (click to record)
                      <div className="absolute -top-1 right-4 w-2 h-2 rotate-45 bg-background border-l border-t border-border" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Listening indicator with waveform */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="absolute top-4 left-6 right-32 flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(239, 68, 68, 0.15)' }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-sm text-red-400">Recording... Click again to stop</span>
                  
                  {/* Waveform visualization */}
                  <div className="flex items-center gap-0.5 ml-auto">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-red-400 rounded-full"
                        animate={{
                          height: ['12px', '24px', '8px', '20px', '12px'],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 pb-4 space-y-3">
            {/* Smart suggestions */}
            <SmartSuggestions wordCount={wordCount} />

            {/* File upload */}
            <FileUpload
              files={uploadedFiles}
              onAdd={handleAddFiles}
              onRemove={handleRemoveFile}
            />

            {/* Bottom row */}
            <div className="flex items-center justify-between gap-4">
              {/* Progress indicator */}
              <div className="hidden md:flex items-center gap-2">
                <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: value.length >= 200
                        ? 'linear-gradient(90deg, hsl(142 76% 50%), hsl(160 84% 40%))'
                        : value.length >= 100
                          ? 'linear-gradient(90deg, hsl(187 100% 50%), hsl(200 100% 50%))'
                          : 'linear-gradient(90deg, hsl(225 15% 40%), hsl(225 15% 50%))',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((value.length / 200) * 100, 100)}%` }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {value.length < 100 ? 'Add more details' : value.length < 200 ? 'Good' : 'Great!'}
                </span>
              </div>

              {/* Character counter */}
              <motion.div
                className={`px-3 py-1.5 rounded-lg font-mono text-sm ${getCharCountColor()} ${getCharCountBg()}`}
              >
                <motion.span
                  key={value.length}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                >
                  {value.length}
                </motion.span>
                <span className="text-muted-foreground/70"> / {maxLength}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="relative">
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          className="w-full py-4 rounded-xl font-semibold text-lg relative overflow-hidden transition-all"
          style={{
            background: isButtonEnabled
              ? 'linear-gradient(135deg, hsl(187 100% 50%), hsl(266 93% 58%))'
              : 'hsl(var(--muted))',
            opacity: isButtonEnabled ? 1 : 0.4,
            cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
          }}
          whileHover={isButtonEnabled ? { scale: 1.02 } : {}}
          whileTap={isButtonEnabled ? { scale: 0.98 } : {}}
          animate={showPulse ? {
            boxShadow: [
              '0 0 20px rgba(0, 217, 255, 0.2)',
              '0 0 40px rgba(0, 217, 255, 0.4)',
              '0 0 20px rgba(0, 217, 255, 0.2)',
            ],
          } : {}}
          transition={showPulse ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
          onMouseEnter={() => !isButtonEnabled && setShowTooltip('submit')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <motion.span
            className="relative z-10 flex items-center justify-center gap-3"
            style={{ color: isButtonEnabled ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))' }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Situation</span>
              </>
            )}
          </motion.span>

          {/* Ripple effect */}
          <AnimatePresence>
            {hasClicked && !isLoading && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ originX: 0.5, originY: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Disabled tooltip */}
        <AnimatePresence>
          {showTooltip === 'submit' && !isButtonEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-background border border-border shadow-lg text-sm flex items-center gap-2 z-10"
            >
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Please describe your situation first</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-background border-r border-b border-border" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper text */}
      <motion.p
        className="text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Provide a detailed description for preliminary statutory analysis
      </motion.p>
    </div>
  );
};

export default PremiumCrimeInput;
