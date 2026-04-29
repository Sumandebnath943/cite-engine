import React, { useState } from 'react';
import { CopilotFormData } from '@/store/copilotStore';

const SCENARIOS = [
  { id: 'Salary Negotiation', icon: '💰', label: 'Salary Negotiation' },
  { id: 'Resignation', icon: '🚪', label: 'Resignation' },
  { id: 'Co-founder Conflict', icon: '🤝', label: 'Co-founder Conflict' },
  { id: 'Performance Review', icon: '📋', label: 'Performance Review' },
  { id: 'Personal Boundary', icon: '🏠', label: 'Personal Boundary' },
  { id: 'Termination', icon: '✂️', label: 'Termination' },
];

const TONES = [
  { id: 'Direct', icon: '🧊' }, { id: 'Diplomatic', icon: '🤝' },
  { id: 'Assertive', icon: '🔥' }, { id: 'Empathetic', icon: '💙' },
];

const TIPS: Record<string, string> = {
  'Salary Negotiation': 'Anchor high. The first number stated sets the psychological reference point. Lead with market data, not personal need.',
  'Resignation': 'Never resign in anger. Your exit is a business transaction. Preserve the relationship — your industry is smaller than you think.',
  'Co-founder Conflict': 'Separate the person from the problem. Lead with shared goals, not individual grievances.',
  'Performance Review': 'Document everything before this meeting. Specifics beat opinions every time.',
  'Personal Boundary': "You don't need to justify a boundary. State it, don't debate it.",
  'Termination': 'Be direct, brief, and final. Ambiguity is cruel. Clarity is kindness.',
};

function detectSentiment(text: string): { emoji: string; label: string; color: string } {
  const t = text.toLowerCase();
  const frustration = /angry|furious|fed up|sick of|unfair|bullsh|ridiculous|hate|rage|pissed|frustrated/g;
  const anxiety = /worried|afraid|scared|nervous|anxious|fear|hope they|not sure|unsure|terrified/g;
  const assertive = /will|demand|require|non-negotiable|expect|must|absolutely|definitely|certain/g;
  if ((t.match(frustration) || []).length >= 1) return { emoji: '😤', label: 'High frustration detected', color: '#EF4444' };
  if ((t.match(anxiety) || []).length >= 1) return { emoji: '😰', label: 'Anxiety present', color: '#F59E0B' };
  if ((t.match(assertive) || []).length >= 1) return { emoji: '💪', label: 'Assertive tone', color: '#10B981' };
  if (text.trim().length > 20) return { emoji: '😐', label: 'Neutral tone', color: '#6B7280' };
  return { emoji: '💬', label: 'Start typing...', color: '#4B5563' };
}

const G = '#F59E0B'; // gold accent

export const SetupPhase: React.FC<{
  formData: CopilotFormData;
  onChange: (d: Partial<CopilotFormData>) => void;
  onSubmit: () => void;
}> = ({ formData, onChange, onSubmit }) => {
  const [sliderVal, setSliderVal] = useState(formData.relationshipPreservation);
  const sentiment = detectSentiment(formData.rawContext);
  const isDisabled = !formData.scenarioType || !formData.rawContext.trim() || !formData.desiredTone;

  const inp: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px 0 38px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#FCD34D', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Engine B</p>
        <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 38, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>Conversation Copilot</h1>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Tell us what needs to be said. We'll show you how to say it.</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {['Setup', 'Script', 'Roleplay', 'Analysis'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? G : 'transparent', border: `2px solid ${i === 0 ? G : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 11, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{i + 1}</div>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 12px' }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 20 }}>
        {/* LEFT */}
        <div style={{ background: '#0D1220', border: `1px solid rgba(217,119,6,0.25)`, borderRadius: 16, padding: 26, boxShadow: '0 0 32px rgba(217,119,6,0.06)' }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#FCD34D', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>The Situation</p>

          {/* Scenario selector */}
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Scenario Type</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
            {SCENARIOS.map((s) => {
              const sel = formData.scenarioType === s.id;
              return (
                <button key={s.id} onClick={() => onChange({ scenarioType: s.id })}
                  style={{ height: 80, borderRadius: 10, border: `1px solid ${sel ? 'rgba(217,119,6,0.4)' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(217,119,6,0.1)' : 'rgba(255,255,255,0.03)', boxShadow: sel ? '0 0 16px rgba(217,119,6,0.1)' : 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'all 0.15s' }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: sel ? '#FCD34D' : 'rgba(255,255,255,0.6)', fontWeight: sel ? 600 : 400, textAlign: 'center', lineHeight: 1.3 }}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Raw context */}
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>What's going on? <span style={{ color: 'rgba(255,255,255,0.25)' }}>(the emotional dump)</span></p>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <textarea value={formData.rawContext} onChange={(e) => onChange({ rawContext: e.target.value })}
              placeholder={`Describe the situation honestly. Don't filter yourself — include the frustrations, what you actually want, what you're afraid of. CITE will handle the emotional translation.\n\nExample: 'My manager promised me a promotion 8 months ago and keeps delaying it...'`}
              style={{ ...inp, height: 180, padding: '12px 14px', resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          {formData.rawContext.trim().length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Emotional Tone</p>
              <span style={{ background: `${sentiment.color}18`, border: `1px solid ${sentiment.color}40`, borderRadius: 999, padding: '2px 10px', fontFamily: 'Inter,sans-serif', fontSize: 12, color: sentiment.color }}>
                {sentiment.emoji} {sentiment.label}
              </span>
            </div>
          )}

          {/* Counterparty */}
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Who are you talking to?</p>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>👤</span>
            <input style={inp} placeholder="e.g. 'My direct manager Sarah, data-driven but conflict-averse'" value={formData.counterpartyDescription} onChange={(e) => onChange({ counterpartyDescription: e.target.value })} />
          </div>

          {/* Tone */}
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Desired Tone</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {TONES.map((t) => {
              const sel = formData.desiredTone === t.id;
              return (
                <button key={t.id} onClick={() => onChange({ desiredTone: t.id as CopilotFormData['desiredTone'] })}
                  style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${sel ? 'rgba(217,119,6,0.5)' : 'rgba(255,255,255,0.08)'}`, background: sel ? G : 'rgba(255,255,255,0.04)', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: sel ? '#000' : 'rgba(255,255,255,0.6)', fontWeight: sel ? 700 : 400, transition: 'all 0.15s' }}>
                  {t.icon} {t.id}
                </button>
              );
            })}
          </div>

          {/* Non-negotiables */}
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Non-Negotiables</p>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>🛡️</span>
            <input style={inp} placeholder="e.g. 'I need at least 15% raise or I will resign'" value={formData.nonNegotiables} onChange={(e) => onChange({ nonNegotiables: e.target.value })} />
          </div>

          {/* Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Relationship preservation importance</p>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: G, background: 'rgba(245,158,11,0.12)', border: `1px solid rgba(245,158,11,0.3)`, borderRadius: 6, padding: '2px 8px' }}>{sliderVal}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Irrelevant</span>
              <style>{`.gold-slider::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:${G};cursor:pointer;box-shadow:0 0 8px rgba(245,158,11,0.4)}.gold-slider::-webkit-slider-runnable-track{background:rgba(255,255,255,0.08);border-radius:999px;height:4px}`}</style>
              <input type="range" min={0} max={100} value={sliderVal} className="gold-slider"
                onChange={(e) => { const v = +e.target.value; setSliderVal(v); onChange({ relationshipPreservation: v }); }}
                style={{ flex: 1, accentColor: G, cursor: 'pointer' }} />
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Critical</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>How CITE Scripts Your Conversation</p>
            {[['🧠', "Strips emotional bias from your raw context"], ['🎯', "Identifies your core interests vs stated positions"], ['📝', "Generates word-for-word script with psychology notes"], ['🥊', "Prepares you for the top 3 counterarguments"]].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* Scenario tip */}
          <div style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.18)', borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: '#FCD34D' }}>
                {formData.scenarioType ? `${formData.scenarioType} Strategy` : 'Strategy Guidance'}
              </span>
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
              {TIPS[formData.scenarioType] || 'Select a scenario type to see specific strategy guidance.'}
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button onClick={onSubmit} disabled={isDisabled}
        className="copilot-submit-btn"
        style={{ width: '100%', height: 56, marginTop: 20, background: isDisabled ? 'rgba(217,119,6,0.3)' : 'linear-gradient(135deg,#D97706,#F59E0B)', border: 'none', borderRadius: 12, cursor: isDisabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 15, color: isDisabled ? 'rgba(255,255,255,0.5)' : '#000', opacity: isDisabled ? 0.5 : 1, boxShadow: isDisabled ? 'none' : '0 8px 32px rgba(217,119,6,0.3)', transition: 'all 0.2s' }}>
        📄 Generate My Script →
      </button>
    </div>
  );
};
