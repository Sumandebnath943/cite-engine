import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type ProgressColor = 'indigo' | 'violet' | 'gold' | 'cyan' | 'success' | 'danger';

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  color?: ProgressColor;
  size?: 'xs' | 'sm' | 'md';
  label?: string;
  showValue?: boolean;
  animate?: boolean;
  className?: string;
}

const trackColors: Record<ProgressColor, string> = {
  indigo:  'bg-indigo-500/10',
  violet:  'bg-violet-500/10',
  gold:    'bg-gold-500/10',
  cyan:    'bg-cyan-500/10',
  success: 'bg-success/10',
  danger:  'bg-danger/10',
};

const fillGradients: Record<ProgressColor, string> = {
  indigo:  'from-indigo-600 to-indigo-400',
  violet:  'from-violet-500 to-violet-400',
  gold:    'from-gold-500 to-gold-400',
  cyan:    'from-cyan-500 to-cyan-400',
  success: 'from-success to-emerald-400',
  danger:  'from-danger to-red-400',
};

const sizeClasses = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'indigo',
  size = 'md',
  label,
  showValue = false,
  animate = true,
  className,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-white/50 font-medium">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono font-semibold text-white/70">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className={clsx('w-full rounded-full overflow-hidden', sizeClasses[size], trackColors[color])}>
        {animate ? (
          <motion.div
            className={clsx('h-full rounded-full bg-gradient-to-r', fillGradients[color])}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <div
            className={clsx('h-full rounded-full bg-gradient-to-r', fillGradients[color])}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
};
