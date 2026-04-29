import React, { useEffect, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, MessageSquare, Radio, Shield, Zap, ArrowRight, Clock, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ArcGauge } from '@/components/ui/ArcGauge';
import { SkeletonCard, SkeletonRow } from '@/components/ui/StateComponents';
import { relativeTime } from '@/lib/relativeTime';
import api from '@/lib/api';

interface DashStats { totalPivots: number; totalScripts: number; totalScans: number; latestScore: number | null; scoreLabel: string | null; }
interface ActivityItem { type: 'pivot' | 'copilot' | 'radar'; description: string; createdAt: string; linkPath: string; }

const ACT_COLOR: Record<string, string> = { pivot: '#A78BFA', copilot: '#F59E0B', radar: '#22D3EE' };
const ACT_ICON: Record<string, React.ReactNode> = { pivot: <Wand2 size={14} />, copilot: <MessageSquare size={14} />, radar: <Radio size={14} /> };

// ── Live clock — isolated so its tick never re-renders the parent ──
const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
      {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </p>
  );
};

function useCounter(target: number) {
  const [v, setV] = useState(0);
  useEffect(() => { if (!target) return; const s = performance.now(); const tick = (n: number) => { const p = Math.min((n - s) / 1000, 1); setV(Math.round((1 - (1 - p) ** 3) * target)); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, [target]);
  return v;
}

const StatCard: React.FC<{ icon: React.ReactNode; iconBg: string; value: number | string; label: string; sub?: string; subColor?: string }> = ({ icon, iconBg, value, label, sub, subColor }) => {
  const counted = useCounter(typeof value === 'number' ? value : 0);
  return (
    <motion.div whileHover={{ y: -2 }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 14, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{icon}</div>
      <div>
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 40, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 4 }}>{typeof value === 'number' ? counted : value}</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{label}</p>
        {sub && <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: subColor || '#10B981', marginTop: 4 }}>{sub}</p>}
      </div>
    </motion.div>
  );
};

// ── EngineCard: defined OUTSIDE DashboardPage so React never remounts it ──
// Memoized to prevent re-renders when parent state (stats, activity) updates
const EngineCard = memo(({ color, borderColor, shadow, engineLabel, name, icon, active, body, ctaLabel, ctaPath }: {
  color: string; borderColor: string; shadow: string; engineLabel: string;
  name: string; icon: React.ReactNode; active: boolean; body: React.ReactNode;
  ctaLabel: string; ctaPath: string;
}) => (
  <div style={{ background: 'var(--bg-card)', border: `1px solid ${borderColor}`, borderRadius: 16, padding: 28, boxShadow: shadow, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{engineLabel}</p>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>{name}</p>
        </div>
      </div>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: active ? '#10B981' : '#6B7280', background: active ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', border: `1px solid ${active ? 'rgba(16,185,129,0.25)' : 'rgba(107,114,128,0.2)'}`, borderRadius: 999, padding: '3px 8px' }}>
        {active ? 'ACTIVE' : 'READY'}
      </span>
    </div>
    <div style={{ flex: 1, minHeight: 80, background: 'var(--border-subtle,rgba(255,255,255,0.02))', borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {body}
    </div>
    <Link to={ctaPath} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 8, border: `1px solid ${color}40`, background: 'transparent', fontFamily: 'Inter,sans-serif', fontSize: 13, color, textDecoration: 'none', gap: 6 }}>
      {ctaLabel} <ArrowRight size={13} />
    </Link>
  </div>
));
EngineCard.displayName = 'EngineCard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const [s, a] = await Promise.all([api.get('/dashboard/stats'), api.get('/dashboard/activity')]); setStats(s.data.data); setActivity(a.data.data); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const firstName = user?.name?.split(' ')[0] || 'there';
  const h = new Date().getHours();
  const salute = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
  const scoreColor = stats?.latestScore != null ? (stats.latestScore >= 80 ? '#10B981' : stats.latestScore >= 60 ? '#F59E0B' : '#EF4444') : 'rgba(255,255,255,0.3)';

  const QUICK = [
    { label: 'Translate Resume',    path: '/dashboard/pivot',   color: '#A78BFA',          bg: 'rgba(124,58,237,0.1)',  border: 'rgba(124,58,237,0.25)',  icon: <Wand2 size={14} /> },
    { label: 'Script Conversation', path: '/dashboard/copilot', color: '#F59E0B',          bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', icon: <MessageSquare size={14} /> },
    { label: 'Run Security Scan',   path: '/dashboard/radar',   color: '#22D3EE',          bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.25)', icon: <Radio size={14} /> },
    { label: 'View Learning Path',  path: '/dashboard/pivot',   color: 'rgba(167,139,250,0.7)', bg: 'transparent', border: 'rgba(124,58,237,0.2)',  icon: <Zap size={14} /> },
    { label: 'Practice Roleplay',   path: '/dashboard/copilot', color: 'rgba(245,158,11,0.7)', bg: 'transparent', border: 'rgba(245,158,11,0.2)', icon: <MessageSquare size={14} /> },
    { label: 'Check Skill Pulse',   path: '/dashboard/radar',   color: 'rgba(34,211,238,0.7)', bg: 'transparent', border: 'rgba(34,211,238,0.2)', icon: <Activity size={14} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`@keyframes sysPulse{0%,100%{opacity:1}50%{opacity:0.3}} @media(max-width:1024px){.sg{grid-template-columns:1fr 1fr!important}.eg{grid-template-columns:1fr!important}.bg{grid-template-columns:1fr!important}}`}</style>

      {/* Welcome */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 32, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: '0 0 6px' }}>Good {salute}, {firstName}.</h1>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>Your intelligence engines are standing by.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <LiveClock />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 999, padding: '4px 12px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'sysPulse 2s infinite' }} />
            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#10B981', fontWeight: 600 }}>Systems Online</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="sg" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {loading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} height={130} />) : <>
          <StatCard icon={<Zap size={16} />}          iconBg="rgba(124,58,237,0.3)"  value={stats?.totalPivots  ?? 0}   label="Career Analyses" />
          <StatCard icon={<MessageSquare size={16} />} iconBg="rgba(245,158,11,0.3)" value={stats?.totalScripts ?? 0}   label="Scripts Generated" />
          <StatCard icon={<Radio size={16} />}         iconBg="rgba(34,211,238,0.3)" value={stats?.totalScans   ?? 0}   label="Security Scans" />
          <StatCard icon={<Shield size={16} />}        iconBg={`${scoreColor}30`}    value={stats?.latestScore  ?? '—'} label="Security Score" sub={stats?.scoreLabel ?? 'Not scanned'} subColor={scoreColor} />
        </>}
      </div>

      {/* Engine panels */}
      <div className="eg" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <EngineCard
          color="#A78BFA" borderColor="rgba(124,58,237,0.2)" shadow="0 0 32px rgba(124,58,237,0.06)"
          engineLabel="Engine A" name="Career Pivot" icon={<Wand2 size={16} color="#A78BFA" />}
          active={!!stats?.totalPivots}
          ctaLabel={stats?.totalPivots ? 'View Translations' : '+ New Translation'} ctaPath="/dashboard/pivot"
          body={stats?.totalPivots
            ? <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{stats.totalPivots} resume translation{stats.totalPivots !== 1 ? 's' : ''} completed</p>
            : <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>No translations yet. Start your first career pivot.</p>}
        />
        <EngineCard
          color="#F59E0B" borderColor="rgba(217,119,6,0.2)" shadow="0 0 32px rgba(217,119,6,0.06)"
          engineLabel="Engine B" name="Copilot" icon={<MessageSquare size={16} color="#F59E0B" />}
          active={!!stats?.totalScripts}
          ctaLabel={stats?.totalScripts ? 'View Scripts' : 'Practice a Conversation'} ctaPath="/dashboard/copilot"
          body={stats?.totalScripts
            ? <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{stats.totalScripts} script{stats.totalScripts !== 1 ? 's' : ''} generated</p>
            : <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>No scripts yet. Practice your next difficult conversation.</p>}
        />
        <EngineCard
          color="#22D3EE" borderColor="rgba(8,145,178,0.2)" shadow="0 0 32px rgba(8,145,178,0.06)"
          engineLabel="Engine C" name="Radar" icon={<Radio size={16} color="#22D3EE" />}
          active={stats?.latestScore != null}
          ctaLabel={stats?.latestScore != null ? 'View Full Report' : '→ Start Radar Scan'} ctaPath="/dashboard/radar"
          body={stats?.latestScore != null
            ? <div style={{ textAlign: 'center' }}><ArcGauge score={stats.latestScore} size={90} strokeWidth={7} showLabel={false} /></div>
            : <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0, textAlign: 'center' }}>No scan yet. Initialize your first radar scan.</p>}
        />
      </div>

      {/* Activity + Quick Actions */}
      <div className="bg" style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 16 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Clock size={14} color="rgba(255,255,255,0.4)" />
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#fff', margin: 0 }}>Recent Activity</p>
          </div>
          {loading ? <SkeletonRow count={5} height={48} /> : activity.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>No activity yet. Activate an engine to get started.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {(['pivot', 'copilot', 'radar'] as const).map((t) => <Link key={t} to={`/dashboard/${t}`} style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: ACT_COLOR[t], border: `1px solid ${ACT_COLOR[t]}30`, borderRadius: 8, padding: '5px 12px', textDecoration: 'none' }}>{t}</Link>)}
              </div>
            </div>
          ) : activity.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${ACT_COLOR[item.type]}15`, border: `1px solid ${ACT_COLOR[item.type]}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACT_COLOR[item.type], flexShrink: 0 }}>{ACT_ICON[item.type]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{relativeTime(item.createdAt)}</p>
              </div>
              <Link to={item.linkPath} style={{ color: 'rgba(255,255,255,0.2)', textDecoration: 'none', flexShrink: 0 }}>→</Link>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 22 }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 14 }}>Quick Actions</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {QUICK.map((a) => (
                <Link key={a.label} to={a.path} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 44, borderRadius: 10, border: `1px solid ${a.border}`, background: a.bg, padding: '0 10px', textDecoration: 'none', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: a.color, transition: 'all 0.15s' }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>System Status</p>
            {[['Career Pivot Engine'], ['Conversation Copilot'], ['Job Radar']].map(([name]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{name}</span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#10B981' }}>Operational</span>
              </div>
            ))}
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: '8px 0 0' }}>All systems nominal</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
