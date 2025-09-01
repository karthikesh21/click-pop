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
  // Generate random gradient colors for each target
  const gradientColors = React.useMemo(() => {
    const colors = [
      ['#FF6B6B', '#4ECDC4'], // Red to Cyan
      ['#A8E6CF', '#FFD93D'], // Green to Yellow
      ['#FF8A80', '#82B1FF'], // Pink to Blue
      ['#FFAB40', '#AB47BC'], // Orange to Purple
      ['#26C6DA', '#7C4DFF'], // Cyan to Purple
      ['#66BB6A', '#42A5F5'], // Green to Blue
      ['#FFA726', '#EC407A'], // Orange to Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, [x, y]); // Regenerate when position changes
  
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
          duration: isHit ? 0.3 : 0.5,
          ease: isHit ? 'easeOut' : 'backOut',
        },
        rotate: {
          duration: isHit ? 0.3 : 0.5,
          ease: 'easeOut',
        }
      }}
    >
     <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <motion.div
          className={`flex items-center justify-center text-white font-bold text-2xl cursor-pointer overflow-hidden relative`}
          style={{
            width: size,
            height: size,
            borderRadius: shape === 'circle' ? '50%' : '12px',
            background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`,
          }}
          onClick={onClick}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          animate={{
            boxShadow: [
              `0 0 20px ${gradientColors[0]}40`,
              `0 0 40px ${gradientColors[1]}60`,
              `0 0 20px ${gradientColors[0]}40`,
            ],
          }}
          transition={{
            boxShadow: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          }}
        >
          {/* Animated inner glow */}
          <motion.div
            className="absolute inset-0"
            style={{
              borderRadius: shape === 'circle' ? '50%' : '12px',
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Target symbol */}
          <span className="relative z-10">
            {shape === 'circle' ? '●' : '■'}
          </span>
        </motion.div>
      </ClickSpark>
    </motion.div>
  );
};

export default Target;
