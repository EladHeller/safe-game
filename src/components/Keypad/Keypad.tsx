import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import styles from './Keypad.module.css';
import { shuffleWithSeed } from '../../utils/random';

interface KeypadProps {
  onInput: (digit: string) => void;
  onDelete: () => void;
  disabled?: boolean;
  shuffled?: boolean;
  alphanumeric?: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onInput, onDelete, disabled, shuffled, alphanumeric }) => {
  const keys = useMemo(() => {
    const baseKeys = alphanumeric
      ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'DEL']
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0', 'DEL'];

    if (shuffled) {
      const seed = alphanumeric ? 19729 : 14239;
      return shuffleWithSeed(baseKeys, seed);
    }

    return alphanumeric
      ? ['1', '2', '3', 'A', '4', '5', '6', 'B', '7', '8', '9', 'C', '0', 'D', 'DEL']
      : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0', 'DEL'];
  }, [shuffled, alphanumeric]);

  const handlePress = (key: string) => {
    if (disabled) return;
    if (key === 'DEL') {
      onDelete();
    } else {
      onInput(key);
    }
  };

  return (
    <div className={`${styles.keypadGrid} ${alphanumeric ? styles.alphanumeric : ''}`}>
      {keys.map((digit) => (
        <motion.button
          key={digit}
          whileTap={disabled ? {} : { scale: 0.9, backgroundColor: '#333' }}
          whileHover={disabled ? {} : { backgroundColor: '#222' }}
          onClick={() => handlePress(digit)}
          className={`${styles.key} ${(digit === '#' || isNaN(parseInt(digit))) ? styles.auxKey : ''} ${digit === 'DEL' ? styles.delKey : ''}`}
          disabled={disabled}
          layout
        >
          {digit === 'DEL' ? <ChevronLeft size={20} /> : digit}
        </motion.button>
      ))}
    </div>
  );
};

export default Keypad;
