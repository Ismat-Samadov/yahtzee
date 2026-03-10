'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { MAX_ROLLS } from '@/lib/constants';

interface GameControlsProps {
  rollsRemaining: number;
  currentRound: number;
  totalRounds: number;
  isRolling: boolean;
  canRoll: boolean;
  isCurrentPlayerHuman: boolean;
  hasRolledOnce: boolean;
  onRoll: () => void;
  onPause: () => void;
}

export function GameControls({
  rollsRemaining,
  currentRound,
  totalRounds,
  isRolling,
  canRoll,
  isCurrentPlayerHuman,
  hasRolledOnce,
  onRoll,
  onPause,
}: GameControlsProps) {
  const rollsUsed = MAX_ROLLS - rollsRemaining;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Round info */}
      <div className="flex items-center gap-3">
        <span
          style={{
            color: 'rgba(224,224,224,0.4)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-share-tech)',
          }}
        >
          Round
        </span>
        <span
          className="font-bold"
          style={{
            color: '#00d4ff',
            fontFamily: 'var(--font-orbitron)',
            fontSize: '1rem',
            textShadow: '0 0 10px rgba(0,212,255,0.6)',
          }}
        >
          {currentRound}
          <span style={{ color: 'rgba(0,212,255,0.4)' }}>/{totalRounds}</span>
        </span>
      </div>

      {/* Roll button */}
      <motion.button
        onClick={onRoll}
        disabled={!canRoll || !isCurrentPlayerHuman || isRolling}
        className="relative px-10 py-4 rounded-xl font-bold text-lg uppercase tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          fontFamily: 'var(--font-orbitron)',
          background:
            canRoll && isCurrentPlayerHuman && !isRolling
              ? 'rgba(0,212,255,0.15)'
              : 'rgba(255,255,255,0.05)',
          border:
            canRoll && isCurrentPlayerHuman && !isRolling
              ? '2px solid #00d4ff'
              : '2px solid rgba(255,255,255,0.1)',
          color:
            canRoll && isCurrentPlayerHuman && !isRolling
              ? '#00d4ff'
              : 'rgba(224,224,224,0.3)',
          boxShadow:
            canRoll && isCurrentPlayerHuman && !isRolling
              ? '0 0 20px rgba(0,212,255,0.3), inset 0 0 20px rgba(0,212,255,0.05)'
              : 'none',
          letterSpacing: '0.15em',
          cursor:
            canRoll && isCurrentPlayerHuman && !isRolling
              ? 'pointer'
              : 'not-allowed',
        }}
        whileHover={
          canRoll && isCurrentPlayerHuman && !isRolling
            ? {
                scale: 1.03,
                boxShadow:
                  '0 0 30px rgba(0,212,255,0.5), inset 0 0 30px rgba(0,212,255,0.08)',
              }
            : undefined
        }
        whileTap={
          canRoll && isCurrentPlayerHuman && !isRolling ? { scale: 0.97 } : undefined
        }
      >
        {isRolling ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            >
              ⟳
            </motion.span>
            Rolling...
          </span>
        ) : !isCurrentPlayerHuman ? (
          'AI Turn'
        ) : rollsRemaining === 0 ? (
          'No Rolls Left'
        ) : (
          'Roll Dice'
        )}
      </motion.button>

      {/* Roll indicators */}
      <div className="flex items-center gap-2">
        <span
          style={{
            color: 'rgba(224,224,224,0.3)',
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Rolls
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_ROLLS }, (_, i) => (
            <motion.div
              key={i}
              animate={
                i < rollsUsed
                  ? { scale: 0.7, opacity: 0.2 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.2 }}
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  i < rollsUsed
                    ? 'rgba(255,255,255,0.1)'
                    : '#00d4ff',
                boxShadow:
                  i < rollsUsed
                    ? 'none'
                    : '0 0 8px rgba(0,212,255,0.6)',
              }}
            />
          ))}
        </div>
        <span
          style={{
            color: 'rgba(224,224,224,0.3)',
            fontSize: '0.65rem',
          }}
        >
          {rollsRemaining} left
        </span>
      </div>

      {/* Hint text */}
      {isCurrentPlayerHuman && hasRolledOnce && (
        <p
          className="text-center max-w-xs"
          style={{
            color: 'rgba(224,224,224,0.3)',
            fontSize: '0.65rem',
            lineHeight: 1.4,
          }}
        >
          Click dice to hold · Click a score to lock it in
        </p>
      )}
      {isCurrentPlayerHuman && !hasRolledOnce && (
        <p
          style={{
            color: 'rgba(0,212,255,0.5)',
            fontSize: '0.65rem',
            letterSpacing: '0.05em',
          }}
        >
          Press Roll to start your turn!
        </p>
      )}

      {/* Pause button */}
      <Button variant="ghost" size="sm" onClick={onPause}>
        ⏸ Pause
      </Button>
    </div>
  );
}
