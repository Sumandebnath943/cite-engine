import React, { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Radio } from 'lucide-react';
import { useRadarStore } from '@/store/radarStore';
import { useToast } from '@/components/ui/Toast';
import { HistoryDrawer } from '@/components/ui/HistoryDrawer';
import { relativeTime } from '@/lib/relativeTime';
import api from '@/lib/api';
import { SetupPhase } from './radar/SetupPhase';
import { RadarLoading } from './radar/LoadingPhase';
import { ResultsDashboard } from './radar/ResultsDashboard';

// ── Radar History Item type ────────────────────────────────────────
interface RadarHistoryItem {
  id: string;
  jobTitle: string;
  employer: string;
  industry: string;
  lastScanResult: Record<string, unknown> | null;
  lastScannedAt: string;
}

// ── Score badge color helper ────────────────────────────────────────
function scoreBadgeStyle(score: number) {
  if (score >= 80) return { bg: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'rgba(16,185,129,0.3)' };
  if (score >= 60) return { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' };
  return { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' };
}

// ── History Drawer Content ─────────────────────────────────────────
const RadarHistoryContent: React.FC<{
  history: RadarHistoryItem[];
  onSelect: (item: RadarHistoryItem) => void;
}> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: 12 }}>
        <Radio size={32} color="#22D3EE" style={{ opacity: 0.6 }} />
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary,#fff)', margin: 0, textAlign: 'center' }}>No radar scans yet.</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'var(--text-muted,rgba(255,255,255,0.4))', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>Initialize your first scan to see history here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {history.map((item) => {
        const score = (item.lastScanResult as any)?.jobSecurityScore ?? 0;
        const topThreat = (item.lastScanResult as any)?.topThreats?.[0]?.name;
        const badge = scoreBadgeStyle(score);
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              background: 'var(--bg-card,#111827)',
              border: '1px solid var(--border-default,rgba(255,255,255,0.07))',
              borderLeft: '3px solid #22D3EE',
              borderRadius: 12, padding: 16,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s', width: '100%',
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.borderLeftColor = '#67E8F9'; (e.currentTarget).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget).style.borderLeftColor = '#22D3EE'; (e.currentTarget).style.transform = 'translateY(0)'; }}
          >
            {/* Row 1: title + score badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary,#fff)', lineHeight: 1.4 }}>
                {item.jobTitle}{item.employer ? ` at ${item.employer}` : ''}
              </span>
              {score > 0 && (
                <span style={{
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
                  color: badge.color, background: badge.bg,
                  border: `1px solid ${badge.border}`,
                  borderRadius: 999, padding: '2px 8px', flexShrink: 0,
                }}>
                  {score}
                </span>
              )}
            </div>

            {/* Row 2: industry pill + date */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: topThreat ? 6 : 0 }}>
              {item.industry && (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#22D3EE', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 4, padding: '2px 7px' }}>
                  {item.industry}
                </span>
              )}
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'var(--text-muted,rgba(255,255,255,0.3))', marginLeft: 'auto' }}>
                {relativeTime(item.lastScannedAt)}
              </span>
            </div>

            {/* Row 3: top threat snippet */}
            {topThreat && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'Inter,sans-serif', fontSize: 12,
                  color: 'var(--text-muted,rgba(255,255,255,0.4))',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {topThreat}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
export default function RadarPage() {
  const { showToast } = useToast();
  const {
    phase, profileData, scanResult, newsResult, activeTab,
    plannedSkills, completedActions, isNewsLoading, lastScannedAt,
    setPhase, setProfileData, setScanResult, setNewsResult, setActiveTab,
    setIsLoading, setIsNewsLoading, togglePlannedSkill, toggleCompletedAction,
    setError, resetAll,
  } = useRadarStore();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [radarHistory, setRadarHistory] = useState<RadarHistoryItem[]>([]);

  // Load history when drawer opens
  const handleOpenDrawer = useCallback(() => {
    setDrawerOpen(true);
    api.get('/radar/history')
      .then((r) => setRadarHistory(r.data?.data || []))
      .catch(() => setRadarHistory([]));
  }, []);

  const handleSelectHistory = useCallback((item: RadarHistoryItem) => {
    if (item.lastScanResult) {
      setScanResult(item.lastScanResult as any);
      setPhase('results');
    }
    setDrawerOpen(false);
  }, [setScanResult, setPhase]);

  const handleScan = useCallback(async () => {
    if (!profileData.jobTitle || !profileData.industry || profileData.skills.length === 0) {
      showToast('Please fill in job title, industry, and at least one skill', 'error');
      return;
    }
    setPhase('loading');
    setIsLoading(true);

    try {
      const [scanRes] = await Promise.all([
        api.post('/radar/scan', {
          jobTitle: profileData.jobTitle,
          employer: profileData.employer,
          industry: profileData.industry,
          yearsExperience: profileData.yearsExperience,
          skills: profileData.skills,
          dailyTasks: profileData.dailyTasks,
          location: profileData.location,
        }),
      ]);
      setScanResult(scanRes.data.data);
      showToast('Radar scan complete — reviewing intelligence report', 'success');

      // Async news scan
      setIsNewsLoading(true);
      api.post('/radar/news-scan', {
        employer: profileData.employer,
        industry: profileData.industry,
        jobTitle: profileData.jobTitle,
      }).then((r) => {
        setNewsResult(r.data.data);
      }).catch(() => {
        setIsNewsLoading(false);
      });

    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Scan failed. Please try again.';
      setError(msg);
      setPhase('setup');
      showToast(msg, 'error');
    }
  }, [profileData, setPhase, setIsLoading, setScanResult, setNewsResult, setIsNewsLoading, setError, showToast]);

  return (
    <>
      <HistoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Radar History"
        accentColor="#22D3EE"
      >
        <RadarHistoryContent history={radarHistory} onSelect={handleSelectHistory} />
      </HistoryDrawer>

      <div style={{ flex: 1 }}>
        {/* History button */}
        {phase !== 'loading' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button
              onClick={handleOpenDrawer}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 36, padding: '0 14px',
                background: 'none',
                border: '1px solid var(--border-default,rgba(255,255,255,0.08))',
                borderRadius: 8, cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontSize: 13,
                color: '#22D3EE', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(34,211,238,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = 'none'; }}
            >
              <Clock size={14} />
              History
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
            {phase === 'setup' && (
              <SetupPhase
                profileData={profileData}
                onChange={(d) => setProfileData(d)}
                onSubmit={handleScan}
              />
            )}
            {phase === 'loading' && <RadarLoading />}
            {phase === 'results' && scanResult && (
              <ResultsDashboard
                result={scanResult}
                newsResult={newsResult}
                isNewsLoading={isNewsLoading}
                hasNewsKey={!!(newsResult as any)?.hasLiveData}
                activeTab={activeTab}
                plannedSkills={plannedSkills}
                completedActions={completedActions}
                lastScannedAt={lastScannedAt}
                employer={profileData.employer}
                onTabChange={setActiveTab}
                onTogglePlan={togglePlannedSkill}
                onToggleAction={toggleCompletedAction}
                onRescan={resetAll}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
