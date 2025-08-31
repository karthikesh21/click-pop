import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  resistance?: number;
  returnDuration?: number;
}

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  intensity: number;
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 10,
  gap = 15,
  baseColor = "#5227FF",
  activeColor = "#5227FF", 
  proximity = 120,
  shockRadius = 250,
  shockStrength = 5,
  resistance = 750,
  returnDuration = 1.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState<Array<{ x: number; y: number; time: number }>>([]);

  const initializeDots = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dots: Dot[] = [];
    const cols = Math.floor(canvas.width / gap);
    const rows = Math.floor(canvas.height / gap);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * gap + gap / 2;
        const y = j * gap + gap / 2;
        dots.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          intensity: 0
        });
      }
    }

    dotsRef.current = dots;
  }, [gap]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'hsl(220, 27%, 8%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    
    // Update dots based on mouse proximity and click effects
    dotsRef.current.forEach((dot) => {
      // Mouse proximity effect
      const mouseDistance = Math.sqrt(
        (mousePos.x - dot.x) ** 2 + (mousePos.y - dot.y) ** 2
      );
      
      let targetIntensity = mouseDistance < proximity ? 
        Math.max(0, 1 - mouseDistance / proximity) : 0;

      // Click shock wave effects
      clicks.forEach((click) => {
        const clickAge = now - click.time;
        if (clickAge < 1000) { // Effect lasts 1 second
          const clickDistance = Math.sqrt(
            (click.x - dot.baseX) ** 2 + (click.y - dot.baseY) ** 2
          );
          
          if (clickDistance < shockRadius) {
            const shockIntensity = Math.max(0, 1 - clickDistance / shockRadius);
            const ageMultiplier = Math.max(0, 1 - clickAge / 1000);
            const shockEffect = shockIntensity * ageMultiplier;
            
            targetIntensity = Math.max(targetIntensity, shockEffect);
            
            // Push dots away from click
            const angle = Math.atan2(dot.baseY - click.y, dot.baseX - click.x);
            const force = shockEffect * shockStrength;
            dot.vx += Math.cos(angle) * force * ageMultiplier;
            dot.vy += Math.sin(angle) * force * ageMultiplier;
          }
        }
      });

      // Update intensity with smooth interpolation
      dot.intensity += (targetIntensity - dot.intensity) * 0.1;

      // Apply physics
      const returnForceX = (dot.baseX - dot.x) / resistance;
      const returnForceY = (dot.baseY - dot.y) / resistance;
      
      dot.vx += returnForceX;
      dot.vy += returnForceY;
      dot.vx *= 0.95; // Damping
      dot.vy *= 0.95;
      
      dot.x += dot.vx;
      dot.y += dot.vy;

      // Draw dot
      const size = dotSize * (0.5 + dot.intensity * 0.5);
      const alpha = 0.3 + dot.intensity * 0.7;
      
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, size / 2, 0, Math.PI * 2);
      
      if (dot.intensity > 0.1) {
        // Glowing effect for active dots
        ctx.shadowBlur = 15;
        ctx.shadowColor = activeColor;
        ctx.fillStyle = `${activeColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = `${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      }
      
      ctx.fill();
    });

    // Clean up old clicks
    setClicks(prev => prev.filter(click => now - click.time < 1000));

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [mousePos, clicks, baseColor, activeColor, dotSize, proximity, shockRadius, shockStrength, resistance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initializeDots(canvas);
    animate();

    const handleResize = () => {
      initializeDots(canvas);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        time: Date.now()
      };
      setClicks(prev => [...prev, clickPos]);
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [initializeDots, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default DotGrid;