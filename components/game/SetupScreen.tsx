'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Difficulty } from '@/types/game';
import { DiceFace } from './DiceFace';

interface SetupScreenProps {
  onStart: (playerName: string, difficulty: Difficulty) => void;
}

const FLOATING_DICE = [
  { value: 5 as const, x: '10%', y: '15%', delay: 0, rotation: 15 },
  { value: 3 as const, x: '85%', y: '10%', delay: 0.5, rotation: -20 },
  { value: 6 as const, x: '5%', y: '70%', delay: 1, rotation: 10 },
  { value: 2 as const, x: '90%', y: '65%', delay: 1.5, rotation: -15 },
  { value: 4 as const, x: '50%', y: '5%', delay: 0.8, rotation: 25 },
  { value: 1 as const, x: '75%', y: '85%', delay: 0.3, rotation: -8 },
];

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(playerName.trim() || 'Player', difficulty);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Floating background dice */}
      {FLOATING_DICE.map((die, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10 pointer-events-none"
          style={{ left: die.x, top: die.y, rotate: die.rotation }}
          animate={{
            y: [0, -15, 0],
            rotate: [die.rotation, die.rotation + 5, die.rotation],
          }}
          transition={{
            duration: 3 + i * 0.4,
            delay: die.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <DiceFace value={die.value} held={false} isRolling={false} size={60} />
        </motion.div>
      ))}

      {/* Background glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '20%',
          right: '20%',
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
        style={{
          background: 'rgba(12,12,20,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 20,
          boxShadow:
            '0 0 60px rgba(0,212,255,0.1), 0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
          padding: '2.5rem',
        }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <motion.h1
            animate={{
              textShadow: [
                '0 0 10px rgba(0,212,255,0.8), 0 0 30px rgba(0,212,255,0.4)',
                '0 0 20px rgba(0,212,255,1), 0 0 50px rgba(0,212,255,0.6)',
                '0 0 10px rgba(0,212,255,0.8), 0 0 30px rgba(0,212,255,0.4)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: '3rem',
              fontWeight: 900,
              color: '#00d4ff',
              letterSpacing: '0.2em',
              lineHeight: 1,
              marginBottom: '0.5rem',
            }}
          >
            YAHTZEE
          </motion.h1>
          <p
            style={{
              color: 'rgba(224,224,224,0.4)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-share-tech)',
            }}
          >
            Neon Cyberpunk Edition
          </p>

          {/* Decorative line */}
          <div
            className="mt-4 mx-auto"
            style={{
              height: 1,
              width: '80%',
              background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
            }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Player name */}
          <div>
            <label
              style={{
                display: 'block',
                color: 'rgba(224,224,224,0.5)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-share-tech)',
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              className="neon-input w-full px-4 py-3 rounded-lg text-sm"
              style={{ fontFamily: 'var(--font-share-tech)' }}
            />
          </div>

          {/* Difficulty selector */}
          <div>
            <label
              style={{
                display: 'block',
                color: 'rgba(224,224,224,0.5)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                fontFamily: 'var(--font-share-tech)',
              }}
            >
              AI Difficulty
            </label>
            <div
              className="grid grid-cols-2 gap-2 p-1 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {(['easy', 'hard'] as Difficulty[]).map(diff => (
                <motion.button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-orbitron)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    background:
                      difficulty === diff
                        ? diff === 'easy'
                          ? 'rgba(0,212,255,0.2)'
                          : 'rgba(168,85,247,0.2)'
                        : 'transparent',
                    color:
                      difficulty === diff
                        ? diff === 'easy'
                          ? '#00d4ff'
                          : '#a855f7'
                        : 'rgba(224,224,224,0.3)',
                    border:
                      difficulty === diff
                        ? diff === 'easy'
                          ? '1px solid rgba(0,212,255,0.4)'
                          : '1px solid rgba(168,85,247,0.4)'
                        : '1px solid transparent',
                    boxShadow:
                      difficulty === diff
                        ? diff === 'easy'
                          ? '0 0 15px rgba(0,212,255,0.2)'
                          : '0 0 15px rgba(168,85,247,0.2)'
                        : 'none',
                  }}
                >
                  {diff === 'easy' ? '🎲 Easy' : '🤖 Hard'}
                </motion.button>
              ))}
            </div>
            <p
              style={{
                color: 'rgba(224,224,224,0.25)',
                fontSize: '0.6rem',
                marginTop: '0.4rem',
                paddingLeft: '0.25rem',
              }}
            >
              {difficulty === 'easy'
                ? 'Bot plays randomly — great for learning!'
                : 'Bot uses optimal strategy — a real challenge!'}
            </p>
          </div>

          {/* Start button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,212,255,0.5)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-lg tracking-widest transition-all duration-200"
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: '1rem',
              letterSpacing: '0.2em',
              background: 'rgba(0,212,255,0.15)',
              border: '2px solid #00d4ff',
              color: '#00d4ff',
              boxShadow: '0 0 20px rgba(0,212,255,0.3), inset 0 0 20px rgba(0,212,255,0.05)',
            }}
          >
            START GAME
          </motion.button>
        </form>

        {/* How to play hint */}
        <div
          className="mt-6 pt-4 text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p style={{ color: 'rgba(224,224,224,0.2)', fontSize: '0.6rem', letterSpacing: '0.05em' }}>
            Roll 5 dice · Hold keepers · Score 13 categories · Beat the bot!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
