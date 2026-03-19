import React from 'react';
import { motion } from 'framer-motion';
import styles from './Distraction.module.css';

const Distraction: React.FC = () => {
  const shapes = Array.from({ length: 5 });

  return (
    <div className={styles.container}>
      {shapes.map((_, i) => (
        <motion.div
          key={i}
          className={styles.shape}
          initial={{ 
            x: Math.random() * 200 - 100, 
            y: Math.random() * 200 - 100,
            opacity: 0 
          }}
          animate={{
            x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
            rotate: [0, 360],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: 40 + Math.random() * 60,
            height: 40 + Math.random() * 60,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
        />
      ))}
    </div>
  );
};

export default Distraction;
