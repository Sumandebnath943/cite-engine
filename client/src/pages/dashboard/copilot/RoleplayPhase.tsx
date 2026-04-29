import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { RoleplayMessage, ScriptResult } from '@/store/copilotStore';

const G = '#F59E0B';

const SIGNAL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  cooperative: { label: 'Opening up', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  neutral:     { label: 'Holding position', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  resistant:   { label: 'Pushing back', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  hostile:     { label: 'Escalating', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

const DIFFICULTIES = ['cooperative', 'neutral', 'resistant', 'hostile'] as const;

// Session timer
function useTimer(start: number | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [start]);
  const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const s = String(elapsed % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Typing dots
const TypingIndicator: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
    <div style={{ background: '#161F35', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '4px 16px 16px 16px', padding: '12px 18px', display: 'flex', gap: 5, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
      ))}
    </div>
  </div>
);

export const RoleplayPhase: React.FC<{
  messages: RoleplayMessage[];
  isAITyping: boolean;
  difficultyLevel: string;
  suggestions: string[];
  scriptResult: ScriptResult | null;
  counterpartyDescription: string;
  scenarioContext: string;
  userObjective: string;
  sessionStart: number | null;
  onSend: (text: string) => void;
  onDifficultyChange: (d: string) => void;
  onEndSession: () => void;
  onBack: () => void;
}> = ({ messages, isAITyping, difficultyLevel, suggestions, scriptResult, counterpartyDescription, scenarioContext, userObjective, sessionStart, onSend, onDifficultyChange, onEndSession, onBack }) => {
  const [input, setInput] = useState('');
  const [scriptOpen, setScriptOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timer = useTimer(sessionStart);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isAITyping]);

  const handleSend = () => {
    if (!input.trim() || isAITyping) return;
    onSend(input.trim());
    setInput('');
  };

  const avatarInitials = counterpartyDescription.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || 'AI';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', position: 'relative', gap: 0 }}>
      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header bar */}
        <div className="cite-surface" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, flexWrap: 'wrap' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', padding: 0 }}>← Back</button>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: G, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 2px' }}>Roleplay Simulator</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Playing: {counterpartyDescription || 'AI Counterparty'}</p>
          </div>
          {/* Difficulty */}
          <div style={{ display: 'flex', gap: 4 }}>
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => onDifficultyChange(d)}
                style={{ padding: '4px 10px', borderRadius: 999, border: `1px solid ${d === difficultyLevel ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)'}`, background: d === difficultyLevel ? G : 'transparent', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 11, color: d === difficultyLevel ? '#000' : 'rgba(255,255,255,0.5)', fontWeight: d === difficultyLevel ? 700 : 400, textTransform: 'capitalize', transition: 'all 0.15s' }}>
                {d}
              </button>
            ))}
          </div>
          <button onClick={() => setScriptOpen((o) => !o)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>📋 Script</button>
          <button onClick={onEndSession} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#FCA5A5' }}>End Session</button>
        </div>

        {/* Objective bar */}
        <div style={{ background: 'rgba(217,119,6,0.06)', borderBottom: '1px solid rgba(217,119,6,0.1)', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: G, letterSpacing: '0.08em', marginRight: 8 }}>OBJECTIVE:</span>
            {userObjective || scenarioContext}
          </p>
          <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Turn {messages.filter((m) => m.role === 'user').length} / ∞</span>
            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: G }}>{timer}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="cite-page-bg" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 18 }}>
                {msg.role === 'assistant' ? (
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 10, color: '#000', flexShrink: 0 }}>{avatarInitials}</div>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{counterpartyDescription.split(',')[0] || 'Counterparty'}</span>
                    </div>
                    <div className="cite-card" style={{ borderRadius: '4px 16px 16px 16px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.signal && SIGNAL_CONFIG[msg.signal] && (
                        <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: SIGNAL_CONFIG[msg.signal].color, background: SIGNAL_CONFIG[msg.signal].bg, border: `1px solid ${SIGNAL_CONFIG[msg.signal].color}30`, borderRadius: 999, padding: '1px 8px' }}>
                          {SIGNAL_CONFIG[msg.signal].label}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ maxWidth: '65%' }}>
                    <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px 16px 4px 16px', padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#fff', lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                    </div>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right', marginTop: 4 }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isAITyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="cite-surface" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 20px', flexShrink: 0 }}>
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#FCD34D' }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your response... (or click a suggestion above)"
              rows={2}
              style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${input ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '10px 14px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: 14, resize: 'none', outline: 'none', lineHeight: 1.5, transition: 'border 0.2s', maxHeight: 96 }}
            />
            <button onClick={handleSend} disabled={!input.trim() || isAITyping}
              style={{ width: 44, height: 44, borderRadius: '50%', background: input.trim() && !isAITyping ? G : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() && !isAITyping ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
              <Send size={16} color={input.trim() && !isAITyping ? '#000' : 'rgba(255,255,255,0.3)'} />
            </button>
          </div>
        </div>
      </div>

      {/* Script reference panel */}
      <AnimatePresence>
        {scriptOpen && scriptResult && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', flexShrink: 0, background: '#0D1220', borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width: 280, height: '100%', overflowY: 'auto', padding: 16 }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: G, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Script Reference</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: 10, cursor: 'pointer' }} onClick={() => setInput(scriptResult.openingStatement)}>
                  <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: G, marginBottom: 4, textTransform: 'uppercase' }}>Opening</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#fff', lineHeight: 1.5, margin: 0 }}>{scriptResult.openingStatement}</p>
                </div>
                {scriptResult.coreScript.map((beat, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 10, cursor: 'pointer' }} onClick={() => setInput(beat.yourLine)}>
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'uppercase' }}>{beat.beat}</p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{beat.yourLine}</p>
                  </div>
                ))}
                {scriptResult.anticipatedObjections.map((obj, i) => (
                  <div key={i} style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 8, padding: 10, cursor: 'pointer' }} onClick={() => setInput(obj.counterResponse)}>
                    <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#A78BFA', marginBottom: 4, textTransform: 'uppercase' }}>Counter</p>
                    <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, margin: 0 }}>{obj.counterResponse}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
