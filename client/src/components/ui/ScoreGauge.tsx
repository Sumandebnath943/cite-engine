import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type GaugeColor = 'violet' | 'gold' | 'cyan' | 'indigo' | 'success' | 'danger';

interface ScoreGaugeProps {
  score: number; // 0–100
  color?: GaugeColor;
  size?: number; // diameter in px
  label?: string;
  sublabel?: string;
  className?: string;
  animate?: boolean;
}

const colorMap: Record<GaugeColor, { start: string; end: string; text: string }> = {
  violet:  { start: '#7C3AED', end: '#A78BFA', text: '#A78BFA' },
  gold:    { start: '#D97706', end: '#FCD34D', text: '#FCD34D' },
  cyan:    { start: '#0891B2', end: '#22D3EE', text: '#22D3EE' },
  indigo:  { start: '#4F46E5', end: '#818CF8', text: '#818CF8' },
  success: { start: '#059669', end: '#10B981', text: '#10B981' },
  danger:  { start: '#DC2626', end: '#EF4444', text: '#EF4444' },
};

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  color = 'cyan',
  size = 140,
  label,
  sublabel,
  className,
  animate = true,
}) => {
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Arc covers 240 degrees (from 150° to 390°)
  const arcLength = (240 / 360) * circumference;
  const gap = circumference - arcLength;
  const fillLength = (clampedScore / 100) * arcLength;
  const colors = colorMap[color];

  const gradientId = `gauge-grad-${color}-${size}`;
  const arcCounterRef = useRef<SVGTextElement>(null);

  // Animate number counter
  useEffect(() => {
    if (!animate || !arcCounterRef.current) return;
    let start = 0;
    const end = clampedScore;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      if (arcCounterRef.current) arcCounterRef.current.textContent = String(current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [clampedScore, animate]);

  return (
    <div className={clsx('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(150deg)' }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${gap}`}
            strokeLinecap="round"
          />

          {/* Fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${fillLength} ${circumference - fillLength}`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{
              strokeDasharray: `${fillLength} ${circumference - fillLength}`,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg width={size * 0.6} height={size * 0.4} style={{ position: 'absolute' }}>
            <text
              ref={arcCounterRef}
              x="50%"
              y="55%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill={colors.text}
              fontSize={size * 0.22}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight="600"
            >
              {clampedScore}
            </text>
          </svg>
        </div>
      </div>

      {label && (
        <p className="text-sm font-semibold text-white/80 text-center">{label}</p>
      )}
      {sublabel && (
        <p className="text-xs text-white/40 text-center">{sublabel}</p>
      )}
    </div>
  );
};
