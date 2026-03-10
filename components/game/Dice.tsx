'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Die } from '@/types/game';
import { DiceFace } from './DiceFace';

interface DiceProps {
  dice: Die[];
  onToggleHold: (id: number) => void;
  disabled: boolean;
  isCurrentPlayer: boolean;
}

export function Dice({ dice, onToggleHold, disabled, isCurrentPlayer }: DiceProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {dice.map(die => (
        <motion.div
          key={die.id}
          className="relative cursor-pointer select-none"
          onClick={() => {
            if (!disabled && isCurrentPlayer) {
              onToggleHold(die.id);
            }
          }}
          animate={
            die.isRolling
              ? {
                  rotate: [0, -20, 15, -10, 8, -4, 0],
                  scale: [1, 1.1, 0.95, 1.08, 0.97, 1.02, 1],
                }
              : { rotate: 0, scale: 1 }
          }
          transition={
            die.isRolling
              ? { duration: 0.6, ease: 'easeOut' }
              : { duration: 0.15 }
          }
          whileHover={
            !disabled && isCurrentPlayer && !die.isRolling
              ? { scale: 1.08, y: -3 }
              : undefined
          }
          whileTap={
            !disabled && isCurrentPlayer && !die.isRolling
              ? { scale: 0.95 }
              : undefined
          }
        >
          <DiceFace
            value={die.value}
            held={die.held}
            isRolling={die.isRolling}
            size={72}
          />

          {/* HELD badge */}
          <AnimatePresence>
            {die.held && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="absolute -bottom-6 left-0 right-0 flex justify-center"
              >
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{
                    background: 'rgba(0,255,136,0.15)',
                    border: '1px solid rgba(0,255,136,0.5)',
                    color: '#00ff88',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    textShadow: '0 0 8px rgba(0,255,136,0.8)',
                  }}
                >
                  HELD
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
