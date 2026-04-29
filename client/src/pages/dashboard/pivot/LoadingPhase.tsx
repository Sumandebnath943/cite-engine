import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_MESSAGES = [
  'Parsing professional identity...',
  'Analyzing industry dialect patterns...',
  'Identifying hidden transferable skills...',
  'Rewriting experience in target language...',
  'Calibrating confidence score...',
  'Generating learning pathway...',
  'Finalizing intelligence report...',
];

const CHIPS = [
  '🔍 Scanning 847 industry terms',
  '📊 Cross-referencing 12,400 job descriptions',
  '🧠 Identifying transferable skill patterns',
];

export const LoadingPhase: React.FC = () => {
  const [statusIdx, setStatusIdx] = useState(0);
  const [progress, setProgress] = useState(5);
  const [visibleChips, setVisibleChips] = useState<number[]>([]);
  const progressRef = useRef(5);

  // Cycle status messages
  useEffect(() => {
    const t = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length), 2500);
    return () => clearInterval(t);
  }, []);

  // Progress bar crawl
  useEffect(() => {
    const t = setInterval(() => {
      if (progressRef.current < 88) {
        const inc = Math.random() * 4 + 1;
        progressRef.current = Math.min(progressRef.current + inc, 88);
        setProgress(progressRef.current);
      }
    }, 800);
    return () => clearInterval(t);
  }, []);

  // Staggered chip reveal
  useEffect(() => {
    CHIPS.forEach((_, i) => {
      setTimeout(() => setVisibleChips((c) => [...c, i]), (i + 1) * 1000);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 32 }}>

      {/* Spinning ring */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <style>{`
          @keyframes ringRotate { to { transform: rotate(360deg); } }
        `}</style>
        <svg width="120" height="120" style={{ position: 'absolute', inset: 0, animation: 'ringRotate 1.5s linear infinite' }}>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" strokeWidth="6"
            strokeDasharray="100 226" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>CITE</span>
        </div>
      </div>

      {/* Status text */}
      <div style={{ textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 10 }}
          >
            {STATUS_MESSAGES[statusIdx]}
          </motion.p>
        </AnimatePresence>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
          GPT-4o is translating your professional identity. This takes 15–30 seconds.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: 400, maxWidth: '90%' }}>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7C3AED,#22D3EE)', borderRadius: 999, transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Stat chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
        {CHIPS.map((chip, i) => (
          <AnimatePresence key={chip}>
            {visibleChips.includes(i) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999, padding: '8px 16px',
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.6)',
                }}
              >
                {chip}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};
