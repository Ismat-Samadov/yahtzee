'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface PauseModalProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseModal({ onResume, onQuit }: PauseModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
        className="flex flex-col items-center gap-6 p-10 rounded-2xl text-center"
        style={{
          background: 'rgba(12,12,20,0.98)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 60px rgba(0,212,255,0.1), 0 25px 60px rgba(0,0,0,0.8)',
          minWidth: 300,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-orbitron)',
              fontSize: '1.5rem',
              color: '#00d4ff',
              textShadow: '0 0 20px rgba(0,212,255,0.6)',
              letterSpacing: '0.2em',
              marginBottom: '0.5rem',
            }}
          >
            PAUSED
          </h2>
          <p
            style={{
              color: 'rgba(224,224,224,0.3)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
            }}
          >
            Game in progress
          </p>
        </div>

        <div
          style={{
            width: 60,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
          }}
        />

        <div className="flex flex-col gap-3 w-full">
          <Button variant="cyan" size="lg" onClick={onResume} className="w-full">
            ▶ Resume
          </Button>
          <Button variant="pink" size="md" onClick={onQuit} className="w-full">
            ✕ Quit to Menu
          </Button>
        </div>

        <p
          style={{
            color: 'rgba(224,224,224,0.2)',
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
          }}
        >
          Your progress will be lost if you quit
        </p>
      </motion.div>
    </motion.div>
  );
}
