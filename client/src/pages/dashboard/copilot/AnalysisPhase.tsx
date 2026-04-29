import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '@/store/copilotStore';

const G = '#F59E0B';

// Animated arc gauge
const ArcGauge: React.FC<{ score: number; color: string; label: string; size?: number }> = ({ score, color, label, size = 80 }) => {
  const [current, setCurrent] = useState(0);
  const r = size * 0.38;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (current / 100) * circumference * 0.75;

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1500, 1);
      setCurrent(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(135deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size * 0.07} strokeDasharray={circumference * 0.75} strokeLinecap="round" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={size * 0.07} strokeDasharray={circumference * 0.75} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: 'none' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: size * 0.22, color: '#fff' }}>{current}</span>
        </div>
      </div>
      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{label}</span>
    </div>
  );
};

export const AnalysisPhase: React.FC<{
  result: AnalysisResult;
  onPracticeAgain: () => void;
  onEditScript: () => void;
  onDone: () => void;
}> = ({ result, onPracticeAgain, onEditScript, onDone }) => (
  <div>
    {/* Header */}
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: G, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Session Debrief</p>
      <h2 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '-0.025em', margin: 0 }}>Conversation Analysis Complete</h2>
    </div>

    {/* Score cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {[
        { score: result.overallScore, color: G, label: 'Overall Score', size: 100 },
        { score: result.emotionalIntelligenceScore, color: '#7C3AED', label: 'Emotional IQ', size: 80 },
        { score: result.persuasionScore, color: '#22D3EE', label: 'Persuasion', size: 80 },
        { score: result.clarityScore, color: '#10B981', label: 'Clarity', size: 80 },
      ].map((c) => (
        <div key={c.label} style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <ArcGauge score={c.score} color={c.color} label={c.label} size={c.size} />
        </div>
      ))}
    </div>

    {/* Objective banner */}
    <div style={{ background: result.objectiveAchieved ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${result.objectiveAchieved ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 18 }}>{result.objectiveAchieved ? '✅' : '❌'}</span>
      <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 15, color: result.objectiveAchieved ? '#10B981' : '#FCA5A5', margin: 0 }}>
        {result.objectiveAchieved ? 'Objective Achieved — You successfully navigated the conversation' : 'Objective Not Achieved — Review the analysis below'}
      </p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
      {/* Strengths */}
      <div style={{ background: '#0D1220', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 14, padding: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>✓ Strengths</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.strengths.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#10B981', fontSize: 14, flexShrink: 0 }}>✓</span>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#fff', lineHeight: 1.5, margin: 0 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Improvements */}
      <div style={{ background: '#0D1220', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#EF4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>⟳ Improvements</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {result.improvements.map((imp, i) => (
            <div key={i} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: 12 }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 4 }}>{imp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Key Moments */}
    {result.keyMoments?.length > 0 && (
      <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Key Moments</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {result.keyMoments.map((km, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: 20, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: G, flexShrink: 0 }} />
                {i < result.keyMoments.length - 1 && <div style={{ flex: 1, width: 2, background: 'rgba(245,158,11,0.2)', marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: i < result.keyMoments.length - 1 ? 0 : 0 }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: 6 }}>"{km.userMessage}"</p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6, lineHeight: 1.5 }}>{km.analysis}</p>
                {km.betterAlternative && (
                  <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '8px 12px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Try instead: </span>
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#A78BFA' }}>{km.betterAlternative}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Final verdict */}
    <div style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(245,158,11,0.04))', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 14, padding: 24, marginBottom: 24 }}>
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Final Verdict</p>
      <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 17, color: '#fff', lineHeight: 1.6, margin: 0 }}>{result.finalVerdict}</p>
    </div>

    {/* Actions */}
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={onPracticeAgain} style={{ flex: 1, height: 48, background: 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#000' }}>🔄 Practice Again</button>
      <button onClick={onEditScript} style={{ flex: 1, height: 48, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>📝 Edit Script</button>
      <button onClick={onDone} style={{ flex: 1, height: 48, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#10B981' }}>✅ I'm Ready</button>
    </div>
  </div>
);

// Loading state for analysis
export const AnalysisLoading: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 20 }}>
    <style>{`@keyframes goldSpin{to{transform:rotate(360deg)}}`}</style>
    <div style={{ width: 44, height: 44, border: `3px solid rgba(245,158,11,0.2)`, borderTop: `3px solid ${G}`, borderRadius: '50%', animation: 'goldSpin 1s linear infinite' }} />
    <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff' }}>Analyzing your performance...</p>
    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>GPT-4o is reviewing the full conversation</p>
  </div>
);
