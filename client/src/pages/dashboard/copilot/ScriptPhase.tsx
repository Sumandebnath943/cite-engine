import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { ScriptResult } from '@/store/copilotStore';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const G = '#F59E0B';

const LOADING_MSGS = [
  'Analyzing emotional subtext...', 'Identifying core interests vs positions...',
  'Calibrating tone to your parameters...', 'Scripting opening statement...',
  'Anticipating counterarguments...', 'Preparing nuclear option fallback...',
  'Script ready. Entering briefing mode.',
];

export const ScriptLoading: React.FC = () => {
  const [idx, setIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(5);
  const ref = React.useRef(5);

  React.useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % LOADING_MSGS.length), 2500); return () => clearInterval(t); }, []);
  React.useEffect(() => { const t = setInterval(() => { if (ref.current < 88) { ref.current = Math.min(ref.current + Math.random() * 4 + 1, 88); setProgress(ref.current); } }, 800); return () => clearInterval(t); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 28 }}>
      <div style={{ position: 'relative', width: 110, height: 110 }}>
        <style>{`@keyframes goldRing{to{transform:rotate(360deg)}}`}</style>
        <svg width="110" height="110" style={{ position: 'absolute', inset: 0, animation: 'goldRing 1.5s linear infinite' }}>
          <defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D97706" /><stop offset="100%" stopColor="#F59E0B" /></linearGradient></defs>
          <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          <circle cx="55" cy="55" r="48" fill="none" stroke="url(#goldGrad)" strokeWidth="5" strokeDasharray="90 212" strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: '#fff' }}>CITE</span>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.p key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 8 }}>
            {LOADING_MSGS[idx]}
          </motion.p>
        </AnimatePresence>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>GPT-4o is scripting your conversation. This takes 15–25 seconds.</p>
      </div>
      <div style={{ width: 380, maxWidth: '90%' }}>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#D97706,#F59E0B)', borderRadius: 999, transition: 'width 0.8s ease' }} />
        </div>
      </div>
    </div>
  );
};

// ── Copy button ────────────────────────────────────────────────────
const CopyBtn: React.FC<{ text: string; id: string }> = ({ text, id }) => {
  const { copy, copiedId } = useCopyToClipboard();
  return (
    <button onClick={() => copy(text, id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === id ? '#10B981' : 'rgba(255,255,255,0.3)', display: 'flex', padding: 3 }}>
      {copiedId === id ? <CheckCircle2 size={13} /> : <Copy size={13} />}
    </button>
  );
};

export const ScriptPhase: React.FC<{
  result: ScriptResult;
  onStartRoleplay: () => void;
  onNew: () => void;
}> = ({ result, onStartRoleplay, onNew }) => {
  const [nuclearOpen, setNuclearOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const { copy } = useCopyToClipboard();

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: G, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 999, padding: '4px 12px' }}>SCRIPT READY</span>
          <h2 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 30, color: '#fff', letterSpacing: '-0.025em', margin: 0 }}>Your Conversation Brief</h2>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 999, padding: '4px 12px' }}>CONFIDENCE: {result.confidenceScore}%</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onNew} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>New Scenario</button>
          <button onClick={onStartRoleplay} style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: '#000' }}>Start Roleplay →</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20 }}>
        {/* LEFT — Script */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Scenario summary */}
          <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#FCD34D', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Objective</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>{result.scenarioSummary}</p>
          </div>

          {/* Opening */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${G}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#FCD34D', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Open With This</p>
              <CopyBtn text={result.openingStatement} id="opening" />
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 17, color: '#fff', lineHeight: 1.6, margin: '0 0 10px' }}>"{result.openingStatement}"</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0 }}>Say this word for word. Do not improvise the opening.</p>
          </div>

          {/* Core script beats */}
          {result.coreScript.map((beat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: G, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 999, padding: '2px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{beat.beat}</span>
                <CopyBtn text={beat.yourLine} id={`beat-${i}`} />
              </div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#fff', lineHeight: 1.6, margin: '10px 0 8px' }}>{beat.yourLine}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}><span style={{ color: 'rgba(255,255,255,0.25)' }}>Why this works:</span> {beat.purpose}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0 }}>{beat.toneNote}</p>
            </motion.div>
          ))}

          {/* Closing */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #22D3EE', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Close With This</p>
              <CopyBtn text={result.closingStatement} id="closing" />
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', lineHeight: 1.6, margin: 0 }}>"{result.closingStatement}"</p>
          </div>

          {/* Nuclear option */}
          <div style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, overflow: 'hidden' }}>
            <button onClick={() => setNuclearOpen((o) => !o)} style={{ width: '100%', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#EF4444' }}>☢️ Nuclear Option — Last Resort</span>
              {nuclearOpen ? <ChevronUp size={16} color="#EF4444" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
            </button>
            <AnimatePresence>
              {nuclearOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '0 20px 16px' }}>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#fff', lineHeight: 1.6, marginBottom: 8 }}>{result.nuclearOption}</p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#FCA5A5', fontStyle: 'italic', margin: 0 }}>Use only if all other approaches fail. This ends the negotiation.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Risks */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Watch For These</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.emotionalRisks.map((r) => (
                <span key={r} style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#FCA5A5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', display: 'block' }}>⚠ {r}</span>
              ))}
            </div>
          </div>

          {/* Objections */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 18 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Anticipated Objections</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.anticipatedObjections.map((obj, i) => (
                <div key={i} style={{ background: '#0D1220', borderRadius: 10, padding: 14 }}>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>They Will Say:</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: 10 }}>{obj.objection}</p>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#A78BFA', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Your Response:</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#fff', marginBottom: 8 }}>{obj.counterResponse}</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{obj.psychologyNote}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email version */}
          {result.emailVersion && (
            <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden' }}>
              <button onClick={() => setEmailOpen((o) => !o)} style={{ width: '100%', padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>📧 Email Version Ready</span>
                {emailOpen ? <ChevronUp size={14} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={14} color="rgba(255,255,255,0.3)" />}
              </button>
              <AnimatePresence>
                {emailOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 18px 14px' }}>
                      <div style={{ background: '#080B14', borderRadius: 8, padding: 14, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>{result.emailVersion}</div>
                      <button onClick={() => copy(result.emailVersion, 'email')} style={{ marginTop: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Copy Email</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Tone analysis */}
          <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.15)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{result.toneAnalysis}</p>
          </div>
        </div>
      </div>

      {/* Start roleplay CTA */}
      <button onClick={onStartRoleplay} style={{ width: '100%', height: 56, marginTop: 24, background: 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 16, color: '#000', boxShadow: '0 8px 32px rgba(217,119,6,0.3)', transition: 'all 0.2s' }}>
        🎯 Practice This Conversation Live Against AI →
      </button>
    </div>
  );
};
