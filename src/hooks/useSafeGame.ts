import { useState, useCallback, useRef } from 'react';

export type GameStatus = 'IDLE' | 'DISPLAYING' | 'INPUTTING' | 'SUCCESS' | 'FAILURE' | 'GAMEOVER' | 'VICTORY';

export interface Difficulty {
  length: number;
  displayTime: number;
  inputTime: number;
  shuffledKeypad: boolean;
  alphanumeric: boolean;
  distractionLevel: number;
  safeName: string;
}

const HISCORE_KEY = 'rememberCode_highScore';

const getInitialHighScore = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const storedHighScore = localStorage.getItem(HISCORE_KEY);
    return storedHighScore ? parseInt(storedHighScore, 10) : 0;
  } catch (error) {
    console.error("Could not read high score from localStorage", error);
    return 0;
  }
};

export const useSafeGame = () => {
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [level, setLevel] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => getInitialHighScore());
  const [multiplier, setMultiplier] = useState<number>(1);
  const [code, setCode] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [totalTime, setTotalTime] = useState<number>(5);
  const timerRef = useRef<number | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLogEntry = useCallback((entry: string) => {
    setLog(prev => [entry, ...prev].slice(0, 5));
  }, []);
  const logAccessGranted = useCallback((safeName: string) => {
    addLogEntry(`> ACCESS GRANTED: ${safeName}`);
  }, [addLogEntry]);
  const logAccessDenied = useCallback(() => {
    addLogEntry('> ACCESS DENIED: ALERT TRIGGERED');
  }, [addLogEntry]);
  const logBreaching = useCallback((safeName: string) => {
    addLogEntry(`> BREACHING ${safeName}...`);
  }, [addLogEntry]);
  const logBypassing = useCallback(() => {
    addLogEntry('> BYPASSING ENCRYPTION...');
  }, [addLogEntry]);

  const checkAndSetHighScore = useCallback(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem(HISCORE_KEY, score.toString());
      } catch (error) {
        console.error("Could not save high score to localStorage", error);
      }
    }
  }, [score, highScore]);

  const getDifficulty = useCallback((lvl: number): Difficulty => {
    if (lvl <= 3) return { length: 2 + lvl, displayTime: 5, inputTime: 15, shuffledKeypad: false, alphanumeric: false, distractionLevel: 1, safeName: 'LOCAL_ATM' };
    if (lvl <= 6) return { length: 2 + lvl, displayTime: 5, inputTime: 12, shuffledKeypad: false, alphanumeric: false, distractionLevel: 2, safeName: 'JEWELRY_STORE' };
    if (lvl <= 9) return { length: 2 + lvl, displayTime: 5, inputTime: 10, shuffledKeypad: false, alphanumeric: lvl > 8, distractionLevel: 3, safeName: 'CENTRAL_BANK' };
    return { length: 10, displayTime: 5, inputTime: 8, shuffledKeypad: false, alphanumeric: true, distractionLevel: 4, safeName: 'WORLD_RESERVE' };
  }, []);

  const handleFailure = useCallback(() => {
    const nextLives = lives - 1;
    setLives(nextLives);
    setMultiplier(1);
    if (nextLives <= 0) {
      setStatus('GAMEOVER');
      logAccessDenied();
      checkAndSetHighScore();
    } else {
      setStatus('FAILURE');
      logAccessDenied();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, [lives, checkAndSetHighScore, logAccessDenied]);

  const startInputTimer = useCallback((time: number) => {
    const startTime = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, time - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleFailure();
      }
    }, 50);
  }, [handleFailure]);

  const startGame = useCallback((resetProgress = false) => {
    let targetLevel = level;
    if (resetProgress) {
      checkAndSetHighScore();
      setLevel(1);
      setLives(3);
      setScore(0);
      setMultiplier(1);
      targetLevel = 1;
    } else if (status === 'SUCCESS') {
      targetLevel = level + 1;
      setLevel(targetLevel);
    }

    const diff = getDifficulty(targetLevel);
    const chars = diff.alphanumeric ? '0123456789ABCD' : '0123456789';
    let newCode = '';
    for (let i = 0; i < diff.length; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCode(newCode);
    setInput('');
    setStatus('DISPLAYING');
    logBreaching(diff.safeName);
    setTimeLeft(diff.displayTime);
    setTotalTime(diff.displayTime);

    if (timerRef.current) clearInterval(timerRef.current);
    const startTime = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, diff.displayTime - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('INPUTTING');
        logBypassing();
        setTimeLeft(diff.inputTime);
        setTotalTime(diff.inputTime);
        startInputTimer(diff.inputTime);
      }
    }, 50);
  }, [level, status, getDifficulty, checkAndSetHighScore, startInputTimer, logBreaching, logBypassing]);

  const evaluateInput = useCallback((currentInput: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const attemptDifficulty = getDifficulty(level);
    if (currentInput === code) {
      const speedBonus = Math.floor(timeLeft * 100);
      const levelBonus = level * 500;
      const roundScore = (levelBonus + speedBonus) * multiplier;
      setScore(prev => prev + roundScore);
      setMultiplier(prev => Math.min(prev + 0.5, 5));
      logAccessGranted(attemptDifficulty.safeName);
      if (level >= 10) {
        setStatus('VICTORY');
        checkAndSetHighScore();
      } else {
        setStatus('SUCCESS');
      }
    } else {
      handleFailure();
    }
  }, [code, level, timeLeft, multiplier, handleFailure, getDifficulty, logAccessGranted, checkAndSetHighScore]);

  const handleInput = useCallback((digit: string) => {
    if (status !== 'INPUTTING') return;
    setInput(prev => {
      if (prev.length >= code.length) {
        return prev;
      }
      const next = prev + digit;
      if (next.length === code.length) {
        evaluateInput(next);
      }
      return next;
    });
  }, [status, code.length, evaluateInput]);

  const handleDelete = useCallback(() => {
    if (status !== 'INPUTTING') return;
    setInput(prev => prev.slice(0, -1));
  }, [status]);

  const reset = useCallback(() => {
    startGame(status === 'GAMEOVER' || status === 'VICTORY');
  }, [status, startGame]);

  return { status, level, lives, score, highScore, multiplier, code, input, timeLeft, totalTime, difficulty: getDifficulty(level), log, startGame, handleInput, handleDelete, reset };
};
