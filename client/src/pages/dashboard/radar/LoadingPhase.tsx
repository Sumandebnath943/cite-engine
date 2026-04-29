import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MSGS = [
  'Initializing threat detection protocols...',
  'Scanning employer news channels...',
  'Analyzing AI displacement vectors...',
  'Evaluating skill half-life projections...',
  'Cross-referencing industry disruption patterns...',
  'Decoding corporate euphemisms...',
  'Calculating job security score...',
  'Intelligence report ready.',
];
const CHIPS = [
  '📡 Scanning 2,400 news sources',
  '🤖 Modeling 847 AI capability vectors',
  '📊 Analyzing 31,000 job posting signals',
  '🔍 Checking corporate filing language',
];

export const RadarLoading: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(5);
  const [visibleChips, setVisibleChips] = useState<number[]>([]);
  const progressRef = useRef(5);

  useEffect(() => { const t = setInterval(() => setMsgIdx((i) => (i + 1) % MSGS.length), 2000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => { if (progressRef.current < 88) { progressRef.current = Math.min(progressRef.current + Math.random() * 3.5 + 1, 88); setProgress(progressRef.current); } }, 700); return () => clearInterval(t); }, []);
  useEffect(() => { CHIPS.forEach((_, i) => { setTimeout(() => setVisibleChips((c) => [...c, i]), (i + 1) * 800); }); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 28 }}>
      {/* Radar ring animation */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <style>{`
          @keyframes radarRot{to{transform:rotate(360deg)}}
          @keyframes radarPing{0%{transform:scale(1);opacity:0.7}100%{transform:scale(1.8);opacity:0}}
        `}</style>
        <svg width="120" height="120" style={{ position: 'absolute', inset: 0, animation: 'radarRot 1.8s linear infinite' }}>
          <defs>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891B2" /><stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
          <circle cx="60" cy="60" r="52" fill="none" stroke="url(#cyanGrad)" strokeWidth="6" strokeDasharray="85 241" strokeLinecap="round" />
        </svg>
        {/* Ping rings */}
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px solid rgba(34,211,238,0.3)', animation: 'radarPing 2s ease-out infinite' }} />
        <div style={{ position: 'absolute', inset: 10, borderRadius: '50%', border: '1px solid rgba(34,211,238,0.2)', animation: 'radarPing 2s ease-out infinite 0.5s' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: '#22D3EE' }}>CITE</span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p key={msgIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 8 }}>
            {MSGS[msgIdx]}
          </motion.p>
        </AnimatePresence>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>GPT-4o is running your full threat assessment.</p>
      </div>

      <div style={{ width: 400, maxWidth: '90%' }}>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#0891B2,#22D3EE)', borderRadius: 999, transition: 'width 0.7s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
        {CHIPS.map((chip, i) => (
          <AnimatePresence key={chip}>
            {visibleChips.includes(i) && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 999, padding: '7px 14px', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'rgba(34,211,238,0.7)' }}>
                {chip}
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
};
