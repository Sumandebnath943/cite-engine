import React, { useEffect, useState } from 'react';
import { ScanResult } from '@/store/radarStore';

const SEV_COLOR: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#22D3EE', low: '#10B981' };
const SEV_BG: Record<string, string> = { critical: 'rgba(239,68,68,0.04)', high: 'rgba(245,158,11,0.04)', medium: 'rgba(34,211,238,0.04)', low: 'rgba(16,185,129,0.04)' };

const MiniBar: React.FC<{ label: string; value: number; color: string; invert?: boolean }> = ({ label, value, color, invert }) => {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 100); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color }}>{invert ? 100 - value : value}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${w}%`, background: color, borderRadius: 999, transition: 'width 1.2s ease' }} />
      </div>
    </div>
  );
};

export const ThreatMap: React.FC<{ result: ScanResult }> = ({ result }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 20 }}>
    {/* LEFT */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Active threats */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active Threats</span>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 999, padding: '2px 8px' }}>{result.topThreats.length} threats detected</span>
        </div>
        {result.topThreats.map((t, i) => (
          <div key={i} style={{ background: SEV_BG[t.severity] || 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${SEV_COLOR[t.severity] || '#6B7280'}`, borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, fontWeight: 700, color: SEV_COLOR[t.severity], background: `${SEV_COLOR[t.severity]}18`, border: `1px solid ${SEV_COLOR[t.severity]}30`, borderRadius: 999, padding: '2px 7px', textTransform: 'uppercase' }}>{t.severity}</span>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', borderRadius: 999, padding: '2px 7px' }}>{t.timeframe}</span>
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 4 }}>{t.threat}</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>{t.explanation}</p>
          </div>
        ))}
      </div>

      {/* Protective factors */}
      <div style={{ background: '#0D1220', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: 18 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#10B981', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>✓ Protective Factors</p>
        {result.protectiveFactors.map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span style={{ color: '#10B981', flexShrink: 0 }}>✓</span>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>{f}</p>
          </div>
        ))}
      </div>

      {/* Role evolution */}
      <div style={{ background: 'rgba(8,145,178,0.06)', border: '1px solid rgba(8,145,178,0.15)', borderRadius: 12, padding: 18 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>🔮 Role Evolution (3-Year Prediction)</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#fff', lineHeight: 1.6, margin: 0 }}>{result.roleEvolutionPrediction}</p>
      </div>

      {/* Euphemism decoder */}
      {result.euphemismAlerts?.length > 0 && (
        <div>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#EF4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>⚠ If Your Company Uses These Words, Act Immediately</p>
          {result.euphemismAlerts.map((phrase, i) => (
            <div key={i} style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 8, padding: '8px 14px', marginBottom: 6, fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
              ⚠️ <span style={{ color: '#FCA5A5', fontStyle: 'italic' }}>"{phrase}"</span>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* RIGHT */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#0D1220', border: '1px solid rgba(8,145,178,0.2)', borderRadius: 12, padding: 20, boxShadow: '0 0 20px rgba(8,145,178,0.05)' }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Industry Outlook</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: 0 }}>{result.industryOutlook}</p>
      </div>

      <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Score Breakdown</p>
        <MiniBar label="Automation Risk" value={result.automationRiskScore} color="#EF4444" />
        <MiniBar label="Industry Health" value={result.industryHealthScore} color="#22D3EE" />
        <MiniBar label="Skill Relevance" value={result.skillRelevanceScore} color="#7C3AED" />
        <MiniBar label="Role Resilience" value={result.roleResilienceScore} color="#10B981" />
      </div>

      <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Urgent Actions Summary</p>
        {result.urgentActions.slice(0, 3).map((a, i) => (
          <div key={i} style={{ background: '#111827', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: SEV_COLOR[a.priority] || '#22D3EE', background: `${SEV_COLOR[a.priority] || '#22D3EE'}18`, borderRadius: 999, padding: '1px 6px', textTransform: 'uppercase' }}>{a.priority}</span>
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.4 }}>{a.action}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
