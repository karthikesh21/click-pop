import React from 'react';
import { motion } from 'framer-motion';
import ClickSpark from './ClickSpark';

interface TargetProps {
  x: number;
  y: number;
  size: number;
  shape: 'circle' | 'square';
  onClick: () => void;
  isHit?: boolean;
}

const Target: React.FC<TargetProps> = ({ 
  x, 
  y, 
  size, 
  shape, 
  onClick, 
  isHit = false 
}) => {
  const baseClasses = shape === 'circle' ? 'game-target-circle' : 'game-target-square';
  
  return (
    <motion.div
      className="absolute z-10"
      style={{
        left: x - size / 2,
        top: y - size / 2,
      }}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: isHit ? 0 : 1, 
        rotate: isHit ? 360 : 0 
      }}
      transition={{
        scale: {
          duration: isHit ? 0.3 : 0.4,
          ease: isHit ? 'easeOut' : 'backOut',
        },
        rotate: {
          duration: isHit ? 0.3 : 0.4,
          ease: 'easeOut',
        }
      }}
    >
      <ClickSpark
        sparkColor="#00ffff"
        sparkSize={12}
        sparkRadius={25}
        sparkCount={12}
        duration={500}
      >
        <motion.div
          className={`${baseClasses} flex items-center justify-center text-accent-foreground font-bold text-lg`}
          style={{
            width: size,
            height: size,
          }}
          onClick={onClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 0 20px hsl(185 100% 50% / 0.3)',
              '0 0 40px hsl(185 100% 50% / 0.6)',
              '0 0 20px hsl(185 100% 50% / 0.3)',
            ],
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          }}
        >
          {shape === 'circle' ? '●' : '■'}
        </motion.div>
      </ClickSpark>
    </motion.div>
  );
};

export default Target;