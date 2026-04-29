import React, { useEffect } from 'react';
import { ScanResult, UrgentAction } from '@/store/radarStore';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';

const BUCKET_CONFIG: Record<string, { label: string; accent: string; bg: string }> = {
  immediate: { label: '⚡ Do This Week', accent: '#EF4444', bg: 'rgba(239,68,68,0.06)' },
  '30days':  { label: '📅 This Month',   accent: '#F59E0B', bg: 'rgba(245,158,11,0.04)' },
  '90days':  { label: '🎯 This Quarter', accent: '#22D3EE', bg: 'rgba(34,211,238,0.04)' },
  '6months': { label: '🌱 6-Month Horizon', accent: '#10B981', bg: 'rgba(16,185,129,0.04)' },
};

const PRI_COLOR: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#22D3EE' };

const ActionItem: React.FC<{ action: UrgentAction; done: boolean; onToggle: () => void }> = ({ action, done, onToggle }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <button onClick={onToggle} style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${done ? '#22D3EE' : 'rgba(255,255,255,0.2)'}`, background: done ? '#22D3EE' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, transition: 'all 0.15s' }}>
      {done && <span style={{ color: '#000', fontSize: 12, fontWeight: 700 }}>✓</span>}
    </button>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: done ? 'rgba(255,255,255,0.3)' : '#fff', textDecoration: done ? 'line-through' : 'none', margin: 0 }}>{action.action}</p>
        <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: PRI_COLOR[action.priority] || '#6B7280', background: `${PRI_COLOR[action.priority] || '#6B7280'}15`, borderRadius: 999, padding: '1px 6px', textTransform: 'uppercase', flexShrink: 0 }}>{action.priority}</span>
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Impact: {action.impact}</p>
    </div>
  </div>
);

export const ActionPlan: React.FC<{ result: ScanResult; completedActions: string[]; onToggleAction: (a: string) => void }> = ({ result, completedActions, onToggleAction }) => {
  const { showToast } = useToast();
  const buckets: Record<string, UrgentAction[]> = { immediate: [], '30days': [], '90days': [], '6months': [] };
  result.urgentActions.forEach((a) => { if (buckets[a.timeframe]) buckets[a.timeframe].push(a); else buckets['6months'].push(a); });

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem('cite-completed-actions', JSON.stringify(completedActions)); } catch {}
  }, [completedActions]);

  const handleMonitoring = async () => {
    try {
      await api.post('/radar/monitor-setup', {});
      showToast('Daily monitoring enabled! You\'ll receive alerts when new threats emerge.', 'success');
    } catch {
      showToast('Monitoring setup saved — configure alerts in settings.', 'info');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 4 }}>Your Survival Action Plan</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Ordered by urgency. Tackle these in sequence.</p>
      </div>

      {Object.entries(BUCKET_CONFIG).map(([key, cfg]) => {
        const actions = buckets[key];
        if (actions.length === 0) return null;
        return (
          <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.accent}20`, borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 15, color: cfg.accent, marginBottom: 4 }}>{cfg.label}</p>
            <div style={{ borderTop: `1px solid ${cfg.accent}15`, paddingTop: 4 }}>
              {actions.map((a, i) => (
                <ActionItem key={i} action={a} done={completedActions.includes(a.action)} onToggle={() => onToggleAction(a.action)} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Monitoring CTA */}
      <div style={{ background: 'linear-gradient(135deg, rgba(8,145,178,0.1), rgba(124,58,237,0.08))', border: '1px solid rgba(8,145,178,0.2)', borderRadius: 16, padding: 28, marginTop: 24 }}>
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 18, color: '#fff', marginBottom: 8 }}>Stay ahead of threats automatically</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 16 }}>
          CITE can monitor your employer and industry daily and alert you when new threat signals emerge. Never be caught off guard again.
        </p>
        <button onClick={handleMonitoring}
          style={{ background: 'linear-gradient(135deg,#0891B2,#22D3EE)', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#000' }}>
          📡 Enable Daily Monitoring
        </button>
      </div>
    </div>
  );
};
