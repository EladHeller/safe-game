import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';
import styles from './SafeDoor.module.css';

import type { TranslationKeys } from '../../i18n';

interface SafeDoorProps {
  status: 'IDLE' | 'DISPLAYING' | 'INPUTTING' | 'SUCCESS' | 'FAILURE' | 'GAMEOVER' | 'VICTORY';
  children: React.ReactNode;
  t: TranslationKeys;
}

const SafeDoor: React.FC<SafeDoorProps> = ({ status, children, t }) => {
  const isOpened = status === 'SUCCESS' || status === 'VICTORY';
  const isAlarm = status === 'FAILURE' || status === 'GAMEOVER';

  return (
    <div className={`${styles.safeContainer} ${isAlarm ? styles.alarmShake : ''}`}>
      {/* Safe Box Body (the "inside") */}
      <div className={styles.safeBox}>
        {isOpened && (
          <div className={styles.moneyContainer}>
            <div className={styles.moneyContent}>
               <h1 style={{ color: 'var(--accent-gold-bright)', textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
                 {status === 'VICTORY' ? t.missionComplete : t.safeBreached}
               </h1>
               <p>{t.jackpot}</p>
            </div>
          </div>
        )}
      </div>

      {/* Safe Door (the animated part) */}
      <motion.div
        className={styles.safeDoor}
        initial={false}
        animate={{
          rotateY: isOpened ? -110 : 0,
          boxShadow: isOpened 
            ? '20px 0 50px rgba(0,0,0,0.5)' 
            : '0 10px 30px rgba(0,0,0,0.4)'
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 40, 
          damping: 15,
          duration: 1.5 
        }}
        style={{ transformOrigin: 'left center' }}
      >
        <div className={styles.doorFront}>
          <div className={styles.doorHandle}>
             <motion.div 
               animate={{ rotate: isOpened ? 90 : 0 }}
               transition={{ duration: 1 }}
               className={styles.handleWheel}
             />
          </div>
          
          <div className={styles.doorPanel}>
            {children}
          </div>

          <div className={styles.statusLight}>
             <div className={`${styles.light} ${isOpened ? styles.lightSuccess : ''} ${isAlarm ? styles.lightError : ''}`} />
          </div>

          <div className={styles.lockIcon}>
             {isOpened ? <Unlock color="var(--success-green)" size={32} /> : <Lock color="var(--accent-gold)" size={32} />}
          </div>
        </div>
        
        {/* Door Back (visible when opened) */}
        <div className={styles.doorBack} />
      </motion.div>

      {/* Alarm Overlay */}
      <AnimatePresence>
        {isAlarm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.alarmOverlay}
          >
            <ShieldAlert size={120} color="var(--error-red)" className={styles.alarmIcon} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SafeDoor;
