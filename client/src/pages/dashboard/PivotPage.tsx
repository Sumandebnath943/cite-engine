import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, RotateCcw } from 'lucide-react';
import { usePivotStore, HistoryRecord } from '@/store/pivotStore';
import { useToast } from '@/components/ui/Toast';
import { HistoryDrawer } from '@/components/ui/HistoryDrawer';
import { relativeTime } from '@/lib/relativeTime';
import api from '@/lib/api';
import { InputPhase } from './pivot/InputPhase';
import { LoadingPhase } from './pivot/LoadingPhase';
import { ResultsPhase } from './pivot/ResultsPhase';

// ── History Drawer Content ─────────────────────────────────────────
const PivotHistoryContent: React.FC<{
  history: HistoryRecord[];
  onSelect: (r: HistoryRecord) => void;
}> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: 12 }}>
        <Clock size={32} color="#7C3AED" style={{ opacity: 0.6 }} />
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary,#fff)', margin: 0, textAlign: 'center' }}>No translations yet</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'var(--text-muted,rgba(255,255,255,0.4))', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>Your career translation history will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {history.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          style={{
            background: 'var(--bg-card,#111827)',
            border: '1px solid var(--border-default,rgba(255,255,255,0.07))',
            borderLeft: '3px solid #7C3AED',
            borderRadius: 12,
            padding: 16,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s',
            width: '100%',
          }}
          onMouseEnter={(e) => { (e.currentTarget).style.borderLeftColor = '#A78BFA'; (e.currentTarget).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderLeftColor = '#7C3AED'; (e.currentTarget).style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary,#fff)', lineHeight: 1.4 }}>
              {r.currentRole} <span style={{ color: '#7C3AED' }}>→</span> {r.targetRole}
            </span>
            {r.confidenceScore > 0 && (
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#A78BFA', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 999, padding: '2px 8px', flexShrink: 0 }}>
                {r.confidenceScore}%
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'var(--text-muted,rgba(255,255,255,0.3))' }}>{relativeTime(r.createdAt)}</span>
            <RotateCcw size={12} color="rgba(124,58,237,0.6)" />
          </div>
        </button>
      ))}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
export default function PivotPage() {
  const { showToast } = useToast();
  const {
    phase, formData, translationResult, learningPath, history,
    setPhase, setFormData, setResults, setError, setHistory, loadHistoryResult, resetAll,
  } = usePivotStore();

  const [fromHistory, setFromHistory] = React.useState<HistoryRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Load history on mount
  useEffect(() => {
    api.get('/pivot/history')
      .then((r) => {
        const raw = r.data?.data || [];
        const parsed: HistoryRecord[] = raw.map((item: Record<string, unknown>) => {
          let translationResult = item.translationResult as HistoryRecord['translationResult'];
          let learningPath = item.learningPath as HistoryRecord['learningPath'];
          if (typeof item.translatedResume === 'string') {
            try { translationResult = JSON.parse(item.translatedResume as string); } catch {}
          }
          if (typeof item.learningPathJson === 'string') {
            try { learningPath = JSON.parse(item.learningPathJson as string); } catch {}
          }
          return {
            id: item.id as string,
            currentRole: item.currentRole as string,
            targetRole: item.targetRole as string,
            targetIndustry: (item.targetIndustry as string) || '',
            confidenceScore: (item.confidenceScore as number) || 0,
            createdAt: item.createdAt as string,
            translationResult,
            learningPath,
          };
        });
        setHistory(parsed);
      })
      .catch(() => {});
  }, [setHistory]);

  const handleSubmit = useCallback(async () => {
    setPhase('loading');
    setFromHistory(null);
    try {
      const translateRes = await api.post('/pivot/translate', {
        resumeText:        formData.resumeText,
        currentRole:       formData.currentRole,
        targetRole:        formData.targetRole,
        targetIndustry:    formData.targetIndustry,
        additionalContext: formData.additionalContext,
      });
      const translationResult = translateRes.data.data;

      const lpRes = await api.post('/pivot/learning-path', {
        currentSkills: formData.currentRole,
        targetRole:    formData.targetRole,
        targetIndustry: formData.targetIndustry,
        translationResult,
      });
      const learningPath = lpRes.data.data;

      setResults(translationResult, learningPath);

      // Refresh history
      api.get('/pivot/history')
        .then((r) => setHistory(r.data?.data || []))
        .catch(() => {});

      showToast('Translation complete! Reviewing your results.', 'success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Translation failed. Please try again.';
      setError(msg);
      setPhase('input');
      showToast(msg, 'error');
    }
  }, [formData, setPhase, setResults, setError, setHistory, showToast]);

  const handleSelectHistory = (r: HistoryRecord) => {
    loadHistoryResult(r);
    setFromHistory(r);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* History Drawer */}
      <HistoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Translation History"
        accentColor="#7C3AED"
      >
        <PivotHistoryContent history={history} onSelect={handleSelectHistory} />
      </HistoryDrawer>

      <div style={{ flex: 1 }}>
        {/* Page header row — with History button */}
        {phase !== 'loading' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 36, padding: '0 14px',
                background: 'none',
                border: '1px solid var(--border-default,rgba(255,255,255,0.08))',
                borderRadius: 8, cursor: 'pointer',
                fontFamily: 'Inter,sans-serif', fontSize: 13,
                color: '#7C3AED',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(124,58,237,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = 'none'; }}
            >
              <Clock size={14} />
              History
              {history.length > 0 && (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#A78BFA', background: 'rgba(124,58,237,0.15)', borderRadius: 999, padding: '1px 6px', marginLeft: 2 }}>
                  {history.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Viewing-history banner */}
        {phase === 'results' && fromHistory && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px 10px 0 0', padding: '8px 16px', marginBottom: 0,
          }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              Viewing saved translation from {new Date(fromHistory.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button onClick={() => { resetAll(); setFromHistory(null); }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '3px 10px' }}>
              Run New Translation
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {phase === 'input' && (
              <InputPhase
                formData={formData}
                onChange={(d) => setFormData(d)}
                onSubmit={handleSubmit}
              />
            )}
            {phase === 'loading' && <LoadingPhase />}
            {phase === 'results' && translationResult && learningPath && (
              <ResultsPhase
                result={translationResult}
                lp={learningPath}
                currentRole={formData.currentRole}
                targetRole={formData.targetRole}
                onReset={() => { resetAll(); setFromHistory(null); }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
