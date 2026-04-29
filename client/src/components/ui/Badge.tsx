import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'violet' | 'gold' | 'cyan' | 'indigo' | 'success' | 'danger' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/8 text-white/70 border border-white/10',
  violet:  'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  gold:    'bg-gold-500/15 text-gold-400 border border-gold-500/25',
  cyan:    'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
  indigo:  'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25',
  success: 'bg-success/15 text-success border border-success/25',
  danger:  'bg-danger/15 text-danger border border-danger/25',
  warning: 'bg-warning/15 text-warning border border-warning/25',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-white/50',
  violet:  'bg-violet-400',
  gold:    'bg-gold-400',
  cyan:    'bg-cyan-400',
  indigo:  'bg-indigo-400',
  success: 'bg-success',
  danger:  'bg-danger',
  warning: 'bg-warning',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium rounded-badge',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};
