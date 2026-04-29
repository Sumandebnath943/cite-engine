import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type CardGlow = 'violet' | 'gold' | 'cyan' | 'indigo' | 'none';

interface CardProps {
  children: React.ReactNode;
  glow?: CardGlow;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const glowClasses: Record<CardGlow, string> = {
  violet: 'shadow-glow-violet border-violet-500/20',
  gold:   'shadow-glow-gold border-gold-500/20',
  cyan:   'shadow-glow-cyan border-cyan-500/20',
  indigo: 'shadow-glow-indigo border-indigo-500/20',
  none:   'border-white/7',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  glow = 'none',
  className,
  hover = false,
  onClick,
  padding = 'md',
}) => {
  const baseClasses = clsx(
    'bg-bg-card rounded-card border',
    'transition-all duration-300',
    glowClasses[glow],
    paddingClasses[padding],
    hover && 'hover:-translate-y-0.5 hover:border-white/12 cursor-pointer',
    className
  );

  if (hover || onClick) {
    return (
      <motion.div
        className={baseClasses}
        onClick={onClick}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
};
