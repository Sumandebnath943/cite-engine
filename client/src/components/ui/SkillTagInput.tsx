import React, { useState, useRef } from 'react';

const C = '#22D3EE';
const QUICK_SKILLS = ['Excel', 'SQL', 'Python', 'React', 'Project Mgmt', 'Data Analysis', 'Leadership', 'Salesforce'];

interface SkillTagInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
}

export const SkillTagInput: React.FC<SkillTagInputProps> = ({ skills, onChange, maxSkills = 20 }) => {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= maxSkills) return;
    onChange([...skills, trimmed]);
    setInputVal('');
  };

  const removeSkill = (s: string) => onChange(skills.filter((x) => x !== s));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputVal.replace(',', ''));
    } else if (e.key === 'Backspace' && !inputVal && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div>
      {/* Tags + input */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{ minHeight: 52, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, cursor: 'text', transition: 'border 0.2s' }}>
        {skills.map((s) => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(8,145,178,0.12)', border: '1px solid rgba(8,145,178,0.3)', color: C, fontFamily: 'JetBrains Mono,monospace', fontSize: 12, borderRadius: 999, padding: '3px 10px' }}>
            {s}
            <button onClick={(e) => { e.stopPropagation(); removeSkill(s); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,211,238,0.6)', fontSize: 13, padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (inputVal.trim()) addSkill(inputVal); }}
          placeholder={skills.length === 0 ? 'Type a skill and press Enter (e.g. Python, SQL, Project Management...)' : ''}
          style={{ flex: 1, minWidth: 140, background: 'none', border: 'none', outline: 'none', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: 14, padding: '2px 0' }}
        />
      </div>
      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 5, marginBottom: 10 }}>Press Enter or comma to add · {skills.length}/{maxSkills} skills</p>

      {/* Quick-add pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {QUICK_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
          <button key={s} onClick={() => addSkill(s)}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '3px 10px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(34,211,238,0.3)'; (e.currentTarget as HTMLButtonElement).style.color = C; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}>
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
};
