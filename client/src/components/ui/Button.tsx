import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'engine-violet' | 'engine-gold' | 'engine-cyan';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-indigo-500 text-white border border-indigo-500/30',
    'hover:bg-indigo-400 hover:shadow-glow-indigo',
    'active:scale-[0.97]',
  ].join(' '),
  ghost: [
    'bg-transparent text-white/70 border border-white/10',
    'hover:text-white hover:border-white/20 hover:bg-white/[0.04]',
    'active:scale-[0.97]',
  ].join(' '),
  danger: [
    'bg-danger/10 text-danger border border-danger/30',
    'hover:bg-danger/20 hover:shadow-[0_0_0_1px_rgba(239,68,68,0.3),0_4px_16px_rgba(239,68,68,0.15)]',
    'active:scale-[0.97]',
  ].join(' '),
  'engine-violet': [
    'bg-violet-500/10 text-violet-400 border border-violet-500/30',
    'hover:bg-violet-500/20 hover:shadow-glow-violet hover:text-violet-300',
    'active:scale-[0.97]',
  ].join(' '),
  'engine-gold': [
    'bg-gold-500/10 text-gold-400 border border-gold-500/30',
    'hover:bg-gold-500/20 hover:shadow-glow-gold hover:text-gold-300',
    'active:scale-[0.97]',
  ].join(' '),
  'engine-cyan': [
    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    'hover:bg-cyan-500/20 hover:shadow-glow-cyan hover:text-cyan-300',
    'active:scale-[0.97]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-btn',
        'transition-all duration-150',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        'select-none cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  );
};
