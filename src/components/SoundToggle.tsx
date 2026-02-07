import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useAudio } from './AudioManager';
import { useState } from 'react';

const SoundToggle = () => {
  const { isMuted, toggleMute, volume, setVolume, playSound } = useAudio();
  const [showSlider, setShowSlider] = useState(false);

  const handleToggle = () => {
    toggleMute();
    if (isMuted) {
      // Will unmute, play a sound to confirm
      setTimeout(() => playSound('chime'), 100);
    }
  };

  const VolumeIcon = isMuted ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2"
      onHoverStart={() => setShowSlider(true)}
      onHoverEnd={() => setShowSlider(false)}
    >
      <motion.button
        onClick={handleToggle}
        className="w-10 h-10 glass rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isMuted ? 'Enable sounds' : 'Mute sounds'}
      >
        <motion.div
          key={isMuted ? 'muted' : 'unmuted'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <VolumeIcon className={`w-5 h-5 ${isMuted ? 'text-muted-foreground' : 'text-primary'}`} />
        </motion.div>
      </motion.button>

      {/* Volume slider */}
      <AnimatePresence>
        {showSlider && !isMuted && (
          <motion.div
            className="glass rounded-full px-4 py-2 flex items-center gap-3"
            initial={{ opacity: 0, x: -20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: -20, width: 0 }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-xs text-muted-foreground w-8">
              {Math.round(volume * 100)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SoundToggle;
