import React, { useEffect, useState } from 'react';
import { ScanResult } from '@/store/radarStore';

const STATUS_COLOR: Record<string, string> = { growing: '#10B981', emerging: '#22D3EE', stable: '#6B7280', declining: '#EF4444' };
const STATUS_LABEL: Record<string, string> = { growing: '📈 Growing', emerging: '⚡ Emerging', stable: '→ Stable', declining: '📉 Declining' };

function halfLifeWidth(y: number): string {
  if (y < 2) return '25%';
  if (y < 3) return '50%';
  if (y < 5) return '75%';
  return '100%';
}
function halfLifeColor(y: number): string {
  if (y < 2) return '#EF4444';
  if (y < 3) return '#F59E0B';
  if (y < 5) return '#22D3EE';
  return '#10B981';
}

export const SkillAnalysis: React.FC<{ result: ScanResult }> = ({ result }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Skillset Intelligence Report</p>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#22D3EE', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 999, padding: '2px 10px' }}>{result.skillRelevanceScore}/100 overall relevance</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 28 }}>
        {result.skillAnalysis.map((sk, i) => (
          <div key={i} style={{ background: '#111827', borderRadius: 12, padding: 20, borderTop: `3px solid ${STATUS_COLOR[sk.status] || '#6B7280'}`, minHeight: 160 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', margin: 0 }}>{sk.skill}</p>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: STATUS_COLOR[sk.status], background: `${STATUS_COLOR[sk.status]}15`, border: `1px solid ${STATUS_COLOR[sk.status]}30`, borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap' }}>{STATUS_LABEL[sk.status]}</span>
            </div>

            {/* Relevance score */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 28, color: '#fff' }}>{sk.relevanceScore}</span>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>/100</span>
            </div>

            {/* Half-life bar */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Half-Life</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: halfLifeColor(sk.halfLifeYears) }}>{sk.halfLifeYears}y</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: animated ? halfLifeWidth(sk.halfLifeYears) : '0%', background: halfLifeColor(sk.halfLifeYears), borderRadius: 999, transition: `width ${0.8 + i * 0.1}s ease` }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: sk.replacementRisk === 'high' ? '#EF4444' : sk.replacementRisk === 'medium' ? '#F59E0B' : '#10B981', background: 'rgba(255,255,255,0.05)', borderRadius: 999, padding: '2px 7px', textTransform: 'uppercase' }}>
                {sk.replacementRisk} AI risk
              </span>
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', margin: '8px 0 0', lineHeight: 1.4 }}>{sk.note}</p>
          </div>
        ))}
      </div>

      {/* Half-life timeline SVG */}
      <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Skill Half-Life Timeline</p>
        <div style={{ overflowX: 'auto' }}>
          <svg width="100%" height="140" viewBox="0 0 800 140" preserveAspectRatio="xMidYMid meet" style={{ minWidth: 600 }}>
            {/* Grid */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((yr) => (
              <line key={yr} x1={40 + yr * 90} y1={10} x2={40 + yr * 90} y2={110} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            ))}
            {/* X axis */}
            <line x1="40" y1="110" x2="800" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {[0, 2, 4, 6, 8].map((yr) => (
              <text key={yr} x={40 + yr * 90} y={128} textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(255,255,255,0.3)">{yr}yr</text>
            ))}
            {/* Danger zone line at 2yr */}
            <line x1="220" y1="10" x2="220" y2="115" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="222" y="20" fontFamily="JetBrains Mono,monospace" fontSize="8" fill="#EF4444">DANGER ZONE</text>
            {/* Skill dots */}
            {result.skillAnalysis.map((sk, i) => {
              const x = Math.min(40 + (sk.halfLifeYears / 8) * 720, 780);
              const y = 25 + (i % 4) * 20;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={5} fill={STATUS_COLOR[sk.status] || '#6B7280'} opacity={0.9} />
                  <text x={x + 8} y={y + 4} fontFamily="JetBrains Mono,monospace" fontSize="9" fill="rgba(255,255,255,0.6)">{sk.skill}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
