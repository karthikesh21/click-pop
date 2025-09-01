import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Trophy, Zap, Timer } from 'lucide-react';
import DotGrid from './DotGrid';
import Target from './Target';
import Leaderboard from './Leaderboard';
import { useToast } from '@/hooks/use-toast';
type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';
interface TargetData {
  x: number;
  y: number;
  size: number;
  shape: 'circle' | 'square';
  id: string;
}
interface Score {
  score: number;
  date: string;
  id: string;
}
const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3000); // Start with 3 seconds
  const [maxTime, setMaxTime] = useState(3000);
  const [target, setTarget] = useState<TargetData | null>(null);
  const [isTargetHit, setIsTargetHit] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const {
    toast
  } = useToast();

  // Load scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('reactionGameScores');
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (error) {
        console.error('Error loading scores:', error);
      }
    }
  }, []);

  // Save scores to localStorage
  const saveScore = useCallback((newScore: number) => {
    const scoreEntry: Score = {
      score: newScore,
      date: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    const updatedScores = [...scores, scoreEntry].sort((a, b) => b.score - a.score).slice(0, 10); // Keep top 10

    setScores(updatedScores);
    localStorage.setItem('reactionGameScores', JSON.stringify(updatedScores));
  }, [scores]);

  // Generate random target
  const generateTarget = useCallback((): TargetData => {
    if (!gameAreaRef.current) {
      return {
        x: 300,
        y: 200,
        size: 60,
        shape: 'circle',
        id: Math.random().toString()
      };
    }
    const rect = gameAreaRef.current.getBoundingClientRect();
    const minSize = 40;
    const maxSize = 80;
    const size = minSize + Math.random() * (maxSize - minSize);
    const margin = size / 2 + 20;
    const x = margin + Math.random() * (rect.width - 2 * margin);
    const y = margin + Math.random() * (rect.height - 2 * margin);
    const shape = Math.random() > 0.5 ? 'circle' : 'square';
    return {
      x,
      y,
      size,
      shape,
      id: Math.random().toString()
    };
  }, []);

  // Start new round
  const startNewRound = useCallback(() => {
    const newTarget = generateTarget();
    setTarget(newTarget);
    setIsTargetHit(false);

    // Calculate time based on score (difficulty scaling)
    const newMaxTime = Math.max(800, 3000 - score * 100); // Minimum 0.8 seconds
    setMaxTime(newMaxTime);
    setTimeLeft(newMaxTime);
  }, [generateTarget, score]);

  // Handle target click
  const handleTargetClick = useCallback(() => {
    if (gameState !== 'playing' || !target || isTargetHit) return;
    setIsTargetHit(true);
    setScore(prev => prev + 1);
    toast({
      title: "Hit! +1",
      description: `Score: ${score + 1}`,
      duration: 1000
    });

    // Start new round after a short delay
    setTimeout(startNewRound, 300);
  }, [gameState, target, isTargetHit, score, startNewRound, toast]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 50);
      }, 50);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      // Game over
      setGameState('gameOver');
      saveScore(score);
      toast({
        title: "Game Over!",
        description: `Final Score: ${score}`,
        duration: 3000
      });
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft, score, saveScore, toast]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    startNewRound();
  }, [startNewRound]);

  // Pause/Resume game
  const togglePause = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  // Restart game
  const restartGame = useCallback(() => {
    setGameState('menu');
    setScore(0);
    setTarget(null);
    setTimeLeft(3000);
    setMaxTime(3000);
    setIsTargetHit(false);
  }, []);
  const timeProgress = timeLeft / maxTime * 100;
  const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <DotGrid dotSize={8} gap={25} baseColor="#5227FF" activeColor="#00ffff" proximity={100} shockRadius={200} shockStrength={3} resistance={500} returnDuration={1.0} />
      </div>

      {/* Game Content */}
      <div className="relative z-10 p-4">
        {/* Header UI */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <motion.h1 className="text-3xl font-bold text-primary animate-float" initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }}>
              ⚡ Reaction Speed
            </motion.h1>
            
            {bestScore > 0 && <motion.div className="flex items-center gap-2 px-3 py-1 bg-warning/20 border border-warning/30 rounded-lg" initial={{
            scale: 0
          }} animate={{
            scale: 1
          }}>
                <Trophy className="w-4 h-4 text-warning" />
                <span className="text-warning font-semibold">Best: {bestScore}</span>
              </motion.div>}
          </div>

          <Button onClick={() => setLeaderboardOpen(true)} className="game-button-secondary">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
        </div>

        {/* Game Area */}
        <div className="max-w-4xl mx-auto">
          <div ref={gameAreaRef} className="relative bg-card/30 border border-border rounded-xl backdrop-blur-sm" style={{
          width: '100%',
          height: '500px'
        }}>
            {/* Game States */}
            <AnimatePresence mode="wait">
              {/* Menu State */}
              {gameState === 'menu' && <motion.div key="menu" initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} exit={{
              opacity: 0,
              scale: 0.9
            }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <motion.div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 glow-primary" animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }} transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity
                },
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}>
                    <Zap className="w-12 h-12 text-primary-foreground" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold mb-4"> CLICK SPEED</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">Click the glowing targets before time runs out.
 Each round gets faster. How high can you score?</p>
                  
                  <Button onClick={startGame} className="game-button">
                    <Play className="w-5 h-5 mr-2" />
                    Start Game
                  </Button>
                </motion.div>}

              {/* Playing State */}
              {(gameState === 'playing' || gameState === 'paused') && <motion.div key="playing" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} className="absolute inset-0">
                  {/* UI Panel */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="game-ui-panel">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-accent" />
                          <span className="font-bold text-xl">{score}</span>
                        </div>
                      </div>
                      
                      <div className="game-ui-panel min-w-[200px]">
                        <div className="flex items-center gap-2 mb-1">
                          <Timer className="w-4 h-4 text-warning" />
                          <span className="text-sm font-medium">Time Left</span>
                        </div>
                        <Progress value={timeProgress} className="h-2" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={togglePause} className="game-button-secondary">
                        {gameState === 'paused' ? <><Play className="w-4 h-4 mr-2" /> Resume</> : <><Pause className="w-4 h-4 mr-2" /> Pause</>}
                      </Button>
                      
                      <Button onClick={restartGame} className="game-button-secondary">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Target */}
                  {target && gameState === 'playing' && <Target x={target.x} y={target.y} size={target.size} shape={target.shape} onClick={handleTargetClick} isHit={isTargetHit} />}

                  {/* Paused Overlay */}
                  {gameState === 'paused' && <motion.div initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Pause className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <h3 className="text-2xl font-bold mb-2">Game Paused</h3>
                        <p className="text-muted-foreground">Click Resume to continue</p>
                      </div>
                    </motion.div>}
                </motion.div>}

              {/* Game Over State */}
              {gameState === 'gameOver' && <motion.div key="gameOver" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                type: "spring",
                delay: 0.2
              }} className="mb-6">
                    <div className="text-6xl mb-4">💥</div>
                    <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
                    <p className="text-xl text-muted-foreground mb-4">
                      Final Score: <span className="font-bold text-accent">{score}</span>
                    </p>
                    
                    {score === bestScore && score > 0 && <motion.p initial={{
                  opacity: 0,
                  scale: 0.8
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} className="text-warning font-bold mb-4 animate-pulse-glow">
                        🏆 New Best Score! 🏆
                      </motion.p>}
                  </motion.div>

                  <div className="flex gap-4">
                    <Button onClick={startGame} className="game-button">
                      <Play className="w-5 h-5 mr-2" />
                      Play Again
                    </Button>
                    
                    <Button onClick={() => setLeaderboardOpen(true)} className="game-button-secondary">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Scores
                    </Button>
                  </div>
                </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Leaderboard Modal */}
      <Leaderboard isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} scores={scores} currentScore={gameState === 'gameOver' ? score : undefined} />
    </div>;
};
export default Game;