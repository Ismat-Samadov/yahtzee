'use client';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { useSounds } from '@/hooks/useSounds';
import { useHighScore } from '@/hooks/useHighScore';
import { SetupScreen } from '@/components/game/SetupScreen';
import { EndScreen } from '@/components/game/EndScreen';
import { PauseModal } from '@/components/game/PauseModal';
import { Header } from '@/components/layout/Header';
import { Dice } from '@/components/game/Dice';
import { Scorecard } from '@/components/game/Scorecard';
import { GameControls } from '@/components/game/GameControls';
import { PlayerInfo } from '@/components/game/PlayerInfo';
import { Difficulty, ScoreCategory } from '@/types/game';
import { calculateTotalScore, isYahtzee } from '@/lib/gameLogic';

export default function Home() {
  const { state, startGame, rollDice, toggleHold, scoreCategory, togglePause, resetGame } =
    useGameState();
  const sounds = useSounds();
  const { highScore, updateHighScore } = useHighScore();

  const prevPhaseRef = useRef(state.phase);
  const prevRollingRef = useRef(state.isRolling);
  const prevPlayerIdxRef = useRef(state.currentPlayerIndex);
  const prevRoundsRef = useRef(state.currentRound);

  // Sound effects on state changes
  useEffect(() => {
    // Detect roll completion
    if (prevRollingRef.current && !state.isRolling && state.hasRolledOnce) {
      sounds.playRoll();
    }
    prevRollingRef.current = state.isRolling;
  }, [state.isRolling, state.hasRolledOnce, sounds]);

  useEffect(() => {
    // Detect scoring (turn change = score was made)
    if (
      prevPlayerIdxRef.current !== state.currentPlayerIndex ||
      prevRoundsRef.current !== state.currentRound
    ) {
      sounds.playScore();
    }
    prevPlayerIdxRef.current = state.currentPlayerIndex;
    prevRoundsRef.current = state.currentRound;
  }, [state.currentPlayerIndex, state.currentRound, sounds]);

  useEffect(() => {
    if (state.phase === 'ended' && prevPhaseRef.current === 'playing') {
      const human = state.players.find(p => !p.isAI);
      const ai = state.players.find(p => p.isAI);
      if (human && ai) {
        const humanScore = calculateTotalScore(human.scoreCard);
        const aiScore = calculateTotalScore(ai.scoreCard);
        updateHighScore(humanScore);
        if (humanScore > aiScore) {
          sounds.playWin();
        } else {
          sounds.playLose();
        }
      }
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, state.players, sounds, updateHighScore]);

  // Check for Yahtzee during play
  useEffect(() => {
    if (state.phase !== 'playing' || !state.hasRolledOnce || state.isRolling) return;
    const diceValues = state.dice.map(d => d.value);
    if (isYahtzee(diceValues)) {
      sounds.playYahtzee();
    }
  }, [state.hasRolledOnce, state.isRolling, state.phase, sounds, state.dice]);

  const handleStartGame = (playerName: string, difficulty: Difficulty) => {
    sounds.playClick();
    startGame(playerName, difficulty);
  };

  const handleRoll = () => {
    sounds.playClick();
    rollDice();
  };

  const handleToggleHold = (id: number) => {
    sounds.playHold();
    toggleHold(id);
  };

  const handleScoreCategory = (category: ScoreCategory) => {
    sounds.playScore();
    scoreCategory(category);
  };

  const handleTogglePause = () => {
    sounds.playClick();
    togglePause();
  };

  const handleResume = () => {
    sounds.playClick();
    togglePause();
  };

  const handleQuit = () => {
    sounds.playClick();
    resetGame();
  };

  const handlePlayAgain = () => {
    sounds.playClick();
    resetGame();
  };

  if (state.phase === 'setup') {
    return <SetupScreen onStart={handleStartGame} />;
  }

  if (state.phase === 'ended') {
    return (
      <EndScreen
        players={state.players}
        highScore={highScore}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const humanPlayer = state.players.find(p => !p.isAI);
  const aiPlayer = state.players.find(p => p.isAI);
  const isHumanTurn = !currentPlayer?.isAI;
  const diceValues = state.dice.map(d => d.value);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentRound={state.currentRound}
        totalRounds={state.totalRounds}
        highScore={highScore}
        soundEnabled={sounds.soundEnabled}
        onToggleSound={sounds.toggleSound}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-4 flex flex-col gap-4">
        {/* Player info row */}
        <div className="grid grid-cols-2 gap-3">
          {state.players.map(player => (
            <PlayerInfo
              key={player.id}
              player={player}
              isCurrentPlayer={state.currentPlayerIndex === state.players.indexOf(player)}
            />
          ))}
        </div>

        {/* Main game area */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1">
          {/* Left: Dice + Controls */}
          <div className="flex flex-col gap-4 flex-1">
            {/* Dice area */}
            <motion.div
              className="rounded-xl p-6 flex flex-col items-center gap-8"
              style={{
                background: 'rgba(12,12,18,0.9)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${isHumanTurn ? 'rgba(0,212,255,0.15)' : 'rgba(168,85,247,0.15)'}`,
                boxShadow: isHumanTurn
                  ? '0 0 20px rgba(0,212,255,0.08)'
                  : '0 0 20px rgba(168,85,247,0.08)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Turn indicator */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: isHumanTurn ? '#00d4ff' : '#a855f7',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: isHumanTurn ? '#00d4ff' : '#a855f7',
                    textTransform: 'uppercase',
                    textShadow: isHumanTurn
                      ? '0 0 8px rgba(0,212,255,0.5)'
                      : '0 0 8px rgba(168,85,247,0.5)',
                  }}
                >
                  {isHumanTurn ? "Your Turn" : `${currentPlayer?.name}'s Turn`}
                </span>
              </div>

              {/* Dice */}
              <div className="pb-6">
                <Dice
                  dice={state.dice}
                  onToggleHold={handleToggleHold}
                  disabled={!isHumanTurn || state.isRolling || !state.hasRolledOnce}
                  isCurrentPlayer={isHumanTurn}
                />
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              className="rounded-xl p-5 flex items-center justify-center"
              style={{
                background: 'rgba(12,12,18,0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <GameControls
                rollsRemaining={state.rollsRemaining}
                currentRound={state.currentRound}
                totalRounds={state.totalRounds}
                isRolling={state.isRolling}
                canRoll={state.rollsRemaining > 0}
                isCurrentPlayerHuman={isHumanTurn}
                hasRolledOnce={state.hasRolledOnce}
                onRoll={handleRoll}
                onPause={handleTogglePause}
              />
            </motion.div>
          </div>

          {/* Right: Scorecards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:w-64 xl:w-72">
            {humanPlayer && (
              <Scorecard
                player={humanPlayer}
                dice={isHumanTurn ? diceValues : []}
                hasRolled={isHumanTurn && state.hasRolledOnce}
                isCurrentPlayer={isHumanTurn}
                onScore={handleScoreCategory}
              />
            )}
            {aiPlayer && (
              <Scorecard
                player={aiPlayer}
                dice={!isHumanTurn ? diceValues : []}
                hasRolled={!isHumanTurn && state.hasRolledOnce}
                isCurrentPlayer={!isHumanTurn}
                onScore={() => {}}
              />
            )}
          </div>
        </div>
      </main>

      {/* Pause modal */}
      <AnimatePresence>
        {state.isPaused && (
          <PauseModal onResume={handleResume} onQuit={handleQuit} />
        )}
      </AnimatePresence>
    </div>
  );
}
