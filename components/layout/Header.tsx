'use client';
import { motion } from 'framer-motion';

interface HeaderProps {
  currentRound: number;
  totalRounds: number;
  highScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function Header({
  currentRound,
  totalRounds,
  highScore,
  soundEnabled,
  onToggleSound,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 px-4 py-3"
      style={{
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.div
          animate={{
            textShadow: [
              '0 0 10px rgba(0,212,255,0.6)',
              '0 0 20px rgba(0,212,255,1)',
              '0 0 10px rgba(0,212,255,0.6)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-orbitron)',
            fontWeight: 900,
            fontSize: '1.25rem',
            color: '#00d4ff',
            letterSpacing: '0.2em',
            flexShrink: 0,
          }}
        >
          YAHTZEE
        </motion.div>

        {/* Center info */}
        <div className="flex items-center gap-4">
          {/* Round */}
          <div className="flex items-center gap-1.5">
            <span
              style={{
                color: 'rgba(224,224,224,0.3)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-share-tech)',
              }}
            >
              Round
            </span>
            <span
              style={{
                color: '#00d4ff',
                fontFamily: 'var(--font-orbitron)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {currentRound}
              <span style={{ color: 'rgba(0,212,255,0.4)' }}>/{totalRounds}</span>
            </span>
          </div>

          {/* High score */}
          {highScore > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span
                style={{
                  color: 'rgba(224,224,224,0.3)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Best
              </span>
              <span
                style={{
                  color: '#ffd700',
                  fontFamily: 'var(--font-share-tech)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textShadow: '0 0 8px rgba(255,215,0,0.4)',
                }}
              >
                {highScore}
              </span>
            </div>
          )}
        </div>

        {/* Sound toggle */}
        <motion.button
          onClick={onToggleSound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
          style={{
            background: soundEnabled ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.04)',
            border: soundEnabled
              ? '1px solid rgba(0,212,255,0.3)'
              : '1px solid rgba(255,255,255,0.08)',
            color: soundEnabled ? '#00d4ff' : 'rgba(224,224,224,0.3)',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </motion.button>
      </div>
    </header>
  );
}
