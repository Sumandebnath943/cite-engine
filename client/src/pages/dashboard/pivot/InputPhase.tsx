import React from 'react';

const EXAMPLES = [
  { tag: 'Teaching → Product Management', before: 'Managed classroom of 28 students', after: 'Led cross-functional team of 28 stakeholders to deliver curriculum roadmap on time' },
  { tag: 'Nursing → Healthcare Tech', before: 'Administered medication to 15 patients per shift', after: 'Managed clinical workflows for 15+ patient cases, ensuring 100% protocol compliance' },
  { tag: 'Military → Operations', before: 'Led squad of 12 soldiers in field operations', after: 'Directed 12-person cross-functional team executing high-stakes operational missions' },
];

export const InputPhase: React.FC<{
  formData: { resumeText: string; currentRole: string; targetRole: string; targetIndustry: string; additionalContext: string };
  onChange: (d: Record<string, string>) => void;
  onSubmit: () => void;
}> = ({ formData, onChange, onSubmit }) => {
  const [exIdx, setExIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setExIdx((i) => (i + 1) % EXAMPLES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const industries = ['Technology', 'Finance', 'Healthcare', 'Consulting', 'Marketing', 'Product Management', 'Data & Analytics', 'Education', 'Legal', 'Other'];
  const isDisabled = !formData.resumeText.trim() || !formData.currentRole.trim() || !formData.targetRole.trim() || !formData.targetIndustry;

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px 0 40px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: 14,
    outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#A78BFA', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Engine A</p>
        <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>Career Pivot Translator</h1>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Paste your experience. We'll rebuild your identity.</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40 }}>
        {['Input', 'Translating', 'Results'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#7C3AED' : 'transparent', border: `2px solid ${i === 0 ? '#7C3AED' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 12, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{i + 1}</div>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 16px' }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Two-column form */}
      <div style={{ display: 'grid', gridTemplateColumns: '60fr 40fr', gap: 24 }}>
        {/* LEFT */}
        <div style={{ background: '#0D1220', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: 28, boxShadow: '0 0 40px rgba(124,58,237,0.08)' }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Your Current Identity</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Current Role */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>💼</span>
              <input style={inputStyle} placeholder="Current Job Title  e.g. High School English Teacher" value={formData.currentRole} onChange={(e) => onChange({ currentRole: e.target.value })} />
            </div>
            {/* Target Role */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>🎯</span>
              <input style={inputStyle} placeholder="Target Role  e.g. UX Content Strategist" value={formData.targetRole} onChange={(e) => onChange({ targetRole: e.target.value })} />
            </div>
            {/* Industry */}
            <select
              value={formData.targetIndustry}
              onChange={(e) => onChange({ targetIndustry: e.target.value })}
              style={{ ...inputStyle, padding: '0 14px', appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select Target Industry</option>
              {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            {/* Resume textarea */}
            <div style={{ position: 'relative' }}>
              <textarea
                value={formData.resumeText}
                onChange={(e) => onChange({ resumeText: e.target.value.slice(0, 5000) })}
                placeholder="Paste your resume text here, or describe your daily responsibilities, achievements, and the tasks you perform regularly. The more detail you provide, the more powerful the translation."
                style={{ ...inputStyle, height: 220, padding: '14px 14px 28px', resize: 'vertical', lineHeight: 1.6 }}
              />
              <span style={{ position: 'absolute', bottom: 8, right: 12, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{formData.resumeText.length} / 5000</span>
            </div>
            {/* Additional context */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Additional Context</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', borderRadius: 4, padding: '2px 6px' }}>OPTIONAL</span>
              </div>
              <textarea
                value={formData.additionalContext}
                onChange={(e) => onChange({ additionalContext: e.target.value })}
                placeholder="Any specific achievements, projects, or context you want CITE to emphasize in the translation?"
                style={{ ...inputStyle, height: 100, padding: '12px 14px', resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT — context panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>What CITE Analyzes</p>
            {[
              { icon: '🔍', text: 'Industry-specific power verbs and terminology' },
              { icon: '📊', text: 'Quantifiable impact metrics standard in target field' },
              { icon: '🧠', text: 'Hidden transferable skills you\'re not aware of' },
              { icon: '🎯', text: 'Hiring manager expectations in your target industry' },
            ].map((pt) => (
              <div key={pt.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{pt.icon}</span>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>{pt.text}</p>
              </div>
            ))}
            {/* Tip box */}
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: 14, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>💡</span>
                <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: '#A78BFA' }}>Pro Tip</span>
              </div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, margin: 0 }}>
                Include specific numbers in your experience: class sizes, budgets managed, projects delivered. Numbers translate across every industry.
              </p>
            </div>
          </div>

          {/* Example carousel */}
          <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Translation Examples</p>
            <div style={{ minHeight: 110, transition: 'opacity 0.4s' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 999, padding: '3px 10px', marginBottom: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#A78BFA' }}>{EXAMPLES[exIdx].tag}</span>
              </div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through', marginBottom: 6 }}>{EXAMPLES[exIdx].before}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#A78BFA', fontWeight: 500 }}>{EXAMPLES[exIdx].after}</p>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              {EXAMPLES.map((_, i) => <div key={i} style={{ width: 20, height: 3, borderRadius: 999, background: i === exIdx ? '#7C3AED' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="pivot-submit-btn"
        style={{
          width: '100%', height: 56, marginTop: 24,
          background: isDisabled ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7C3AED,#6366F1)',
          border: 'none', borderRadius: 12, cursor: isDisabled ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 15, color: '#fff',
          opacity: isDisabled ? 0.5 : 1,
          boxShadow: isDisabled ? 'none' : '0 8px 32px rgba(124,58,237,0.3)',
          transition: 'all 0.2s',
        }}
      >
        ⚡ Translate My Identity →
      </button>
    </div>
  );
};
