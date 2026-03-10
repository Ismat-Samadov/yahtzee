'use client';
import { motion } from 'framer-motion';
import { Player } from '@/types/game';
import { calculateTotalScore } from '@/lib/gameLogic';

interface PlayerInfoProps {
  player: Player;
  isCurrentPlayer: boolean;
}

export function PlayerInfo({ player, isCurrentPlayer }: PlayerInfoProps) {
  const total = calculateTotalScore(player.scoreCard);
  const isAI = player.isAI;
  const color = isAI ? '#a855f7' : '#00d4ff';

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300"
      style={{
        background: isCurrentPlayer
          ? isAI
            ? 'rgba(168,85,247,0.08)'
            : 'rgba(0,212,255,0.08)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isCurrentPlayer ? color + '40' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: isCurrentPlayer ? `0 0 15px ${color}20` : 'none',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Turn indicator */}
        {isCurrentPlayer ? (
          <motion.div
            animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{
              background: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        ) : (
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          />
        )}

        <div>
          <div
            className="font-bold text-sm"
            style={{
              fontFamily: 'var(--font-orbitron)',
              color: isCurrentPlayer ? color : 'rgba(224,224,224,0.5)',
              textShadow: isCurrentPlayer ? `0 0 10px ${color}60` : 'none',
              letterSpacing: '0.06em',
              fontSize: '0.75rem',
            }}
          >
            {player.name}
          </div>
          {isCurrentPlayer && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs"
              style={{
                color: `${color}80`,
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {isAI ? '🤖 Thinking...' : '▶ Your Turn'}
            </motion.div>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div
          className="font-bold font-mono text-lg"
          style={{
            color: isCurrentPlayer ? color : 'rgba(224,224,224,0.4)',
            textShadow: isCurrentPlayer ? `0 0 12px ${color}80` : 'none',
          }}
        >
          {total}
        </div>
        <div
          style={{
            color: 'rgba(224,224,224,0.25)',
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          pts
        </div>
      </div>
    </div>
  );
}
