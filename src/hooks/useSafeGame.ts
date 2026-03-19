import { useState, useCallback, useRef, useEffect } from 'react';

export type GameStatus = 'IDLE' | 'DISPLAYING' | 'INPUTTING' | 'SUCCESS' | 'FAILURE' | 'GAMEOVER' | 'VICTORY';

export const useSafeGame = () => {
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [level, setLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [code, setCode] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const timerRef = useRef<number | null>(null);

  const getDifficulty = useCallback((lvl: number) => {
    // Level 1 = 3 digits, Level 2 = 4 digits, etc.
    // Ensure it caps at 9 digits
    const length = Math.min(2 + lvl, 9);
    return { length, time: 5 };
  }, []);

  const startGame = useCallback((resetProgress = false) => {
    // Determine target level locally to avoid race conditions with state updates
    let targetLevel = level;
    if (resetProgress) {
      setLevel(1);
      setLives(3);
      targetLevel = 1;
    }

    const { length, time } = getDifficulty(targetLevel);
    let newCode = '';
    for (let i = 0; i < length; i++) {
      newCode += Math.floor(Math.random() * 10).toString();
    }

    setCode(newCode);
    setInput('');
    setStatus('DISPLAYING');
    setTimeLeft(time);

    if (timerRef.current) clearInterval(timerRef.current);
    
    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, time - elapsed);
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('INPUTTING');
      }
    }, 50);
  }, [level, getDifficulty]);

  // Handle Input logic in a dedicated Effect to avoid double-triggers from functional updates
  useEffect(() => {
    if (status !== 'INPUTTING' || input.length === 0) return;

    if (input.length === code.length) {
      if (input === code) {
        if (level === 10) {
          setStatus('VICTORY');
        } else {
          setStatus('SUCCESS');
          setLevel(l => l + 1);
        }
      } else {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setStatus('GAMEOVER');
        } else {
          setStatus('FAILURE');
        }
      }
    }
  }, [input, code, status, lives, level]);

  const handleInput = useCallback((digit: string) => {
    if (status !== 'INPUTTING') return;
    setInput(prev => prev + digit);
  }, [status]);

  const reset = useCallback(() => {
    if (status === 'GAMEOVER' || status === 'VICTORY') {
      startGame(true);
    } else {
      startGame(false);
    }
  }, [status, startGame]);

  return {
    status,
    level,
    lives,
    code,
    input,
    timeLeft,
    startGame,
    handleInput,
    reset
  };
};
