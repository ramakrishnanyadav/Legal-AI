import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// Audio context singleton
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound types
type SoundType = 
  | 'click' 
  | 'success' 
  | 'error' 
  | 'whoosh' 
  | 'toggle' 
  | 'chime' 
  | 'tap'
  | 'swish'
  | 'typing';

interface AudioManagerContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: SoundType) => void;
  setVolume: (volume: number) => void;
  volume: number;
}

const AudioManagerContext = createContext<AudioManagerContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioManagerContext);
  if (!context) {
    return {
      isMuted: true,
      toggleMute: () => {},
      playSound: () => {},
      setVolume: () => {},
      volume: 0.3,
    };
  }
  return context;
};

// Generate sounds using Web Audio API
const generateSound = (ctx: AudioContext, type: SoundType, volume: number) => {
  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.connect(ctx.destination);
  masterGain.gain.value = volume * 0.3; // Keep sounds subtle

  switch (type) {
    case 'click':
    case 'tap': {
      // Soft click/tap sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'success':
    case 'chime': {
      // Satisfying success chime (two notes)
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = now + i * 0.1;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
        osc.start(startTime);
        osc.stop(startTime + 0.15);
      });
      break;
    }

    case 'error': {
      // Gentle low bonk
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    }

    case 'whoosh': {
      // Rising whoosh using noise
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (i / bufferSize);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);
      filter.Q.value = 1;
      const gain = ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      noise.start(now);
      noise.stop(now + 0.15);
      break;
    }

    case 'toggle': {
      // Mechanical click-clack
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);
      osc1.type = 'square';
      osc2.type = 'square';
      osc1.frequency.value = 1200;
      osc2.frequency.value = 800;
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc1.start(now);
      osc2.start(now + 0.015);
      osc1.stop(now + 0.02);
      osc2.stop(now + 0.03);
      break;
    }

    case 'swish': {
      // Subtle swish for card flip
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.5;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      const gain = ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      noise.start(now);
      noise.stop(now + 0.1);
      break;
    }

    case 'typing': {
      // Very subtle typing sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.type = 'square';
      osc.frequency.value = 1000 + Math.random() * 500;
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.start(now);
      osc.stop(now + 0.02);
      break;
    }
  }
};

// Audio Provider Component
export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('audio-muted');
    return saved ? JSON.parse(saved) : true; // Default muted
  });
  
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('audio-volume');
    return saved ? parseFloat(saved) : 0.3;
  });

  useEffect(() => {
    localStorage.setItem('audio-muted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('audio-volume', String(volume));
  }, [volume]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev: boolean) => !prev);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.max(0, Math.min(1, v)));
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      generateSound(ctx, type, volume);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }, [isMuted, volume]);

  return (
    <AudioManagerContext.Provider value={{ isMuted, toggleMute, playSound, setVolume, volume }}>
      {children}
    </AudioManagerContext.Provider>
  );
};

export default AudioProvider;
