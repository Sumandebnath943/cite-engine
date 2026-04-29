import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// ── Animated Perspective Grid ─────────────────────────────────────
const PerspectiveGrid: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <style>{`
          @keyframes gridDrift {
            0%   { transform: translateY(0); }
            100% { transform: translateY(60px); }
          }
          .grid-lines {
            animation: gridDrift 8s linear infinite;
          }
        `}</style>
      </defs>
      <g className="grid-lines" opacity="1">
        {/* Horizontal perspective lines converging to center-bottom vanishing point */}
        {Array.from({ length: 18 }).map((_, i) => {
          const t = i / 17;
          const y = 900 - t * t * 900;
          const spread = (1 - t) * 720 + 60;
          return (
            <line
              key={`h-${i}`}
              x1={720 - spread}
              y1={y}
              x2={720 + spread}
              y2={y}
              stroke="rgba(99,102,241,0.09)"
              strokeWidth={0.6 + t * 0.5}
            />
          );
        })}
        {/* Vertical lines converging to vanishing point */}
        {Array.from({ length: 16 }).map((_, i) => {
          const t = i / 15;
          const xTop = 720 + (t - 0.5) * 160;
          const xBot = 720 + (t - 0.5) * 1440;
          return (
            <line
              key={`v-${i}`}
              x1={xTop}
              y1={0}
              x2={xBot}
              y2={900}
              stroke="rgba(99,102,241,0.07)"
              strokeWidth={0.5}
            />
          );
        })}
      </g>
    </svg>
  </div>
);

// ── Floating Orbs ─────────────────────────────────────────────────
const Orbs: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
    <style>{`
      @keyframes floatA {
        0%   { transform: translate(0,0); }
        100% { transform: translate(20px, -15px); }
      }
      @keyframes floatB {
        0%   { transform: translate(0,0); }
        100% { transform: translate(-18px, 12px); }
      }
      @keyframes floatC {
        0%   { transform: translate(0,0); }
        100% { transform: translate(14px, -10px); }
      }
    `}</style>
    <div style={{
      position: 'absolute', top: '-80px', left: '-60px',
      width: 600, height: 600,
      background: 'rgba(124,58,237,0.12)',
      borderRadius: '50%', filter: 'blur(120px)',
      animation: 'floatA 14s ease-in-out infinite alternate',
    }} />
    <div style={{
      position: 'absolute', top: '-40px', right: '-60px',
      width: 400, height: 400,
      background: 'rgba(8,145,178,0.08)',
      borderRadius: '50%', filter: 'blur(100px)',
      animation: 'floatB 18s ease-in-out infinite alternate',
    }} />
    <div style={{
      position: 'absolute', bottom: '-100px', left: '50%', transform: 'translateX(-50%)',
      width: 500, height: 500,
      background: 'rgba(99,102,241,0.07)',
      borderRadius: '50%', filter: 'blur(140px)',
      animation: 'floatC 12s ease-in-out infinite alternate',
    }} />
  </div>
);

// ── Animated Counter ──────────────────────────────────────────────
const Counter: React.FC<{ target: number; suffix?: string; duration?: number }> = ({
  target, suffix = '', duration = 2000,
}) => {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{val.toLocaleString()}{suffix}</>;
};

// ── Animated Progress Bar ─────────────────────────────────────────
const AnimatedBar: React.FC<{ to: number; delay?: number }> = ({ to, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const dur = 2500;
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setWidth(e * to);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [to, delay]);
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: 'linear-gradient(90deg,#7C3AED,#6366F1)',
        borderRadius: 99, transition: 'none',
      }} />
    </div>
  );
};

// ── Gauge SVG ─────────────────────────────────────────────────────
const MiniGauge: React.FC<{ score: number; size: number }> = ({ score, size }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const arc = (240 / 360) * circ;
  const fill = (score / 100) * arc;
  const gradId = 'heroGaugeGrad';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(150deg)', flexShrink: 0 }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={6} strokeLinecap="round"
        strokeDasharray={`${arc} ${circ - arc}`} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={`url(#${gradId})`} strokeWidth={6} strokeLinecap="round"
        strokeDasharray={`${fill} ${circ - fill}`} />
    </svg>
  );
};

// ── Product Preview Card ──────────────────────────────────────────
const ProductCard: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ perspective: 1000 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 3D tilt wrapper */}
      <motion.div
        animate={{
          rotateY: hovered ? -4 : -8,
          rotateX: hovered ? 1 : 3,
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
          borderRadius: 20,
          overflow: 'visible',
          position: 'relative',
          width: '100%',
          maxWidth: 480,
        }}
      >
        {/* Toast notification — top right */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute', top: -14, right: -12,
            background: '#161F35',
            border: '1px solid rgba(10,200,150,0.35)',
            borderRadius: 10, padding: '8px 12px',
            display: 'flex', alignItems: 'center', gap: 7,
            zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.7)', flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#fff', lineHeight: 1.3 }}>Radar scan complete</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>Just now</p>
          </div>
        </motion.div>

        {/* Insights badge — bottom left */}
        <div style={{
          position: 'absolute', bottom: -10, left: -10,
          background: 'rgba(124,58,237,0.92)',
          borderRadius: 8, padding: '6px 10px',
          fontFamily: 'Inter,sans-serif', fontWeight: 600,
          fontSize: 11, color: '#fff',
          zIndex: 10, boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
          backdropFilter: 'blur(8px)',
        }}>
          ⚡ 3 insights ready
        </div>

        {/* Card */}
        <div style={{ borderRadius: 20, overflow: 'hidden', background: '#111827' }}>
          {/* Title bar */}
          <div style={{
            height: 36, background: '#0D1220',
            display: 'flex', alignItems: 'center',
            padding: '0 14px', gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            {[['#EF4444',0],['#F59E0B',1],['#10B981',2]].map(([c]) => (
              <div key={String(c)} style={{ width: 10, height: 10, borderRadius: '50%', background: String(c), opacity: 0.7 }} />
            ))}
            <span style={{ marginLeft: 8, fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              cite — command center
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Section A — Job Security Score */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                <MiniGauge score={74} size={72} />
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  paddingTop: 4,
                }}>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1 }}>74</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Job Security Score
                </p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: '#F59E0B', marginBottom: 6 }}>
                  Moderate Risk
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#EF4444', marginTop: 3, flexShrink: 0 }} />
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                    CEO used 'optimization' 3× this quarter
                  </p>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 14 }} />

            {/* Section B — Career Translation */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#A78BFA', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Engine A · Active
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '6px 8px' }}>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', lineHeight: 1.5 }}>
                    Managed classroom of 28 students...
                  </p>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, paddingTop: 6, flexShrink: 0 }}>→</div>
                <div style={{ flex: 1, background: 'rgba(124,58,237,0.12)', borderRadius: 6, padding: '6px 8px', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#A78BFA', lineHeight: 1.5 }}>
                    Led cross-functional L&D program...
                  </p>
                </div>
              </div>
              <AnimatedBar to={85} delay={600} />
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 14 }} />

            {/* Section C — Conversation Copilot */}
            <div>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#FCD34D', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                Engine B · Script Ready
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                {/* User bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'rgba(99,102,241,0.2)', borderRadius: '10px 10px 2px 10px',
                    padding: '6px 10px', maxWidth: '80%',
                    fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#fff', lineHeight: 1.5,
                  }}>
                    My market rate is 38% above current comp...
                  </div>
                </div>
                {/* AI bubble */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)', borderRadius: '10px 10px 10px 2px',
                    padding: '6px 10px', maxWidth: '80%',
                    fontFamily: 'Inter,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5,
                  }}>
                    Budget constraints apply to everyone...
                  </div>
                </div>
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.3)',
                borderRadius: 999, padding: '4px 12px',
                fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 10, color: '#FCD34D',
              }}>
                Continue Roleplay →
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Stat Counters ─────────────────────────────────────────────────
const stats = [
  { target: 12400, suffix: '+', label: 'Careers Translated' },
  { target: 8900,  suffix: '+', label: 'Scripts Generated' },
  { target: 31200, suffix: '+', label: 'Threat Scans Run' },
];

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.3 + i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
};

const chips = [
  { icon: '🔒', label: 'End-to-End Encrypted' },
  { icon: '⚡', label: 'Real-Time Intelligence' },
  { icon: '🧠', label: 'Claude AI Powered' },
];

// ── Main Hero ─────────────────────────────────────────────────────
export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <PerspectiveGrid />
      <Orbs />

      {/* Content */}
      <div
        className="relative w-full"
        style={{
          zIndex: 10,
          paddingTop: 80,
          paddingBottom: 60,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            flexWrap: 'wrap' as const,
          }}
        >
          {/* ── LEFT COLUMN ── */}
          <div style={{ flex: '0 0 52%', minWidth: 300 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 999,
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.3)',
                fontFamily: 'JetBrains Mono,monospace', fontSize: 12,
                color: '#A78BFA', letterSpacing: '0.05em',
                marginBottom: 28,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', boxShadow: '0 0 6px rgba(124,58,237,0.8)', display: 'inline-block' }} />
              Intelligence Engine · v1.0
            </motion.div>

            {/* Headline */}
            <div style={{ marginBottom: 24 }}>
              {[
                { text: 'Your Career.', style: { color: '#ffffff' } },
                {
                  text: 'Decoded.',
                  style: {
                    background: 'linear-gradient(135deg,#7C3AED 0%,#22D3EE 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  },
                },
                { text: 'Defended.', style: { color: 'rgba(255,255,255,0.35)' } },
              ].map((line, i) => (
                <motion.h1
                  key={i} custom={i} variants={lineVariants} initial="hidden" animate="visible"
                  style={{
                    fontFamily: 'Inter,sans-serif', fontWeight: 900,
                    fontSize: 'clamp(40px,6vw,84px)',
                    letterSpacing: '-0.035em', lineHeight: 1.05,
                    margin: 0, ...line.style,
                  }}
                >
                  {line.text}
                </motion.h1>
              ))}
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: 'Inter,sans-serif', fontSize: 17, lineHeight: 1.7,
                color: 'rgba(255,255,255,0.55)', maxWidth: 520, marginBottom: 28,
              }}
            >
              CITE is a three-engine AI system that translates your professional identity,
              scripts your most difficult conversations, and monitors your job security — before you need it.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}
            >
              <Link to="/auth/signup">
                <motion.button
                  whileHover={{ boxShadow: '0 0 36px rgba(99,102,241,0.5)', scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    height: 52, paddingLeft: 28, paddingRight: 28,
                    background: '#6366F1', color: '#fff', border: 'none',
                    borderRadius: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600,
                    fontSize: 15, cursor: 'pointer', letterSpacing: '-0.01em',
                  }}
                >
                  Activate Your Engine
                </motion.button>
              </Link>
              <a href="#how-it-works">
                <motion.button
                  whileHover={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    height: 52, paddingLeft: 28, paddingRight: 28,
                    background: 'transparent', color: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 10, fontFamily: 'Inter,sans-serif', fontWeight: 500,
                    fontSize: 15, cursor: 'pointer',
                  }}
                >
                  See How It Works
                </motion.button>
              </a>
            </motion.div>

            {/* Social proof chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}
            >
              {chips.map((c) => (
                <div key={c.label} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)',
                }}>
                  {c.icon} {c.label}
                </div>
              ))}
            </motion.div>

            {/* Stat counters */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              style={{ display: 'flex', alignItems: 'center', gap: 0 }}
            >
              {stats.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && (
                    <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)', margin: '0 20px', flexShrink: 0 }} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{
                      fontFamily: 'Inter,sans-serif', fontWeight: 900,
                      fontSize: 22, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1,
                    }}>
                      <Counter target={s.target} suffix={s.suffix} duration={2000} />
                    </span>
                    <span style={{
                      fontFamily: 'Inter,sans-serif', fontSize: 12,
                      color: 'rgba(255,255,255,0.4)', lineHeight: 1,
                    }}>
                      {s.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ flex: '0 0 calc(48% - 48px)', minWidth: 300, display: 'flex', justifyContent: 'center' }}>
            <ProductCard />
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-inner { flex-direction: column !important; padding: 120px 24px 80px !important; }
          .hero-left  { flex: 1 1 100% !important; text-align: center; }
          .hero-left .chips { justify-content: center !important; }
          .hero-right { flex: 1 1 100% !important; }
        }
      `}</style>
    </section>
  );
};
