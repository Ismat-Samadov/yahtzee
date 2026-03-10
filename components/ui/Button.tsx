'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'cyan' | 'purple' | 'pink' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'cyan',
  size = 'md',
  disabled,
  className = '',
  type = 'button',
}: ButtonProps) {
  const variants = {
    cyan: 'bg-cyan-500/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]',
    purple:
      'bg-purple-500/20 border border-purple-500 text-purple-400 hover:bg-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    pink: 'bg-pink-500/20 border border-pink-500 text-pink-400 hover:bg-pink-500/40 hover:shadow-[0_0_20px_rgba(255,0,110,0.5)]',
    ghost:
      'bg-white/5 border border-white/20 text-white/60 hover:bg-white/10 hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={`
        rounded-lg font-semibold transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
