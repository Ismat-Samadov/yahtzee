'use client';
import { useEffect, useState } from 'react';

export function useHighScore() {
  const [highScore, setHighScoreState] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem('yahtzee-high-score');
    if (stored) setHighScoreState(parseInt(stored, 10));
  }, []);

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScoreState(score);
      localStorage.setItem('yahtzee-high-score', score.toString());
    }
  };

  return { highScore, updateHighScore };
}
