'use client';
import { motion } from 'framer-motion';
import { ScoreCategory, ScoreCard, DieValue } from '@/types/game';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/lib/constants';
import { calculateScore } from '@/lib/gameLogic';

interface ScoreRowProps {
  category: ScoreCategory;
  scoreCard: ScoreCard;
  dice: DieValue[];
  hasRolled: boolean;
  isCurrentPlayer: boolean;
  isHuman: boolean;
  onScore: (category: ScoreCategory) => void;
}

export function ScoreRow({
  category,
  scoreCard,
  dice,
  hasRolled,
  isCurrentPlayer,
  isHuman,
  onScore,
}: ScoreRowProps) {
  const scored = scoreCard[category as keyof ScoreCard];
  const isScored = scored !== undefined;
  const potentialScore = hasRolled && isCurrentPlayer && !isScored && dice.length > 0
    ? calculateScore(category, dice)
    : null;

  const canScore = isCurrentPlayer && isHuman && hasRolled && !isScored;

  return (
    <motion.div
      className={`
        flex items-center justify-between px-3 py-1.5 rounded-md transition-all duration-150
        ${isScored ? 'opacity-60' : ''}
        ${canScore ? 'cursor-pointer group' : 'cursor-default'}
      `}
      style={{
        background: isScored
          ? 'rgba(255,255,255,0.02)'
          : canScore
          ? 'rgba(0,212,255,0.03)'
          : 'transparent',
        border: isScored
          ? '1px solid rgba(255,255,255,0.04)'
          : canScore
          ? '1px solid rgba(0,212,255,0.1)'
          : '1px solid transparent',
      }}
      onClick={() => {
        if (canScore) onScore(category);
      }}
      whileHover={
        canScore
          ? {
              backgroundColor: 'rgba(0,212,255,0.08)',
              borderColor: 'rgba(0,212,255,0.3)',
            }
          : undefined
      }
      whileTap={canScore ? { scale: 0.98 } : undefined}
    >
      {/* Category info */}
      <div className="flex flex-col min-w-0">
        <span
          className="text-xs font-semibold truncate"
          style={{
            color: isScored
              ? 'rgba(224,224,224,0.5)'
              : canClose(canScore)
              ? '#00d4ff'
              : 'rgba(224,224,224,0.7)',
            fontFamily: 'var(--font-share-tech)',
            letterSpacing: '0.02em',
          }}
        >
          {CATEGORY_LABELS[category]}
        </span>
        <span
          className="text-xs hidden sm:block"
          style={{ color: 'rgba(224,224,224,0.3)', fontSize: '0.6rem' }}
        >
          {CATEGORY_DESCRIPTIONS[category]}
        </span>
      </div>

      {/* Score value */}
      <div className="flex items-center gap-1 ml-2 shrink-0">
        {isScored ? (
          <motion.span
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-bold font-mono min-w-[2rem] text-right"
            style={{
              color: (scored as number) > 0 ? '#00ff88' : 'rgba(224,224,224,0.3)',
              textShadow:
                (scored as number) > 0
                  ? '0 0 8px rgba(0,255,136,0.5)'
                  : 'none',
            }}
          >
            {scored as number}
          </motion.span>
        ) : potentialScore !== null ? (
          <span
            className="text-sm font-bold font-mono min-w-[2rem] text-right group-hover:opacity-100 opacity-60 transition-opacity"
            style={{
              color: potentialScore > 0 ? '#00d4ff' : 'rgba(224,224,224,0.3)',
              textShadow:
                potentialScore > 0 ? '0 0 6px rgba(0,212,255,0.4)' : 'none',
            }}
          >
            {potentialScore}
          </span>
        ) : (
          <span
            className="text-sm font-mono min-w-[2rem] text-right"
            style={{ color: 'rgba(224,224,224,0.15)' }}
          >
            —
          </span>
        )}
      </div>
    </motion.div>
  );
}

function canClose(v: boolean): boolean {
  return v;
}
