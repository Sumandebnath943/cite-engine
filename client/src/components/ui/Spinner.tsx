import React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'violet' | 'gold' | 'cyan' | 'white';
  className?: string;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const strokeMap = {
  xs: 2,
  sm: 2,
  md: 2.5,
  lg: 3,
};

const colorMap = {
  indigo: '#6366F1',
  violet: '#A78BFA',
  gold:   '#FCD34D',
  cyan:   '#22D3EE',
  white:  'rgba(255,255,255,0.8)',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'indigo',
  className,
}) => {
  const stroke = strokeMap[size];
  const c = colorMap[color];

  return (
    <svg
      className={clsx('animate-spin', sizeMap[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={stroke}
        className="opacity-20"
        style={{ color: c }}
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={c}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  );
};
