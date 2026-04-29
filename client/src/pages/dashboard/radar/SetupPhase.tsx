import React from 'react';
import { RadarProfileInput } from '@/store/radarStore';
import { SkillTagInput } from '@/components/ui/SkillTagInput';

const C = '#22D3EE';
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Consulting', 'Marketing', 'Product Management', 'Data & Analytics', 'Education', 'Legal', 'Manufacturing', 'Retail', 'Media', 'Other'];

export const SetupPhase: React.FC<{
  profileData: RadarProfileInput;
  onChange: (d: Partial<RadarProfileInput>) => void;
  onSubmit: () => void;
}> = ({ profileData, onChange, onSubmit }) => {
  const isDisabled = !profileData.jobTitle.trim() || !profileData.industry || profileData.skills.length === 0;

  const inp: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 14px 0 38px', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: '#fff',
    fontFamily: 'Inter,sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const sel: React.CSSProperties = { ...inp, padding: '0 14px', appearance: 'none', cursor: 'pointer' };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: C, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Engine C</p>
        <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 38, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>Job Security Radar</h1>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.45)', margin: 0 }}>Know before the email arrives.</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {['Profile', 'Scanning', 'Intelligence'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? C : 'transparent', border: `2px solid ${i === 0 ? C : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 11, color: i === 0 ? '#000' : 'rgba(255,255,255,0.3)' }}>{i + 1}</div>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 12px' }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 20 }}>
        {/* LEFT */}
        <div style={{ background: '#0D1220', border: `1px solid rgba(8,145,178,0.25)`, borderRadius: 16, padding: 26, boxShadow: '0 0 32px rgba(8,145,178,0.06)' }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: C, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Your Professional Profile</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>💼</span>
              <input style={inp} placeholder="Current Job Title  e.g. Senior Product Manager" value={profileData.jobTitle} onChange={(e) => onChange({ jobTitle: e.target.value })} />
            </div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🏢</span>
              <input style={inp} placeholder="Employer  e.g. Salesforce, JPMorgan, or 'Small startup'" value={profileData.employer} onChange={(e) => onChange({ employer: e.target.value })} />
            </div>
            <select value={profileData.industry} onChange={(e) => onChange({ industry: e.target.value })} style={sel}>
              <option value="">Select Industry</option>
              {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13 }}>📅</span>
                <input style={inp} type="number" placeholder="Years Experience" value={profileData.yearsExperience} onChange={(e) => onChange({ yearsExperience: e.target.value })} />
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13 }}>📍</span>
                <input style={inp} placeholder="Location  e.g. New York, NY" value={profileData.location} onChange={(e) => onChange({ location: e.target.value })} />
              </div>
            </div>

            {/* Skill tag input */}
            <div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Your Current Skills <span style={{ color: C, fontWeight: 600 }}>*</span></p>
              <SkillTagInput skills={profileData.skills} onChange={(skills) => onChange({ skills })} />
            </div>

            {/* Daily tasks */}
            <div>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Daily Tasks Description</p>
              <textarea value={profileData.dailyTasks} onChange={(e) => onChange({ dailyTasks: e.target.value })}
                placeholder={`Describe what you actually do day-to-day. Be specific.\ne.g. 'I write SQL queries to pull data, build Excel reports for leadership, sit in client meetings, manage a team of 4 analysts...'`}
                style={{ ...inp, height: 120, padding: '12px 14px', resize: 'vertical', lineHeight: 1.6 }} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>What We Monitor</p>
            <style>{`@keyframes radarPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.3}}`}</style>
            {[
              'Employer news & press releases',
              'Industry M&A and restructuring activity',
              'LinkedIn hiring pattern shifts',
              'AI capability advancement tracking',
            ].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', flexShrink: 0, animation: 'radarPulse 2s ease-in-out infinite' }} />
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{label}</p>
              </div>
            ))}

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 16, paddingTop: 16 }}>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Threat Intelligence Includes</p>
              {[['⚡', 'Real-time news analysis for your employer'], ['🔍', 'Corporate euphemism decoder'], ['📊', 'AI displacement risk modeling'], ['🎯', 'Personalized upskill pathway generation']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>{icon}</span>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live ticker */}
          <div style={{ background: '#0D1220', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 14, overflow: 'hidden' }}>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Live Intelligence Feed</p>
            <div style={{ height: 32, overflow: 'hidden', position: 'relative', background: '#080B14', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
              <style>{`@keyframes tickerScroll{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}`}</style>
              <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'rgba(0,209,220,0.6)', whiteSpace: 'nowrap', animation: 'tickerScroll 20s linear infinite', position: 'absolute', top: '50%', transform: 'translateY(-50%)', margin: 0 }}>
                THREAT SIGNAL: Microsoft announces 'workforce optimization' · UPSKILL ALERT: Prompt Engineering demand +340% YoY · INDUSTRY SHIFT: 67% of finance firms deploying AI analysts · SIGNAL DETECTED: Adobe hiring freeze in design division · AI ADOPTION: 42% of routine tasks now automated at enterprise level ·
              </p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onSubmit} disabled={isDisabled}
        className="radar-submit-btn"
        style={{ width: '100%', height: 56, marginTop: 20, background: isDisabled ? 'rgba(8,145,178,0.3)' : 'linear-gradient(135deg,#0891B2,#22D3EE)', border: 'none', borderRadius: 12, cursor: isDisabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 15, color: isDisabled ? 'rgba(255,255,255,0.4)' : '#000', opacity: isDisabled ? 0.5 : 1, boxShadow: isDisabled ? 'none' : '0 8px 32px rgba(8,145,178,0.35)', transition: 'all 0.2s' }}>
        📡 Initialize Radar Scan →
      </button>
    </div>
  );
};
