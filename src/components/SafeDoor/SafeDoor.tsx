import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import styles from './SafeDoor.module.css';
import type { TranslationKeys } from '../../i18n';

interface SafeDoorProps {
  status: 'IDLE' | 'DISPLAYING' | 'INPUTTING' | 'SUCCESS' | 'FAILURE' | 'GAMEOVER' | 'VICTORY';
  t: TranslationKeys;
  children: React.ReactNode;
}

const SafeDoor: React.FC<SafeDoorProps> = ({ status, t, children }) => {
  const isUnlocked = status === 'SUCCESS' || status === 'VICTORY';
  const isAlarm = status === 'FAILURE' || status === 'GAMEOVER';

  const doorVariants = {
    closed: { rotateY: 0 },
    open: { rotateY: -130 },
  };

  const lightColor = isUnlocked ? styles.lightSuccess : isAlarm ? styles.lightError : '';

  return (
    <div className={`${styles.safeContainer} ${isAlarm ? styles.alarmShake : ''}`}>
      <div className={styles.safeBox}>
        <AnimatePresence>
          {isUnlocked && (
            <motion.div
              className={styles.moneyContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.moneyContent}>
                <h2>{status === 'VICTORY' ? t.victoryTitle : t.levelComplete}</h2>
                <p>{status === 'VICTORY' ? t.victoryMessage : t.continueMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className={styles.safeDoor}
        animate={isUnlocked ? 'open' : 'closed'}
        variants={doorVariants}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <div className={styles.doorFront}>
          <div className={styles.statusLight}>
            <div className={`${styles.light} ${lightColor}`} />
          </div>
          <div className={styles.doorHandle}>
            <div className={styles.handleWheel}></div>
          </div>
          <div className={styles.lockIcon}>
            {isUnlocked ? <Unlock size={24} color="var(--success-green)" /> : <Lock size={24} color="#555" />}
          </div>
          <div className={styles.doorPanel}>
            {children}
          </div>
        </div>
        <div className={styles.doorBack}></div>
        
        <AnimatePresence>
        {isAlarm && (
            <motion.div 
              className={styles.alarmOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            />
        )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SafeDoor;
