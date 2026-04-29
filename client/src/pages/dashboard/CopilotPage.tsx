import React, { useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCopilotStore, RoleplayMessage, CopilotHistoryRecord } from '@/store/copilotStore';
import { useToast } from '@/components/ui/Toast';
import { Clock, MessageSquare, RotateCcw } from 'lucide-react';
import { HistoryDrawer } from '@/components/ui/HistoryDrawer';
import api from '@/lib/api';
import { relativeTime } from '@/lib/relativeTime';
import { SetupPhase } from './copilot/SetupPhase';
import { ScriptLoading, ScriptPhase } from './copilot/ScriptPhase';
import { RoleplayPhase } from './copilot/RoleplayPhase';
import { AnalysisPhase, AnalysisLoading } from './copilot/AnalysisPhase';

// ── Scenario emoji map ────────────────────────────────────────────
const SCENARIO_EMOJI: Record<string, string> = {
  'Salary Negotiation':        '💰',
  'Resignation':               '🚪',
  'Difficult Feedback':        '💬',
  'Co-founder Confrontation':  '🤝',
  'Boundary Setting':          '🛑',
  'Client Conflict':           '⚡',
  'Performance Review':        '📊',
  'Promotion Request':         '🚀',
};
function scenarioEmoji(type: string) {
  for (const [k, v] of Object.entries(SCENARIO_EMOJI)) {
    if (type.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return '💬';
}


// ── History Drawer Content ────────────────────────────────────────
const CopilotHistoryContent: React.FC<{
  history: CopilotHistoryRecord[];
  onSelect: (r: CopilotHistoryRecord) => void;
}> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: 12 }}>
        <MessageSquare size={32} color="#D97706" style={{ opacity: 0.6 }} />
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text-primary,#fff)', margin: 0, textAlign: 'center' }}>No scripts generated yet.</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'var(--text-muted,rgba(255,255,255,0.4))', margin: 0, textAlign: 'center', lineHeight: 1.5 }}>Your conversation scripts will appear here.</p>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {history.map((r) => {
        const score = r.confidenceScore || (r.scriptResult as any)?.confidenceScore;
        return (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            style={{
              background: 'var(--bg-card,#111827)',
              border: '1px solid var(--border-default,rgba(255,255,255,0.07))',
              borderLeft: '3px solid #D97706',
              borderRadius: 12, padding: 16,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s', width: '100%',
            }}
            onMouseEnter={(e) => { (e.currentTarget).style.borderLeftColor = '#F59E0B'; (e.currentTarget).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget).style.borderLeftColor = '#D97706'; (e.currentTarget).style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary,#fff)', lineHeight: 1.4 }}>
                {r.scenarioType ? `${scenarioEmoji(r.scenarioType)} ${r.scenarioType}` : '💬 Conversation'}
              </span>
              {score != null && (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#D97706', background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 999, padding: '2px 8px', flexShrink: 0 }}>
                  {score}%
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'var(--text-muted,rgba(255,255,255,0.3))' }}>{relativeTime(r.createdAt)}</span>
              <RotateCcw size={12} color="rgba(217,119,6,0.6)" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────
export default function CopilotPage() {
  const { showToast } = useToast();
  const {
    phase, formData, scriptResult, messages, difficultyLevel, suggestions,
    analysisResult, sessionStart, isAITyping, history, isFromHistory,
    setPhase, setFormData, setScriptResult, addMessage, setDifficulty,
    setSuggestions, setAITyping, setAnalysisResult, startSession,
    setError, resetAll, resetToScript, resetToRoleplay, setHistory, loadFromHistory,
  } = useCopilotStore();

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Load history on mount
  useEffect(() => {
    api.get('/copilot/history')
      .then((r) => {
        const raw = r.data?.data || [];
        // Parse scriptResult from messages field if stored as JSON
        const parsed: CopilotHistoryRecord[] = raw.map((item: Record<string, unknown>) => {
          let scriptResult = null;
          try {
            if (typeof item.messages === 'string') {
              const parsed = JSON.parse(item.messages as string);
              if (parsed?.scriptResult) scriptResult = parsed.scriptResult;
            }
          } catch {}
          return {
            id: item.id as string,
            scenarioType: item.scenario as string || '',
            createdAt: item.createdAt as string,
            scriptResult,
            confidenceScore: scriptResult?.confidenceScore,
          };
        });
        setHistory(parsed);
      })
      .catch(() => {});
  }, [setHistory]);

  // ── Phase 1 → generate script ──────────────────────────────────
  const handleGenerateScript = useCallback(async () => {
    setPhase('loading-script');
    try {
      const res = await api.post('/copilot/generate-script', {
        scenarioType:            formData.scenarioType,
        rawContext:              formData.rawContext,
        desiredTone:             formData.desiredTone,
        nonNegotiables:          formData.nonNegotiables,
        relationshipPreservation: formData.relationshipPreservation,
        counterpartyDescription: formData.counterpartyDescription,
      });
      setScriptResult(res.data.data);
      showToast('Script ready — review your conversation brief', 'success');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Script generation failed';
      setError(msg);
      setPhase('setup');
      showToast(msg, 'error');
    }
  }, [formData, setPhase, setScriptResult, setError, showToast]);

  // ── Phase 2 → start roleplay ───────────────────────────────────
  const handleStartRoleplay = useCallback(async () => {
    startSession();
    setAITyping(true);
    try {
      const res = await api.post('/copilot/roleplay-message', {
        conversationHistory: [],
        personaDescription: formData.counterpartyDescription || 'a professional counterparty',
        scenarioContext: `${formData.scenarioType}: ${formData.rawContext.slice(0, 300)}`,
        difficultyLevel,
        userObjective: formData.nonNegotiables || formData.rawContext.slice(0, 100),
      });
      const { text, signal, suggestions: sug } = res.data.data;
      addMessage({ role: 'assistant', content: text, signal, timestamp: Date.now() });
      setSuggestions(sug || []);
    } catch {
      addMessage({ role: 'assistant', content: "Let's get into it. What did you want to discuss?", signal: 'neutral', timestamp: Date.now() });
    } finally {
      setAITyping(false);
    }
  }, [formData, difficultyLevel, startSession, addMessage, setSuggestions, setAITyping]);

  // ── Roleplay send ──────────────────────────────────────────────
  const handleSendMessage = useCallback(async (text: string) => {
    const userMsg: RoleplayMessage = { role: 'user', content: text, timestamp: Date.now() };
    addMessage(userMsg);
    setAITyping(true);
    setSuggestions([]);
    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
    try {
      const res = await api.post('/copilot/roleplay-message', {
        conversationHistory: history,
        personaDescription: formData.counterpartyDescription || 'a professional counterparty',
        scenarioContext: `${formData.scenarioType}: ${formData.rawContext.slice(0, 300)}`,
        difficultyLevel,
        userObjective: formData.nonNegotiables || formData.rawContext.slice(0, 100),
      });
      const { text: aiText, signal, suggestions: sug } = res.data.data;
      addMessage({ role: 'assistant', content: aiText, signal, timestamp: Date.now() });
      setSuggestions(sug || []);
    } catch {
      addMessage({ role: 'assistant', content: 'I need a moment to think about that...', signal: 'neutral', timestamp: Date.now() });
    } finally {
      setAITyping(false);
    }
  }, [messages, formData, difficultyLevel, addMessage, setSuggestions, setAITyping]);

  // ── End session ────────────────────────────────────────────────
  const handleEndSession = useCallback(async () => {
    if (messages.length < 2) { showToast('Have at least one exchange before ending the session', 'info'); return; }
    setPhase('loading-analysis');
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await api.post('/copilot/analyze-roleplay', {
        conversationHistory: history,
        userObjective: formData.nonNegotiables || formData.rawContext.slice(0, 150),
        scenarioType: formData.scenarioType,
      });
      setAnalysisResult(res.data.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Analysis failed';
      setError(msg);
      setPhase('roleplay');
      showToast(msg, 'error');
    }
  }, [messages, formData, setPhase, setAnalysisResult, setError, showToast]);

  const showHistoryBtn = phase !== 'loading-script' && phase !== 'loading-analysis' && phase !== 'roleplay';

  return (
    <>
      <HistoryDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Script History"
        accentColor="#D97706"
      >
        <CopilotHistoryContent
          history={history}
          onSelect={(r) => { loadFromHistory(r); setDrawerOpen(false); }}
        />
      </HistoryDrawer>

      <div style={{ flex: 1 }}>
        {/* History button */}
        {showHistoryBtn && (
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
                color: '#D97706', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(217,119,6,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = 'none'; }}
            >
              <Clock size={14} />
              History
              {history.length > 0 && (
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#F59E0B', background: 'rgba(217,119,6,0.15)', borderRadius: 999, padding: '1px 6px', marginLeft: 2 }}>
                  {history.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Viewing-history banner */}
        {isFromHistory && (phase === 'script') && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '8px 16px', borderRadius: '10px 10px 0 0', marginBottom: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Viewing saved script</span>
            <button onClick={resetAll} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', padding: '3px 10px' }}>New Script</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: phase === 'roleplay' ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {phase === 'setup' && (
              <SetupPhase formData={formData} onChange={(d) => setFormData(d)} onSubmit={handleGenerateScript} />
            )}
            {phase === 'loading-script' && <ScriptLoading />}
            {phase === 'script' && scriptResult && (
              <ScriptPhase result={scriptResult} onStartRoleplay={handleStartRoleplay} onNew={resetAll} />
            )}
            {phase === 'roleplay' && (
              <RoleplayPhase
                messages={messages} isAITyping={isAITyping}
                difficultyLevel={difficultyLevel} suggestions={suggestions}
                scriptResult={scriptResult}
                counterpartyDescription={formData.counterpartyDescription}
                scenarioContext={`${formData.scenarioType}: ${formData.rawContext.slice(0, 200)}`}
                userObjective={formData.nonNegotiables || formData.rawContext.slice(0, 100)}
                sessionStart={sessionStart}
                onSend={handleSendMessage}
                onDifficultyChange={(d) => setDifficulty(d as 'cooperative' | 'neutral' | 'resistant' | 'hostile')}
                onEndSession={handleEndSession}
                onBack={resetToScript}
              />
            )}
            {phase === 'loading-analysis' && <AnalysisLoading />}
            {phase === 'analysis' && analysisResult && (
              <AnalysisPhase result={analysisResult} onPracticeAgain={resetToRoleplay} onEditScript={resetToScript} onDone={resetAll} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
