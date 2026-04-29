import React, { useEffect, useRef } from 'react';

type LogoSize = 'sm' | 'md' | 'lg';

interface CITELogoProps {
  size?: LogoSize;
  showWordmark?: boolean;
  animated?: boolean;
}

const SIZE_MAP = { sm: 20, md: 28, lg: 40 };
const FONT_MAP = { sm: 14, md: 18, lg: 24 };

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const sweep = endDeg - startDeg;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
}

export const CITELogo: React.FC<CITELogoProps> = ({
  size = 'md',
  showWordmark = true,
  animated = true,
}) => {
  const outerArcRef = useRef<SVGPathElement>(null);
  const pxSize = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];

  // Outer arc: 210deg → 510deg (300deg sweep), gap at bottom-right
  const outerR = 14;
  const outerStart = 210;
  const outerEnd = 510;
  const outerPath = arcPath(16, 16, outerR, outerStart, outerEnd);

  // Inner arc: 240deg → 480deg (240deg sweep)
  const innerR = 9;
  const innerPath = arcPath(16, 16, innerR, 240, 480);

  // Tick marks at gap ends (open ends of outer arc at ~510deg = 150deg and 210deg)
  const tick1Start = polarToCartesian(16, 16, outerR - 2.5, 210);
  const tick1End   = polarToCartesian(16, 16, outerR + 2.5, 210);
  const tick2Start = polarToCartesian(16, 16, outerR - 2.5, 150);  // 510mod360=150
  const tick2End   = polarToCartesian(16, 16, outerR + 2.5, 150);

  // Stroke-dasharray animation on mount (once)
  useEffect(() => {
    if (!animated || !outerArcRef.current) return;
    const el = outerArcRef.current;
    const len = el.getTotalLength?.() ?? 73;
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    el.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
        el.style.strokeDashoffset = '0';
      });
    });
  }, [animated]);

  const gradId = `citeLogoGrad_${size}`;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size === 'lg' ? 12 : 8, userSelect: 'none' }}>
      {/* SVG Mark */}
      <div style={{ width: pxSize, height: pxSize, flexShrink: 0 }}>
        <svg
          viewBox="0 0 32 32"
          width={pxSize}
          height={pxSize}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>

          {/* Inner arc */}
          <path
            d={innerPath}
            stroke="rgba(99,102,241,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Outer arc (animated) */}
          <path
            ref={outerArcRef}
            d={outerPath}
            stroke={`url(#${gradId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Tick marks at gap ends */}
          <line
            x1={tick1Start.x} y1={tick1Start.y}
            x2={tick1End.x}   y2={tick1End.y}
            stroke="#22D3EE" strokeWidth="2" strokeLinecap="round"
          />
          <line
            x1={tick2Start.x} y1={tick2Start.y}
            x2={tick2End.x}   y2={tick2End.y}
            stroke="#22D3EE" strokeWidth="2" strokeLinecap="round"
          />

          {/* Center dot — pulsing */}
          <circle cx="16" cy="16" r="2.5" fill="#7C3AED">
            {animated && (
              <>
                <animate attributeName="r" values="2.5;4;2.5" dur="2.5s" repeatCount="indefinite" calcMode="ease" />
                <animate attributeName="opacity" values="1;0.4;1" dur="2.5s" repeatCount="indefinite" calcMode="ease" />
              </>
            )}
          </circle>
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
            fontSize: fontSize,
            color: '#fff',
            letterSpacing: '0.08em',
            lineHeight: 1,
          }}>
            CITE
          </span>
          {size === 'lg' && (
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 7,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              marginTop: 4,
            }}>
              INTELLIGENCE ENGINE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
