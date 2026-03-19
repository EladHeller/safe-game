import React from 'react';
import { motion } from 'framer-motion';
import styles from './Display.module.css';
import Distraction from '../Distraction/Distraction';
import type { TranslationKeys } from '../../i18n';

interface DisplayProps {
  status: 'IDLE' | 'DISPLAYING' | 'INPUTTING' | 'SUCCESS' | 'FAILURE' | 'GAMEOVER' | 'VICTORY';
  code: string;
  input: string;
  timeLeft: number;
  totalTime: number;
  intensity: number;
  safeName: string;
  t: TranslationKeys;
}

const Display: React.FC<DisplayProps> = ({ status, code, input, timeLeft, totalTime, intensity, safeName, t }) => {
  const renderContent = () => {
    switch (status) {
      case 'IDLE':
        return <span className={styles.placeholder}>{t.ready}</span>;
      case 'DISPLAYING':
        return (
          <>
            <Distraction intensity={intensity} />
            <span className={styles.code}>{code}</span>
          </>
        );
      case 'INPUTTING':
        return (
          <>
            {intensity >= 2 && <Distraction intensity={intensity - 1} />}
            <span className={styles.input}>{input.padEnd(code.length, '_')}</span>
          </>
        );
      case 'SUCCESS':
      case 'VICTORY':
        return <span className={styles.success}>{t.accessGranted}</span>;
      case 'FAILURE':
        return <span className={styles.failure}>{t.denied}</span>;
      case 'GAMEOVER':
        return <span className={styles.failure}>{t.gameOver}</span>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.displayContainer}>
      <div className={styles.safeInfo}>
        <span className={styles.safeName}>{safeName.replace('_', ' ')}</span>
      </div>
      <div className={styles.screen}>
        <motion.div 
          key={status}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.content}
        >
          {renderContent()}
        </motion.div>
      </div>
      {(status === 'DISPLAYING' || status === 'INPUTTING') && (
        <div className={styles.timerBar}>
          <motion.div 
            className={`${styles.timerProgress} ${status === 'INPUTTING' ? styles.inputTimer : ''}`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / totalTime) * 100}%` }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>
      )}
    </div>
  );
};

export default Display;
