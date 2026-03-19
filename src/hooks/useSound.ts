import { useCallback, useRef } from 'react';

export const useSound = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  const initCtx = () => {
    if (!audioCtx.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error('Web Audio API is not supported in this browser');
        }
        audioCtx.current = new AudioContextClass();
      } catch (error: unknown) {
        console.warn("Web Audio API is not supported in this browser", error);
      }
    }
  };

  const playSound = useCallback((type: OscillatorType, freq: number, duration: number, volume: number, ramp: 'linear' | 'exponential' = 'exponential') => {
    initCtx();
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(volume, audioCtx.current.currentTime);
    if (ramp === 'exponential') {
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
    } else {
      gain.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + duration);
    }
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  }, []);

  const playClick = useCallback(() => {
    playSound('triangle', 220, 0.1, 0.2);
  }, [playSound]);

  const playSuccess = useCallback(() => {
    initCtx();
    if (!audioCtx.current) return;
    const now = audioCtx.current.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = audioCtx.current!.createOscillator();
      const gain = audioCtx.current!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.15, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.current!.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  }, []);

  const playFailure = useCallback(() => {
    playSound('sawtooth', 110, 0.5, 0.15, 'linear');
  }, [playSound]);
  
  const playStageStart = useCallback(() => {
    initCtx();
    if (!audioCtx.current) return;
    const now = audioCtx.current.currentTime;
    const notes = [261.63, 392.00, 523.25]; // C4, G4, C5
    
    notes.forEach((freq, i) => {
      const osc = audioCtx.current!.createOscillator();
      const gain = audioCtx.current!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.1, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.current!.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  }, []);

  const playTick = useCallback(() => {
    playSound('square', 880, 0.05, 0.03);
  }, [playSound]);

  return { playClick, playSuccess, playFailure, playStageStart, playTick };
};
