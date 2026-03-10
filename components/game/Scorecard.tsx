'use client';
import { motion } from 'framer-motion';
import { Player, DieValue, ScoreCategory } from '@/types/game';
import {
  UPPER_CATEGORIES,
  LOWER_CATEGORIES,
  UPPER_BONUS_THRESHOLD,
  UPPER_BONUS,
  YAHTZEE_BONUS,
} from '@/lib/constants';
import {
  calculateUpperScore,
  calculateTotalScore,
} from '@/lib/gameLogic';
import { ScoreRow } from './ScoreRow';

interface ScorecardProps {
  player: Player;
  dice: DieValue[];
  hasRolled: boolean;
  isCurrentPlayer: boolean;
  onScore: (category: ScoreCategory) => void;
}

export function Scorecard({
  player,
  dice,
  hasRolled,
  isCurrentPlayer,
  onScore,
}: ScorecardProps) {
  const upperScore = calculateUpperScore(player.scoreCard);
  const upperBonus = upperScore >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS : 0;
  const total = calculateTotalScore(player.scoreCard);
  const upperProgress = Math.min(upperScore / UPPER_BONUS_THRESHOLD, 1);
  const isHuman = !player.isAI;

  const borderColor = isCurrentPlayer
    ? player.isAI
      ? 'rgba(168,85,247,0.4)'
      : 'rgba(0,212,255,0.4)'
    : 'rgba(255,255,255,0.06)';

  const headerColor = player.isAI ? '#a855f7' : '#00d4ff';

  return (
    <div
      className="rounded-xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(12,12,18,0.9)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${borderColor}`,
        boxShadow: isCurrentPlayer
          ? player.isAI
            ? '0 0 20px rgba(168,85,247,0.15)'
            : '0 0 20px rgba(0,212,255,0.15)'
          : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center justify-between"
        style={{
          background: isCurrentPlayer
            ? player.isAI
              ? 'rgba(168,85,247,0.1)'
              : 'rgba(0,212,255,0.1)'
            : 'rgba(255,255,255,0.03)',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div className="flex items-center gap-2">
          {isCurrentPlayer && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ background: headerColor }}
            />
          )}
          <span
            className="text-sm font-bold"
            style={{
              color: headerColor,
              fontFamily: 'var(--font-orbitron)',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textShadow: isCurrentPlayer
                ? `0 0 10px ${headerColor}80`
                : 'none',
            }}
          >
            {player.name}
          </span>
        </div>
        <span
          className="text-base font-bold font-mono"
          style={{
            color: headerColor,
            textShadow: `0 0 10px ${headerColor}60`,
          }}
        >
          {total}
        </span>
      </div>

      {/* Upper section */}
      <div className="px-1 pt-1">
        <div
          className="px-2 py-0.5 mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(224,224,224,0.3)', fontSize: '0.55rem' }}
        >
          Upper Section
        </div>

        {UPPER_CATEGORIES.map(cat => (
          <ScoreRow
            key={cat}
            category={cat}
            scoreCard={player.scoreCard}
            dice={dice}
            hasRolled={hasRolled}
            isCurrentPlayer={isCurrentPlayer}
            isHuman={isHuman}
            onScore={onScore}
          />
        ))}

        {/* Upper bonus progress */}
        <div className="px-3 py-2 mt-1">
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: 'rgba(224,224,224,0.5)', fontSize: '0.65rem' }}>
              Bonus ({upperScore}/{UPPER_BONUS_THRESHOLD})
            </span>
            <span
              style={{
                color: upperBonus > 0 ? '#00ff88' : 'rgba(224,224,224,0.4)',
                fontSize: '0.65rem',
                fontWeight: 'bold',
              }}
            >
              {upperBonus > 0 ? `+${UPPER_BONUS}` : `+${UPPER_BONUS}`}
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${upperProgress * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                background:
                  upperBonus > 0
                    ? 'linear-gradient(90deg, #00d4ff, #00ff88)'
                    : 'linear-gradient(90deg, #00d4ff, #a855f7)',
                boxShadow:
                  upperBonus > 0
                    ? '0 0 8px rgba(0,255,136,0.6)'
                    : '0 0 6px rgba(0,212,255,0.4)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 8px' }} />

      {/* Lower section */}
      <div className="px-1 pt-1">
        <div
          className="px-2 py-0.5 mb-1 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(224,224,224,0.3)', fontSize: '0.55rem' }}
        >
          Lower Section
        </div>

        {LOWER_CATEGORIES.map(cat => (
          <ScoreRow
            key={cat}
            category={cat}
            scoreCard={player.scoreCard}
            dice={dice}
            hasRolled={hasRolled}
            isCurrentPlayer={isCurrentPlayer}
            isHuman={isHuman}
            onScore={onScore}
          />
        ))}

        {/* Yahtzee bonuses */}
        {player.scoreCard.yahtzeeBonuses > 0 && (
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span style={{ color: 'rgba(255,215,0,0.8)', fontSize: '0.7rem' }}>
              Yahtzee Bonuses ×{player.scoreCard.yahtzeeBonuses}
            </span>
            <span
              style={{
                color: '#ffd700',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textShadow: '0 0 8px rgba(255,215,0,0.6)',
              }}
            >
              +{player.scoreCard.yahtzeeBonuses * YAHTZEE_BONUS}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div
        className="px-3 py-2 mt-1 flex items-center justify-between"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <span
          style={{
            color: 'rgba(224,224,224,0.5)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Total
        </span>
        <span
          className="font-bold font-mono text-base"
          style={{
            color: headerColor,
            textShadow: `0 0 12px ${headerColor}80`,
          }}
        >
          {total}
        </span>
      </div>
    </div>
  );
}
