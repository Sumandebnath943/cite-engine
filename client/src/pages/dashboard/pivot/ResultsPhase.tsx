import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2, ExternalLink, Printer, Download } from 'lucide-react';
import { TranslationResult, LearningPath } from '@/store/pivotStore';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

const TABS = ['Resume Bullets', 'LinkedIn Profile', 'Learning Path', 'Intelligence Report'];

const PRIORITY_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F59E0B', medium: '#10B981',
};

// ── Animated readiness bar ─────────────────────────────────────────
const ReadinessBar: React.FC<{ pct: number }> = ({ pct }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1200, 1);
        setWidth((1 - Math.pow(1 - p, 3)) * pct);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 200);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${width}%`, background: 'linear-gradient(90deg,#7C3AED,#22D3EE)', borderRadius: 999, transition: 'none' }} />
    </div>
  );
};

// ── Copy button ────────────────────────────────────────────────────
const CopyBtn: React.FC<{ text: string; id: string }> = ({ text, id }) => {
  const { copy, copiedId } = useCopyToClipboard();
  const copied = copiedId === id;
  return (
    <button onClick={() => copy(text, id)} title={copied ? 'Copied!' : 'Copy'}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#10B981' : 'rgba(255,255,255,0.35)', display: 'flex', padding: 4, transition: 'color 0.2s' }}>
      {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
    </button>
  );
};

// ── ResultCard wrapper ─────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; glow?: boolean; style?: React.CSSProperties }> = ({ children, glow, style }) => (
  <div style={{
    background: '#111827', borderRadius: 12, padding: '20px 24px',
    border: glow ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.06)',
    boxShadow: glow ? '0 0 32px rgba(124,58,237,0.08)' : 'none',
    ...style,
  }}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{children}</p>
);

// ── Tab 1: Resume Bullets ──────────────────────────────────────────
const BulletsTab: React.FC<{ result: TranslationResult }> = ({ result }) => {
  const allText = result.translatedBullets.map((b) => b.translated).join('\n');
  const { copy, copiedId } = useCopyToClipboard();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Label>Translated Experience</Label>
        <button onClick={() => copy(allText, 'all')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
          {copiedId === 'all' ? <CheckCircle2 size={13} /> : <Copy size={13} />} Copy All
        </button>
      </div>
      {result.translatedBullets.map((b, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}
          style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid rgba(124,58,237,0.4)', borderRadius: 12, padding: '20px 24px', marginBottom: 14, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <CopyBtn text={b.translated} id={`bullet-${i}`} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'start', marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 6 }}>BEFORE</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', lineHeight: 1.5 }}>{b.original}</p>
            </div>
            <div style={{ color: '#7C3AED', fontSize: 18, paddingTop: 22 }}>→</div>
            <div>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#A78BFA', letterSpacing: '0.1em', marginBottom: 6 }}>AFTER</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#fff', fontWeight: 500, lineHeight: 1.5 }}>{b.translated}</p>
            </div>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 999, padding: '3px 10px' }}>
            <span style={{ fontSize: 11 }}>🧠</span>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#A78BFA' }}>{b.skill}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── Tab 2: LinkedIn ────────────────────────────────────────────────
const LinkedInTab: React.FC<{ result: TranslationResult }> = ({ result }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Card glow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Label>LinkedIn Headline</Label>
        <CopyBtn text={result.linkedInHeadline} id="li-headline" />
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 20, color: '#fff', lineHeight: 1.4 }}>{result.linkedInHeadline}</p>
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>{result.linkedInHeadline.length} / 220 chars</p>
    </Card>
    <Card glow>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Label>About Section</Label>
        <CopyBtn text={result.linkedInSummary} id="li-summary" />
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result.linkedInSummary}</p>
    </Card>
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Label>Professional Bio (3rd Person)</Label>
        <CopyBtn text={result.professionalBio} id="li-bio" />
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{result.professionalBio}</p>
    </Card>
    <Card>
      <Label>Skills You Didn't Know You Had</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {result.hiddenTransferableSkills.map((s) => (
          <span key={s} style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA', borderRadius: 999, padding: '6px 14px' }}>{s}</span>
        ))}
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', lineHeight: 1.6 }}>{result.industryDialectNotes}</p>
    </Card>
  </div>
);

// ── Tab 3: Learning Path ──────────────────────────────────────────
const LearningTab: React.FC<{ lp: LearningPath }> = ({ lp }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <Card>
      <Label>Skill Gap Intelligence</Label>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{lp.gapAnalysis}</p>
    </Card>

    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Current Readiness for Target Role</p>
        <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 24, color: '#fff' }}>{lp.readinessPercentage}%</span>
      </div>
      <ReadinessBar pct={lp.readinessPercentage} />
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Estimated ready in: {lp.estimatedReadinessTimeline}</p>
    </div>

    <div>
      <Label>Leverage These Strengths</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {lp.strengthsToLeverage.map((s) => (
          <span key={s} style={{ fontFamily: 'Inter,sans-serif', fontWeight: 500, fontSize: 13, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', borderRadius: 999, padding: '5px 12px' }}>{s}</span>
        ))}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...lp.urgentSkills].sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2 };
        return order[a.priority] - order[b.priority];
      }).map((sk, i) => (
        <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${PRIORITY_COLOR[sk.priority]}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, color: PRIORITY_COLOR[sk.priority], background: `${PRIORITY_COLOR[sk.priority]}18`, border: `1px solid ${PRIORITY_COLOR[sk.priority]}30`, borderRadius: 999, padding: '2px 8px', textTransform: 'uppercase' }}>{sk.priority}</span>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#22D3EE', background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 999, padding: '2px 8px' }}>{sk.timeToLearn}</span>
          </div>
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', marginBottom: 6 }}>{sk.skill}</p>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>{sk.reason}</p>
          <a href={sk.resourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#6366F1', textDecoration: 'none' }}>
            <ExternalLink size={13} /> {sk.resource}
          </a>
        </div>
      ))}
    </div>
  </div>
);

// ── Tab 4: Intelligence Report ─────────────────────────────────────
const ReportTab: React.FC<{ result: TranslationResult; lp: LearningPath; currentRole: string; targetRole: string }> = ({ result, lp, currentRole, targetRole }) => {
  const exportTxt = () => {
    const lines = [
      'CITE — CAREER TRANSLATION INTELLIGENCE REPORT',
      `Date: ${new Date().toLocaleDateString()}`,
      `Transition: ${currentRole} → ${targetRole}`,
      `Confidence Score: ${result.confidenceScore}%`,
      '',
      '=== TRANSLATED EXPERIENCE ===',
      ...result.translatedBullets.map((b) => `• ${b.translated}`),
      '',
      '=== LINKEDIN HEADLINE ===',
      result.linkedInHeadline,
      '',
      '=== LINKEDIN SUMMARY ===',
      result.linkedInSummary,
      '',
      '=== PROFESSIONAL BIO ===',
      result.professionalBio,
      '',
      '=== HIDDEN TRANSFERABLE SKILLS ===',
      result.hiddenTransferableSkills.join(', '),
      '',
      '=== LEARNING PATH ===',
      lp.gapAnalysis,
      `Readiness: ${lp.readinessPercentage}% — ${lp.estimatedReadinessTimeline}`,
      '',
      '=== SKILL PRIORITIES ===',
      ...lp.urgentSkills.map((s) => `[${s.priority.toUpperCase()}] ${s.skill} — ${s.timeToLearn}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'cite-translation-report.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(8,145,178,0.04))', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>CITE · Career Translation Intelligence Report</p>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div style={{ display: 'inline-flex', gap: 8 }}>
          <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            <Printer size={14} /> Print
          </button>
          <button onClick={exportTxt} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#A78BFA' }}>
            <Download size={14} /> Export .txt
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {[{ label: 'From', val: currentRole }, { label: 'To', val: targetRole }, { label: 'Confidence', val: `${result.confidenceScore}%` }, { label: 'Readiness', val: `${lp.readinessPercentage}%` }].map((item) => (
          <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 16, color: '#fff' }}>{item.val}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <Label>Translated Experience</Label>
          {result.translatedBullets.map((b, i) => (
            <p key={i} style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 6 }}>• {b.translated}</p>
          ))}
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div>
          <Label>LinkedIn Headline</Label>
          <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff' }}>{result.linkedInHeadline}</p>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <div>
          <Label>Key Skill Priorities</Label>
          {lp.urgentSkills.slice(0, 3).map((s, i) => (
            <p key={i} style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
              <span style={{ color: PRIORITY_COLOR[s.priority], fontWeight: 600 }}>[{s.priority.toUpperCase()}]</span> {s.skill} — {s.timeToLearn}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Results Phase ──────────────────────────────────────────────────
export const ResultsPhase: React.FC<{
  result: TranslationResult;
  lp: LearningPath;
  currentRole: string;
  targetRole: string;
  onReset: () => void;
}> = ({ result, lp, currentRole, targetRole, onReset }) => {
  const [tab, setTab] = useState(0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)', padding: 0 }}>
            ← New Translation
          </button>
          <h2 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 32, color: '#fff', letterSpacing: '-0.025em', margin: 0 }}>Translation Complete</h2>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 999, padding: '5px 14px' }}>
            CONFIDENCE: {result.confidenceScore}%
          </span>
        </div>
      </div>

      {/* Step indicator (completed) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
        {['Input', 'Translating', 'Results'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: i < 2 ? '#10B981' : '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 12, color: '#fff' }}>
                {i < 2 ? '✓' : '3'}
              </div>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: i === 2 ? '#fff' : 'rgba(255,255,255,0.5)' }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 2, background: i < 1 ? '#10B981' : 'rgba(255,255,255,0.08)', margin: '0 16px' }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            background: 'none', border: 'none', borderBottom: i === tab ? '2px solid #7C3AED' : '2px solid transparent',
            padding: '10px 20px', cursor: 'pointer', marginBottom: -1,
            fontFamily: 'Inter,sans-serif', fontSize: 14, fontWeight: i === tab ? 600 : 400,
            color: i === tab ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {tab === 0 && <BulletsTab result={result} />}
          {tab === 1 && <LinkedInTab result={result} />}
          {tab === 2 && <LearningTab lp={lp} />}
          {tab === 3 && <ReportTab result={result} lp={lp} currentRole={currentRole} targetRole={targetRole} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
