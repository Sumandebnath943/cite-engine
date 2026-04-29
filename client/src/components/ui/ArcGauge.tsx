import React, { useEffect, useRef, useState } from 'react';

interface ArcGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
  sublabel?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  return '#EF4444';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'HIGH SECURITY';
  if (score >= 60) return 'MODERATE RISK';
  if (score >= 40) return 'ELEVATED RISK';
  return 'CRITICAL RISK';
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  color,
  showLabel,
  sublabel,
}) => {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 1400;

  useEffect(() => {
    // Cancel any previous animation
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startRef.current = null;
    setDisplayed(0);

    const target = Math.max(0, Math.min(100, score));
    if (target === 0) return;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplayed(Math.round(target * eased));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Animation complete — set final value and STOP
        setDisplayed(target);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [score]); // Only re-runs when score changes

  // SVG arc geometry
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth * 2) / 2;
  const SWEEP = 270;
  const START_ANGLE = 135;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number) => {
    const s = polarToCartesian(startAngle);
    const e = polarToCartesian(endAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
  };

  // Use strokeDasharray — purely driven by displayed state, no CSS animation
  const arcLength = 2 * Math.PI * r * (SWEEP / 360);
  const fillLength = (displayed / 100) * arcLength;
  const gapLength = arcLength - fillLength;

  const trackPath = describeArc(START_ANGLE, START_ANGLE + SWEEP);

  // Colors use final score (static), not displayed (animated)
  const fillColor = color ?? getScoreColor(score);
  const labelColor = color ?? getScoreColor(score);
  const displayLabel = sublabel ?? getScoreLabel(score);
  const gradId = `arcGrad_${size}_${Math.round(score)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891B2" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>

          {/* Background track — static */}
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled arc — state-driven, no CSS keyframes */}
          {displayed > 0 && (
            <path
              d={trackPath}
              fill="none"
              stroke={color ? fillColor : `url(#${gradId})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${fillLength} ${gapLength}`}
            />
          )}
        </svg>

        {/* Score number — centered overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 900,
            fontSize: size * 0.24,
            color: 'var(--text-primary, #fff)',
            lineHeight: 1,
          }}>
            {displayed}
          </span>
          {showLabel && (
            /* Completely static text — no animation, no keyframes */
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              fontSize: Math.max(size * 0.07, 8),
              color: labelColor,
              letterSpacing: '0.05em',
              textAlign: 'center',
              marginTop: 3,
              display: 'block',
            }}>
              {displayLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArcGauge;
