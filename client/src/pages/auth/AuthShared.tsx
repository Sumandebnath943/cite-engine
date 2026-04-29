import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CITELogo } from '@/components/ui/CITELogo';

// ── Perspective Grid (reused from hero) ───────────────────────────
export const AuthPerspectiveGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
    <svg
      width="100%" height="100%"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <style>{`
          @keyframes authGridDrift {
            0%   { transform: translateY(0); }
            100% { transform: translateY(60px); }
          }
          .auth-grid { animation: authGridDrift 8s linear infinite; }
        `}</style>
      </defs>
      <g className="auth-grid">
        {Array.from({ length: 16 }).map((_, i) => {
          const t = i / 15;
          const y = 900 - t * t * 900;
          const spread = (1 - t) * 720 + 60;
          return (
            <line key={`h-${i}`}
              x1={720 - spread} y1={y} x2={720 + spread} y2={y}
              stroke="rgba(99,102,241,0.07)" strokeWidth={0.5 + t * 0.4}
            />
          );
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const t = i / 13;
          return (
            <line key={`v-${i}`}
              x1={720 + (t - 0.5) * 140} y1={0}
              x2={720 + (t - 0.5) * 1440} y2={900}
              stroke="rgba(99,102,241,0.06)" strokeWidth={0.4}
            />
          );
        })}
      </g>
    </svg>
  </div>
);

// ── Radial Orbs ───────────────────────────────────────────────────
export const AuthOrbs: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
    <style>{`
      @keyframes authOrbA { 0%{transform:translate(0,0)} 100%{transform:translate(18px,-14px)} }
      @keyframes authOrbB { 0%{transform:translate(0,0)} 100%{transform:translate(-16px,12px)} }
    `}</style>
    <div style={{
      position: 'absolute', top: -80, left: -60,
      width: 500, height: 500,
      background: 'rgba(124,58,237,0.10)',
      borderRadius: '50%', filter: 'blur(120px)',
      animation: 'authOrbA 16s ease-in-out infinite alternate',
    }} />
    <div style={{
      position: 'absolute', bottom: -80, right: -60,
      width: 400, height: 400,
      background: 'rgba(8,145,178,0.07)',
      borderRadius: '50%', filter: 'blur(100px)',
      animation: 'authOrbB 20s ease-in-out infinite alternate',
    }} />
  </div>
);

// ── Engine Status Indicator ───────────────────────────────────────
const engines = [
  { dot: '#7C3AED', name: 'CAREER PIVOT ENGINE' },
  { dot: '#F59E0B', name: 'CONVERSATION COPILOT' },
  { dot: '#22D3EE', name: 'JOB RADAR' },
];

// ── Left Brand Panel ──────────────────────────────────────────────
export const BrandPanel: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    style={{
      width: '45%',
      minWidth: 340,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px 48px',
      background: 'linear-gradient(160deg, rgba(124,58,237,0.06) 0%, rgba(8,145,178,0.04) 100%)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 10,
    }}
  >
    {/* Top — Logo */}
    <div style={{ marginBottom: 8 }}>
      <CITELogo size="lg" showWordmark={true} animated={true} />
      <p style={{
        fontFamily: 'Inter,sans-serif', fontSize: 13,
        color: 'rgba(255,255,255,0.35)', marginTop: 8,
      }}>
        Cognitive &amp; Interpersonal Translation Engine
      </p>
    </div>

    {/* Middle — Quote */}
    <div style={{ maxWidth: 360 }}>
      <div style={{
        fontFamily: 'Inter,sans-serif', fontWeight: 900,
        fontSize: 120, lineHeight: 1, marginBottom: -24,
        color: 'rgba(99,102,241,0.15)',
        userSelect: 'none',
      }}>"</div>
      <blockquote style={{
        fontFamily: 'Inter,sans-serif', fontWeight: 600,
        fontSize: 22, color: 'rgba(255,255,255,0.85)',
        lineHeight: 1.5, margin: 0,
      }}>
        The professionals who survive the next decade won't be the most skilled.
        They'll be the ones who knew what was coming — and prepared.
      </blockquote>
      <p style={{
        fontFamily: 'JetBrains Mono,monospace', fontSize: 12,
        color: 'rgba(255,255,255,0.3)', marginTop: 20,
        letterSpacing: '0.04em',
      }}>
        — CITE Intelligence Brief, 2025
      </p>
    </div>

    {/* Bottom — Engine Status */}
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {engines.map((e) => (
          <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <style>{`
              @keyframes statusPulse-${e.name.replace(/\s/g,'')} {
                0%,100%{transform:scale(1)} 50%{transform:scale(1.45)}
              }
            `}</style>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: e.dot,
              boxShadow: `0 0 6px ${e.dot}80`,
              animation: `statusPulse-${e.name.replace(/\s/g,'')} 2s ease-in-out infinite`,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11,
              color: 'rgba(255,255,255,0.5)', flex: 1,
              letterSpacing: '0.06em',
            }}>
              {e.name}
            </span>
            <div style={{
              padding: '2px 8px', borderRadius: 999,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
              color: '#10B981', letterSpacing: '0.08em',
            }}>
              OPERATIONAL
            </div>
          </div>
        ))}
      </div>
      <p style={{
        fontFamily: 'Inter,sans-serif', fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
      }}>
        All systems nominal · Last verified just now
      </p>
    </div>
  </motion.div>
);

// ── Floating Label Input ──────────────────────────────────────────
interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id, label, type = 'text', value, onChange, icon, rightSlot, error, autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const isFloated = focused || value.length > 0;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        {/* Left icon */}
        <div style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center',
          color: focused ? '#6366F1' : 'rgba(255,255,255,0.3)',
          transition: 'color 0.2s ease',
          pointerEvents: 'none', zIndex: 2,
        }}>
          {icon}
        </div>

        {/* Floating label */}
        <label
          htmlFor={id}
          style={{
            position: 'absolute',
            left: 44,
            top: isFloated ? 8 : '50%',
            transform: isFloated ? 'translateY(0) scale(0.82)' : 'translateY(-50%)',
            transformOrigin: 'left center',
            fontFamily: 'Inter,sans-serif',
            fontSize: 15,
            color: focused
              ? '#6366F1'
              : isFloated
              ? 'rgba(255,255,255,0.4)'
              : 'rgba(255,255,255,0.35)',
            pointerEvents: 'none',
            transition: 'all 0.18s ease',
            zIndex: 2,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </label>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: 56,
            paddingLeft: 44,
            paddingRight: rightSlot ? 44 : 16,
            paddingTop: isFloated ? 18 : 0,
            background: error ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${
              error
                ? 'rgba(239,68,68,0.5)'
                : focused
                ? 'rgba(99,102,241,0.6)'
                : 'rgba(255,255,255,0.08)'
            }`,
            borderRadius: 10,
            outline: 'none',
            boxShadow: error
              ? focused ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none'
              : focused
              ? '0 0 0 3px rgba(99,102,241,0.12)'
              : 'none',
            color: '#fff',
            fontFamily: 'Inter,sans-serif',
            fontSize: 15,
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
          }}
        />

        {/* Right slot */}
        {rightSlot && (
          <div style={{
            position: 'absolute', right: 14, top: '50%',
            transform: 'translateY(-50%)', display: 'flex', zIndex: 2,
          }}>
            {rightSlot}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: 'Inter,sans-serif', fontSize: 12,
            color: '#FCA5A5', marginTop: 5, display: 'flex',
            alignItems: 'center', gap: 4,
          }}
        >
          <span style={{ fontSize: 11 }}>⊘</span> {error}
        </motion.p>
      )}
    </div>
  );
};
