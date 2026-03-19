import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './Distraction.module.css';
import { mulberry32 } from '../../utils/random';

interface DistractionProps {
  intensity?: number;
}

const Distraction: React.FC<DistractionProps> = ({ intensity = 1 }) => {
  const shapesCount = intensity * 4;
  
  const shapes = useMemo(() => {
    const rng = mulberry32(Math.floor(intensity * 10007) + shapesCount);
    return Array.from({ length: shapesCount }).map((_, i) => {
      const size = 20 + rng() * (40 * intensity);
      const borderRadius = rng() > 0.5 ? '50%' : '0%';
      const color = intensity > 2
        ? (rng() > 0.5 ? 'var(--accent-gold)' : 'var(--error-red)')
        : 'var(--text-secondary)';

      return {
        id: i,
        size,
        borderRadius,
        color,
        delay: rng() * 2,
        initialX: rng() * 300 - 150,
        initialY: rng() * 200 - 100,
        animX1: rng() * 300 - 150,
        animX2: rng() * 300 - 150,
        animY1: rng() * 200 - 100,
        animY2: rng() * 200 - 100,
        glitchDelay: rng() * 5,
        duration: (4 / intensity) + rng() * 2
      };
    });
  }, [intensity, shapesCount]);

  return (
    <div className={styles.container}>
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={styles.shape}
          initial={{ 
            x: shape.initialX, 
            y: shape.initialY,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: [shape.animX1, shape.animX2],
            y: [shape.animY1, shape.animY2],
            rotate: [0, 360 * intensity],
            opacity: [0, 0.1 * intensity, 0],
            scale: intensity > 2 ? [0.5, 1.2, 0.5] : [0.8, 1, 0.8]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay
          }}
          style={{
            width: shape.size,
            height: shape.size,
            borderRadius: shape.borderRadius,
            backgroundColor: shape.color,
            position: 'absolute'
          }}
        />
      ))}
      {intensity >= 3 && (
        <motion.div 
          className={styles.glitchOverlay}
          animate={{
            opacity: [0, 0.1, 0, 0.2, 0],
            x: [-2, 2, -2, 0, 2]
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 2 // Use a static delay instead of random
          }}
        />
      )}
    </div>
  );
};

export default Distraction;
