import React from 'react';
import { AlertCircle } from 'lucide-react';

// ── Skeleton shimmer ──────────────────────────────────────────────
export const SkeletonCard: React.FC<{ height?: number; borderRadius?: number }> = ({ height = 120, borderRadius = 14 }) => (
  <>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    <div style={{ height, borderRadius, background: 'linear-gradient(90deg,#111827 25%,#161F35 50%,#111827 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite linear' }} />
  </>
);

export const SkeletonRow: React.FC<{ count?: number; height?: number }> = ({ count = 1, height = 20 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} height={height} borderRadius={8} />
    ))}
  </div>
);

// ── Error card ────────────────────────────────────────────────────
export const ErrorCard: React.FC<{ message?: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
    <AlertCircle size={32} color="#EF4444" style={{ margin: '0 auto 12px' }} />
    <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 8 }}>Something went wrong</p>
    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: onRetry ? 16 : 0 }}>{message || 'An unexpected error occurred.'}</p>
    {onRetry && (
      <button onClick={onRetry} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '7px 18px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#EF4444' }}>Try Again</button>
    )}
  </div>
);

// ── Empty state ───────────────────────────────────────────────────
type EngineType = 'pivot' | 'copilot' | 'radar';
const EMPTY_CONFIG: Record<EngineType, { icon: string; title: string; desc: string; cta: string; path: string; color: string }> = {
  pivot:   { icon: '🪄', title: 'No translations yet', desc: 'Your professional identity translations will appear here.', cta: 'Start Translation →', path: '/dashboard/pivot', color: '#A78BFA' },
  copilot: { icon: '💬', title: 'No scripts yet', desc: 'Your conversation scripts and roleplay sessions will appear here.', cta: 'Start a Conversation →', path: '/dashboard/copilot', color: '#F59E0B' },
  radar:   { icon: '📡', title: 'No scans yet', desc: 'Your job security radar scans will appear here.', cta: 'Initialize Radar →', path: '/dashboard/radar', color: '#22D3EE' },
};

export const EmptyState: React.FC<{ engine: EngineType; onAction?: () => void }> = ({ engine, onAction }) => {
  const cfg = EMPTY_CONFIG[engine];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
      <span style={{ fontSize: 36, marginBottom: 14 }}>{cfg.icon}</span>
      <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 6 }}>{cfg.title}</p>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{cfg.desc}</p>
      <button onClick={onAction} style={{ background: 'none', border: `1px solid ${cfg.color}40`, borderRadius: 8, padding: '7px 18px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: cfg.color }}>
        {cfg.cta}
      </button>
    </div>
  );
};

// ── Page skeleton (used during lazy load) ────────────────────────
export const PageSkeleton: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 32 }}>
    <SkeletonCard height={48} borderRadius={8} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
      {[...Array(4)].map((_, i) => <SkeletonCard key={i} height={110} />)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
      {[...Array(3)].map((_, i) => <SkeletonCard key={i} height={220} />)}
    </div>
  </div>
);
