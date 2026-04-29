import React from 'react';
import { NewsResult } from '@/store/radarStore';

const SEV_COLOR: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#22D3EE', low: '#10B981' };
const THREAT_CONFIG: Record<string, { color: string; label: string }> = {
  critical: { color: '#EF4444', label: 'CRITICAL' },
  elevated: { color: '#F59E0B', label: 'ELEVATED' },
  moderate: { color: '#F59E0B', label: 'MODERATE' },
  low: { color: '#6B7280', label: 'LOW' },
  minimal: { color: '#10B981', label: 'MINIMAL' },
};

export const NewsIntel: React.FC<{ newsResult: NewsResult | null; isLoading: boolean; hasNewsKey: boolean; employer: string }> = ({ newsResult, isLoading, hasNewsKey, employer }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 16 }}>
        <style>{`@keyframes cyanSpin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 36, height: 36, border: '3px solid rgba(34,211,238,0.2)', borderTop: '3px solid #22D3EE', borderRadius: '50%', animation: 'cyanSpin 1s linear infinite' }} />
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Gathering intelligence feed...</p>
      </div>
    );
  }

  if (!newsResult) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.4)' }}>No intelligence data yet. Run a radar scan to populate this feed.</p>
      </div>
    );
  }

  const tc = THREAT_CONFIG[newsResult.threatLevel] || THREAT_CONFIG.moderate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Threat Intelligence Feed</p>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: tc.color, background: `${tc.color}15`, border: `1px solid ${tc.color}30`, borderRadius: 999, padding: '3px 10px' }}>{tc.label}</span>
        {!hasNewsKey && <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>AI-generated (add NEWSAPI_KEY for live data)</span>}
      </div>

      {/* Intel summary */}
      <div style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.08), rgba(34,211,238,0.04))', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 14, padding: 20 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Overall Intelligence Summary</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#fff', lineHeight: 1.7, margin: 0 }}>{newsResult.overallIntelSummary}</p>
      </div>

      {/* Employer signals */}
      {newsResult.employerSignals?.length > 0 && (
        <div>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Employer Intelligence{employer && ` — ${employer}`}</p>
          {newsResult.employerSignals.map((sig, i) => (
            <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_COLOR[sig.severity] || '#6B7280', boxShadow: `0 0 6px ${SEV_COLOR[sig.severity]}` }} />
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: SEV_COLOR[sig.severity] || '#6B7280', textTransform: 'uppercase' }}>{sig.severity}</span>
              </div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 6 }}>{sig.signal}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                {sig.source} {sig.url && <a href={sig.url} target="_blank" rel="noopener noreferrer" style={{ color: '#22D3EE', textDecoration: 'none' }}> ↗</a>}
              </p>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: 0 }}>{sig.date}</p>
              {(sig.euphemismsDetected?.length ?? 0) > 0 && (
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {sig.euphemismsDetected?.map((e) => (
                    <span key={e} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#FCA5A5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 999, padding: '2px 8px' }}>⚠ {e}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Euphemism decoder */}
      {newsResult.euphemismDecoder?.length > 0 && (
        <div>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Euphemism Decoder</p>
          {newsResult.euphemismDecoder.map((d, i) => (
            <div key={i} style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 8, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#FCD34D' }}>"{d.phrase}"</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>→</span>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#fff' }}>{d.translation}</span>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: SEV_COLOR[d.riskLevel] || '#6B7280', background: `${SEV_COLOR[d.riskLevel]}15`, borderRadius: 999, padding: '2px 7px', textTransform: 'uppercase', marginLeft: 'auto' }}>{d.riskLevel} risk</span>
            </div>
          ))}
        </div>
      )}

      {/* Industry signals */}
      {newsResult.industrySignals?.length > 0 && (
        <div>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Industry Signals</p>
          {newsResult.industrySignals.map((sig, i) => (
            <div key={i} style={{ background: 'rgba(34,211,238,0.03)', border: '1px solid rgba(34,211,238,0.08)', borderRadius: 10, padding: 14, marginBottom: 8 }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, color: '#fff', marginBottom: 4 }}>{sig.signal}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{sig.source} · {sig.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recommended actions */}
      {newsResult.recommendedActions?.length > 0 && (
        <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 18 }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Recommended Actions</p>
          {newsResult.recommendedActions.map((a, i) => (
            <p key={i} style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>• {a}</p>
          ))}
        </div>
      )}
    </div>
  );
};
