import React, { useState, useEffect } from 'react';
import { ScanResult } from '@/store/radarStore';

const PRI_COLOR: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#22D3EE' };

const DemandBar: React.FC<{ label: string; score: number; color: string; delay: number }> = ({ label, score, color, delay }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), delay); return () => clearTimeout(t); }, [score, delay]);
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 999, transition: `width 1s ease ${delay}ms` }} />
      </div>
    </div>
  );
};

export const UpskillPathway: React.FC<{ result: ScanResult; plannedSkills: string[]; onTogglePlan: (s: string) => void }> = ({ result, plannedSkills, onTogglePlan }) => {
  const sorted = [...result.upskillPathway].sort((a, b) => {
    const o: Record<string, number> = { critical: 0, high: 1, medium: 2 };
    return (o[a.priority] ?? 2) - (o[b.priority] ?? 2);
  });
  const planned = sorted.filter((s) => plannedSkills.includes(s.skill)).length;

  return (
    <div>
      {/* Completion tracker */}
      <div style={{ background: '#0D1220', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Your Survival Upskill Plan</p>
          <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{planned} of {sorted.length} skills added to plan</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: sorted.length > 0 ? `${(planned / sorted.length) * 100}%` : '0%', background: 'linear-gradient(90deg,#0891B2,#22D3EE)', borderRadius: 999, transition: 'width 0.6s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sorted.map((sk, i) => {
          const inPlan = plannedSkills.includes(sk.skill);
          return (
            <div key={i} style={{ background: '#111827', borderRadius: 14, padding: 24, borderLeft: `3px solid ${PRI_COLOR[sk.priority] || '#22D3EE'}`, position: 'relative' }}>
              {/* Add to plan button */}
              <button onClick={() => onTogglePlan(sk.skill)}
                style={{ position: 'absolute', top: 16, right: 16, background: inPlan ? 'rgba(16,185,129,0.1)' : 'rgba(34,211,238,0.08)', border: `1px solid ${inPlan ? 'rgba(16,185,129,0.3)' : 'rgba(34,211,238,0.2)'}`, borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: inPlan ? '#10B981' : '#22D3EE' }}>
                {inPlan ? '✓ In Plan' : 'Add to Plan'}
              </button>

              {/* Top badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: PRI_COLOR[sk.priority], background: `${PRI_COLOR[sk.priority]}15`, border: `1px solid ${PRI_COLOR[sk.priority]}30`, borderRadius: 999, padding: '2px 8px', textTransform: 'uppercase' }}>{sk.priority}</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#22D3EE', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 999, padding: '2px 8px' }}>⏱ {sk.timeToLearn}</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 999, padding: '2px 8px' }}>{sk.estimatedSalaryImpact}</span>
              </div>

              <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 20, color: '#fff', marginBottom: 8 }}>{sk.skill}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 16 }}>{sk.reason}</p>

              {/* Demand trajectory */}
              <div style={{ marginBottom: 14 }}>
                <DemandBar label="Current Demand" score={sk.currentDemandScore} color="#22D3EE" delay={i * 80} />
                <DemandBar label="Projected Demand" score={sk.projectedDemandScore} color="linear-gradient(90deg,#0891B2,#22D3EE)" delay={i * 80 + 150} />
              </div>

              {/* Resource */}
              <a href={sk.resourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                <span style={{ fontSize: 14 }}>📚</span>
                <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#22D3EE' }}>{sk.resource}</span>
                <span style={{ color: 'rgba(34,211,238,0.5)', fontSize: 12 }}>↗</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
