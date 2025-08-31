import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClickSparkProps {
  children: React.ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400
}) => {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const createSparks = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = e.clientX - rect.left;
    const centerY = e.clientY - rect.top;

    const newSparks: Spark[] = [];
    
    for (let i = 0; i < sparkCount; i++) {
      const angle = (360 / sparkCount) * i;
      const distance = sparkRadius + Math.random() * sparkRadius * 0.5;
      
      newSparks.push({
        id: sparkIdRef.current++,
        x: centerX,
        y: centerY,
        angle,
        distance
      });
    }

    setSparks(newSparks);

    // Clear sparks after animation
    setTimeout(() => {
      setSparks([]);
    }, duration);
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onClick={createSparks}
    >
      {children}
      
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: sparkSize,
              height: sparkSize,
              backgroundColor: sparkColor,
              left: spark.x - sparkSize / 2,
              top: spark.y - sparkSize / 2,
              boxShadow: `0 0 10px ${sparkColor}`,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: Math.cos((spark.angle * Math.PI) / 180) * spark.distance,
              y: Math.sin((spark.angle * Math.PI) / 180) * spark.distance,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: duration / 1000,
              ease: 'circOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickSpark;