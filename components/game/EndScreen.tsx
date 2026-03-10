'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game';
import { calculateTotalScore } from '@/lib/gameLogic';
import { Button } from '@/components/ui/Button';
import {
  CATEGORY_LABELS,
  UPPER_BONUS,
  UPPER_BONUS_THRESHOLD,
  YAHTZEE_BONUS,
} from '@/lib/constants';
import { calculateUpperScore } from '@/lib/gameLogic';

interface EndScreenProps {
  players: Player[];
  highScore: number;
  onPlayAgain: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  duration: number;
  delay: number;
  size: number;
}

const CONFETTI_COLORS = ['#00d4ff', '#a855f7', '#ff006e', '#00ff88', '#ffd700'];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 3,
    size: 4 + Math.random() * 8,
  }));
}

export function EndScreen({ players, highScore, onPlayAgain }: EndScreenProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const scores = players.map(p => ({
    player: p,
    total: calculateTotalScore(p.scoreCard),
    upperScore: calculateUpperScore(p.scoreCard),
    upperBonus: calculateUpperScore(p.scoreCard) >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS : 0,
    yahtzeeBonuses: p.scoreCard.yahtzeeBonuses,
  }));

  scores.sort((a, b) => b.total - a.total);
  const winner = scores[0];
  const isHumanWinner = !winner.player.isAI;
  const isTie = scores.length > 1 && scores[0].total === scores[1].total;

  const humanPlayer = players.find(p => !p.isAI);
  const humanScore = humanPlayer ? calculateTotalScore(humanPlayer.scoreCard) : 0;
  const isNewHighScore = humanScore > 0 && humanScore >= highScore && isHumanWinner;

  useEffect(() => {
    setConfetti(generateConfetti(40));
    const timer = setTimeout(() => setShowDetails(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Confetti */}
      {confetti.map(piece => (
        <motion.div
          key={piece.id}
          className="absolute pointer-events-none rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            background: piece.color,
            boxShadow: `0 0 6px ${piece.color}`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1) * 2],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHumanWinner
            ? 'radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(168,85,247,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="relative z-10 w-full max-w-lg"
        style={{
          background: 'rgba(10,10,18,0.98)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHumanWinner ? 'rgba(0,212,255,0.3)' : 'rgba(168,85,247,0.3)'}`,
          borderRadius: 20,
          boxShadow: isHumanWinner
            ? '0 0 60px rgba(0,212,255,0.15), 0 25px 60px rgba(0,0,0,0.7)'
            : '0 0 60px rgba(168,85,247,0.15), 0 25px 60px rgba(0,0,0,0.7)',
          padding: '2rem',
        }}
      >
        {/* Winner announcement */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="text-5xl mb-3"
          >
            {isTie ? '🤝' : isHumanWinner ? '🏆' : '🤖'}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: isHumanWinner ? '#00d4ff' : '#a855f7',
              textShadow: isHumanWinner
                ? '0 0 20px rgba(0,212,255,0.8)'
                : '0 0 20px rgba(168,85,247,0.8)',
              letterSpacing: '0.1em',
              marginBottom: '0.25rem',
            }}
          >
            {isTie ? "IT'S A TIE!" : isHumanWinner ? 'YOU WIN!' : `${winner.player.name} WINS!`}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ color: 'rgba(224,224,224,0.4)', fontSize: '0.75rem', letterSpacing: '0.2em' }}
          >
            {isTie
              ? "What a match!"
              : isHumanWinner
              ? 'Excellent game!'
              : 'Better luck next time!'}
          </motion.p>

          {isNewHighScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold"
              style={{
                background: 'rgba(255,215,0,0.15)',
                border: '1px solid rgba(255,215,0,0.4)',
                color: '#ffd700',
                textShadow: '0 0 10px rgba(255,215,0,0.6)',
                fontFamily: 'var(--font-orbitron)',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
              }}
            >
              ★ NEW HIGH SCORE!
            </motion.div>
          )}
        </div>

        {/* Score comparison */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3 mb-6"
            >
              {scores.map((entry, idx) => (
                <motion.div
                  key={entry.player.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    background: idx === 0 ? (isHumanWinner ? 'rgba(0,212,255,0.08)' : 'rgba(168,85,247,0.08)') : 'rgba(255,255,255,0.02)',
                    border: idx === 0
                      ? `1px solid ${isHumanWinner ? 'rgba(0,212,255,0.25)' : 'rgba(168,85,247,0.25)'}`
                      : '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{idx === 0 && !isTie ? '👑' : entry.player.isAI ? '🤖' : '👤'}</span>
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{
                          color: entry.player.isAI ? '#a855f7' : '#00d4ff',
                          fontFamily: 'var(--font-orbitron)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {entry.player.name}
                      </div>
                      <div style={{ color: 'rgba(224,224,224,0.3)', fontSize: '0.6rem' }}>
                        Upper: {entry.upperScore} {entry.upperBonus > 0 ? `+${entry.upperBonus} bonus` : ''}
                        {entry.yahtzeeBonuses > 0 ? ` · ${entry.yahtzeeBonuses} Yahtzee bonus` : ''}
                      </div>
                    </div>
                  </div>
                  <div
                    className="font-bold text-xl font-mono"
                    style={{
                      color: entry.player.isAI ? '#a855f7' : '#00d4ff',
                      textShadow: `0 0 12px ${entry.player.isAI ? 'rgba(168,85,247,0.6)' : 'rgba(0,212,255,0.6)'}`,
                    }}
                  >
                    {entry.total}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* High score */}
        <div
          className="flex items-center justify-center gap-2 mb-6 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span style={{ color: 'rgba(224,224,224,0.3)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            All-Time High Score
          </span>
          <span
            style={{
              color: '#ffd700',
              fontFamily: 'var(--font-mono)',
              fontWeight: 'bold',
              fontSize: '1rem',
              textShadow: '0 0 10px rgba(255,215,0,0.5)',
            }}
          >
            {highScore}
          </span>
        </div>

        {/* Score breakdown toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(v => !v)}
            className="w-full py-2 text-xs rounded-lg transition-all"
            style={{
              color: 'rgba(224,224,224,0.3)',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            {showDetails ? '▲ Hide Details' : '▼ Show Score Details'}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="cyan"
            size="lg"
            onClick={onPlayAgain}
            className="flex-1"
          >
            Play Again
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
