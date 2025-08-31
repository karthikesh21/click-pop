import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Target } from 'lucide-react';

interface Score {
  score: number;
  date: string;
  id: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  scores: Score[];
  currentScore?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
  scores,
  currentScore
}) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score).slice(0, 5);
  const bestScore = sortedScores.length > 0 ? sortedScores[0].score : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Trophy className="w-6 h-6" />
            Leaderboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Session Score */}
          {currentScore !== undefined && currentScore > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="game-ui-panel border-accent/50 bg-accent/10"
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                <span className="font-semibold text-accent">Current Session:</span>
                <span className="font-bold text-lg text-accent">{currentScore}</span>
              </div>
            </motion.div>
          )}

          {/* Best Score Highlight */}
          {bestScore > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="game-ui-panel border-warning/50 bg-warning/10"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="font-semibold text-warning">Best Score:</span>
                <span className="font-bold text-xl text-warning">{bestScore}</span>
              </div>
            </motion.div>
          )}

          {/* Top Scores List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground mb-3">Top 5 Scores</h3>
            
            <AnimatePresence>
              {sortedScores.length > 0 ? (
                sortedScores.map((score, index) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-secondary/50 border border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0 ? 'bg-primary text-primary-foreground' :
                        index === 1 ? 'bg-accent text-accent-foreground' :
                        index === 2 ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-lg">{score.score}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(score.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <Trophy className="w-5 h-5 text-primary animate-pulse-glow" />
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No scores yet!</p>
                  <p className="text-sm">Play a game to set your first record.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4">
            <Button 
              onClick={onClose}
              className="w-full game-button"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Leaderboard;