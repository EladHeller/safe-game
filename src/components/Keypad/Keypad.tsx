import React from 'react';
import { motion } from 'framer-motion';
import styles from './Keypad.module.css';

interface KeypadProps {
  onInput: (digit: string) => void;
  disabled?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onInput, disabled }) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className={styles.keypadGrid}>
      {digits.map((digit) => (
        <motion.button
          key={digit}
          whileTap={disabled ? {} : { scale: 0.9, backgroundColor: '#333' }}
          whileHover={disabled ? {} : { backgroundColor: '#222' }}
          onClick={() => !disabled && onInput(digit)}
          className={`${styles.key} ${(digit === '*' || digit === '#') ? styles.auxKey : ''}`}
          disabled={disabled}
        >
          {digit}
        </motion.button>
      ))}
    </div>
  );
};

export default Keypad;
