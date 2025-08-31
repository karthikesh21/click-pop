import { useEffect } from 'react';
import Game from '@/components/Game';

const Index = () => {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = 'Reaction Speed Game - Test Your Reflexes | Lightning Fast Mini-Game';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Test your reaction speed in this addictive mini-game! Click targets before time runs out. Features leaderboards, difficulty scaling, and smooth animations. Perfect for mobile and desktop.');
    }
  }, []);

  return <Game />;
};

export default Index;
