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
  t: TranslationKeys;
}

const Display: React.FC<DisplayProps> = ({ status, code, input, timeLeft, t }) => {
  const renderContent = () => {
    switch (status) {
      case 'IDLE':
        return <span className={styles.placeholder}>{t.ready}</span>;
      case 'DISPLAYING':
        return (
          <>
            <Distraction />
            <span className={styles.code}>{code}</span>
          </>
        );
      case 'INPUTTING':
        return <span className={styles.input}>{input.padEnd(code.length, '_')}</span>;
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
      {status === 'DISPLAYING' && (
        <div className={styles.timerBar}>
          <motion.div 
            className={styles.timerProgress}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 5) * 100}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
};

export default Display;
