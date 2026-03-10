'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  playClickSound,
  playHoldSound,
  playLoseSound,
  playRollSound,
  playScoreSound,
  playWinSound,
  playYahtzeeSound,
} from '@/lib/soundEffects';

export function useSounds() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('yahtzee-sound');
    if (stored !== null) setSoundEnabled(stored === 'true');
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('yahtzee-sound', next.toString());
      return next;
    });
  }, []);

  const play = useCallback(
    (fn: () => void) => {
      if (soundEnabled) fn();
    },
    [soundEnabled]
  );

  return {
    soundEnabled,
    toggleSound,
    playRoll: () => play(playRollSound),
    playHold: () => play(playHoldSound),
    playScore: () => play(playScoreSound),
    playYahtzee: () => play(playYahtzeeSound),
    playWin: () => play(playWinSound),
    playLose: () => play(playLoseSound),
    playClick: () => play(playClickSound),
  };
}
