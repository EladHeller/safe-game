import React, { useEffect, useMemo } from 'react';
import { useSafeGame } from './hooks/useSafeGame';
import { useSound } from './hooks/useSound';
import SafeDoor from './components/SafeDoor/SafeDoor';
import Display from './components/Display/Display';
import Keypad from './components/Keypad/Keypad';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Heart } from 'lucide-react';
import { translations, getLanguage } from './i18n';
import './styles/variables.css';
import './App.css';

const App: React.FC = () => {
  const { status, level, lives, code, input, timeLeft, startGame, handleInput, reset } = useSafeGame();
  const { playClick, playSuccess, playFailure, playTick } = useSound();
  
  const lang = useMemo(() => getLanguage(), []);
  const t = translations[lang];

  useEffect(() => {
    if (status === 'SUCCESS' || status === 'VICTORY') playSuccess();
    if (status === 'FAILURE' || status === 'GAMEOVER') playFailure();
    if (status === 'DISPLAYING') playTick();
  }, [status, playSuccess, playFailure, playTick]);

  useEffect(() => {
    if (status === 'DISPLAYING' && Math.ceil(timeLeft) > 0) {
      playTick();
    }
  }, [timeLeft, status, playTick]);

  const onKeyInput = (digit: string) => {
    playClick();
    handleInput(digit);
  };

  useEffect(() => {
    if (status === 'SUCCESS' || status === 'VICTORY') {
      const duration = (status === 'VICTORY' ? 8 : 4) * 1000;
      const animationEnd = Date.now() + duration;
      
      const scalar = 2;
      const dollar = confetti.shapeFromText({ text: '💵', scalar });
      const coin = confetti.shapeFromText({ text: '🪙', scalar });
      const trophy = confetti.shapeFromText({ text: '🏆', scalar });

      const interval = window.setInterval(() => {
        const timeLeftNow = animationEnd - Date.now();

        if (timeLeftNow <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeftNow / duration);
        
        confetti({
          particleCount,
          spread: 70,
          origin: { y: 0.6 },
          shapes: status === 'VICTORY' ? [dollar, coin, trophy, 'circle'] : [dollar, coin, 'circle'],
          colors: ['#85bb65', '#d4af37', '#ffffff']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className={`game-container ${lang === 'he' ? 'rtl' : ''}`}>
      <header className="game-header">
        <h1>{t.title}</h1>
        <div className="game-stats">
           <div className="stat-badge">
             <span className="label">{t.level}</span>
             <span className="value">{level}</span>
           </div>
           <div className="stat-badge lives">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart 
                  key={i} 
                  size={20} 
                  fill={i < lives ? "var(--error-red)" : "transparent"} 
                  color={i < lives ? "var(--error-red)" : "#333"}
                  style={{ transition: 'all 0.3s' }}
                />
              ))}
           </div>
        </div>
      </header>

      <SafeDoor status={status} t={t}>
        <Display 
          status={status} 
          code={code} 
          input={input} 
          timeLeft={timeLeft} 
          t={t}
        />
        <Keypad 
          onInput={onKeyInput} 
          disabled={status !== 'INPUTTING'} 
        />
      </SafeDoor>

      <footer className="game-controls">
        {status === 'IDLE' && (
          <button className="btn-primary" onClick={() => startGame(true)}>
            <Play size={20} fill="currentColor" />
            {t.startBreach}
          </button>
        )}
        {(status === 'GAMEOVER' || status === 'VICTORY') && (
          <button className="btn-primary" onClick={() => startGame(true)}>
            <RotateCcw size={20} />
            {t.restart}
          </button>
        )}
        {status === 'SUCCESS' && (
          <button className="btn-primary" onClick={reset}>
            <Play size={20} fill="currentColor" />
            {t.continue}
          </button>
        )}
        {status === 'FAILURE' && (
          <button className="btn-secondary" onClick={reset}>
            <RotateCcw size={20} />
            {t.tryAgain}
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;
