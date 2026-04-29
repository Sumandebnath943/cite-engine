import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanResult, NewsResult } from '@/store/radarStore';
import { ArcGauge } from '@/components/ui/ArcGauge';
import { ThreatMap } from './tabs/ThreatMap';
import { SkillAnalysis } from './tabs/SkillAnalysis';
import { NewsIntel } from './tabs/NewsIntel';
import { UpskillPathway } from './tabs/UpskillPathway';
import { ActionPlan } from './tabs/ActionPlan';

const C = '#22D3EE';
const TABS = [
  { id: 'threat',   label: 'Threat Map' },
  { id: 'skills',   label: 'Skill Analysis' },
  { id: 'news',     label: 'News Intelligence' },
  { id: 'upskill',  label: 'Upskill Pathway' },
  { id: 'actions',  label: 'Action Plan' },
];

function getScoreColor(s: number) {
  if (s >= 80) return '#10B981';
  if (s >= 60) return '#F59E0B';
  return '#EF4444';
}

const SubMetric: React.FC<{ label: string; value: number; invert?: boolean }> = ({ label, value, invert }) => {
  const display = invert ? 100 - value : value;
  const color = invert ? (value > 60 ? '#EF4444' : value > 40 ? '#F59E0B' : '#10B981') : getScoreColor(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 18, color, margin: 0 }}>{display}</p>
    </div>
  );
};

export const ResultsDashboard: React.FC<{
  result: ScanResult;
  newsResult: NewsResult | null;
  isNewsLoading: boolean;
  hasNewsKey: boolean;
  activeTab: string;
  plannedSkills: string[];
  completedActions: string[];
  lastScannedAt: Date | null;
  employer: string;
  onTabChange: (t: string) => void;
  onTogglePlan: (s: string) => void;
  onToggleAction: (a: string) => void;
  onRescan: () => void;
}> = ({ result, newsResult, isNewsLoading, hasNewsKey, activeTab, plannedSkills, completedActions, lastScannedAt, employer, onTabChange, onTogglePlan, onToggleAction, onRescan }) => {
  const topThreat = result.topThreats[0];
  const minutesAgo = lastScannedAt ? Math.round((Date.now() - lastScannedAt.getTime()) / 60000) : 0;

  return (
    <div style={{ margin: '0 -32px' }}>
      {/* Top summary bar */}
      <div style={{ background: '#0D1220', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        {/* Main gauge */}
        <div style={{ flexShrink: 0 }}>
          <ArcGauge score={result.overallScore} size={130} strokeWidth={10} showLabel />
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: getScoreColor(result.overallScore), textTransform: 'uppercase', textAlign: 'center', marginTop: 4 }}>{result.scoreLabel}</p>
        </div>

        {/* Sub-scores */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', flexShrink: 0 }}>
          <SubMetric label="Automation Risk" value={result.automationRiskScore} invert />
          <SubMetric label="Industry Health" value={result.industryHealthScore} />
          <SubMetric label="Skill Relevance" value={result.skillRelevanceScore} />
          <SubMetric label="Role Resilience" value={result.roleResilienceScore} />
        </div>

        {/* Timeline */}
        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 24, flexShrink: 0 }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>⏱ Disruption Timeline</p>
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 18, color: '#fff', margin: 0 }}>{result.timelineToDisruption}</p>
        </div>

        {/* Top threat */}
        {topThreat && (
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 24, flex: 1, minWidth: 160 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Top Threat</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px #EF4444' }} />
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#fff', margin: 0 }}>{topThreat.threat}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onRescan} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>🔄 Re-scan</button>
            <button onClick={() => onTabChange('actions')} style={{ background: 'linear-gradient(135deg,#0891B2,#22D3EE)', border: 'none', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: '#000' }}>⚡ Action Plan</button>
          </div>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>Scanned {minutesAgo < 1 ? 'just now' : `${minutesAgo}m ago`}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 32px', display: 'flex', gap: 0 }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => onTabChange(t.id)}
            style={{ background: 'none', border: 'none', borderBottom: t.id === activeTab ? `2px solid ${C}` : '2px solid transparent', padding: '14px 20px', cursor: 'pointer', marginBottom: -1, fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: t.id === activeTab ? 600 : 400, color: t.id === activeTab ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 32px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {activeTab === 'threat'  && <ThreatMap result={result} />}
            {activeTab === 'skills'  && <SkillAnalysis result={result} />}
            {activeTab === 'news'    && <NewsIntel newsResult={newsResult} isLoading={isNewsLoading} hasNewsKey={hasNewsKey} employer={employer} />}
            {activeTab === 'upskill' && <UpskillPathway result={result} plannedSkills={plannedSkills} onTogglePlan={onTogglePlan} />}
            {activeTab === 'actions' && <ActionPlan result={result} completedActions={completedActions} onToggleAction={onToggleAction} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
