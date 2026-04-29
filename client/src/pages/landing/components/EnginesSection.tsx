import React from 'react';
import { motion } from 'framer-motion';

// ── ENGINE A: Terminal mockup ──────────────────────────────────────
const TerminalMockup: React.FC = () => (
  <div
    className="rounded-2xl overflow-hidden flex-shrink-0 w-full max-w-md"
    style={{
      background: '#0A0D18',
      border: '1px solid rgba(124,58,237,0.2)',
      boxShadow: '0 0 0 1px rgba(124,58,237,0.08), 0 24px 64px rgba(0,0,0,0.5)',
    }}
  >
    {/* Title bar */}
    <div
      className="flex items-center gap-2 px-4 py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      <span
        className="ml-2 text-white/25"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
      >
        cite — pivot-translator
      </span>
    </div>

    <div className="p-5 flex flex-col gap-4">
      {/* BEFORE */}
      <div>
        <p
          className="mb-2"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ▸ BEFORE
        </p>
        <div
          className="rounded-lg p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Managed classroom of 28 students.{'\n'}
            Developed lesson plans and curricula.{'\n'}
            Coordinated with parents and admin staff.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(124,58,237,0.25)' }} />
        <span
          className="px-2.5 py-0.5 rounded-full"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#A78BFA',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            letterSpacing: '0.1em',
          }}
        >
          ✦ TRANSLATED
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(124,58,237,0.25)' }} />
      </div>

      {/* AFTER */}
      <div>
        <p
          className="mb-2"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: '#A78BFA',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          ▸ AFTER
        </p>
        <div
          className="rounded-lg p-3"
          style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#C4B5FD', lineHeight: 1.7 }}>
            Led cross-functional stakeholder program{'\n'}
            serving 28 direct reports. Designed{'\n'}
            scalable L&D frameworks and drove{'\n'}
            multi-channel stakeholder engagement.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span style={{ color: '#10B981', fontSize: 11 }}>✓</span>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(16,185,129,0.7)' }}>
            Tech PM dialect · 94% match score
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ── ENGINE B: Chat mockup ──────────────────────────────────────────
const ChatMockup: React.FC = () => (
  <div
    className="rounded-2xl overflow-hidden flex-shrink-0 w-full max-w-md"
    style={{
      background: '#0A0D18',
      border: '1px solid rgba(217,119,6,0.2)',
      boxShadow: '0 0 0 1px rgba(217,119,6,0.08), 0 24px 64px rgba(0,0,0,0.5)',
    }}
  >
    {/* Title bar */}
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
      </div>
      <span
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}
      >
        copilot — salary-negotiation
      </span>
      <div
        className="px-2 py-0.5 rounded-full"
        style={{
          background: 'rgba(217,119,6,0.15)',
          border: '1px solid rgba(217,119,6,0.3)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9,
          color: '#FCD34D',
          letterSpacing: '0.08em',
        }}
      >
        LIVE ROLEPLAY
      </div>
    </div>

    <div className="p-5 flex flex-col gap-3">
      {/* Persona label */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
          style={{ background: 'rgba(217,119,6,0.2)', color: '#FCD34D' }}
        >
          B
        </div>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          Boss persona · Hostile · Budget-focused
        </span>
      </div>

      {/* Chat bubbles */}
      <div className="flex flex-col gap-3">
        {/* You */}
        <div className="flex justify-end">
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]"
            style={{
              background: 'rgba(99,102,241,0.2)',
              border: '1px solid rgba(99,102,241,0.3)',
            }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              I've been here 3 years and my market rate is 40% higher than my current comp...
            </p>
          </div>
        </div>

        {/* AI boss */}
        <div className="flex justify-start">
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]"
            style={{
              background: 'rgba(217,119,6,0.1)',
              border: '1px solid rgba(217,119,6,0.2)',
            }}
          >
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              The budget is frozen company-wide. Everyone's in the same boat. We can revisit this in Q3.
            </p>
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: 'rgba(217,119,6,0.2)', color: '#FCD34D' }}
          >
            C
          </div>
          <div
            className="rounded-2xl rounded-tl-sm px-4 py-2.5 flex items-center gap-1.5"
            style={{
              background: 'rgba(217,119,6,0.08)',
              border: '1px solid rgba(217,119,6,0.15)',
            }}
          >
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#FCD34D' }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, delay, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
            CITE analyzing response...
          </span>
        </div>
      </div>

      {/* Tone meter */}
      <div
        className="rounded-lg p-3 mt-1"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tone Calibration
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#FCD34D' }}>
            Assertive · Non-confrontational
          </span>
        </div>
        <div className="w-full h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #D97706, #FCD34D)', width: '68%' }}
            initial={{ width: 0 }}
            whileInView={{ width: '68%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  </div>
);

// ── ENGINE C: Score display ────────────────────────────────────────
const RadarMockup: React.FC = () => {
  const alerts = [
    { color: '#EF4444', dot: '#EF4444', text: '"Optimization" used 3× in last earnings call' },
    { color: '#F59E0B', dot: '#F59E0B', text: 'React skills — 18mo before commoditization' },
    { color: '#10B981', dot: '#10B981', text: 'Upskill pathway ready: 3 micro-certs identified' },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden flex-shrink-0 w-full max-w-md"
      style={{
        background: '#0A0D18',
        border: '1px solid rgba(8,145,178,0.2)',
        boxShadow: '0 0 0 1px rgba(8,145,178,0.08), 0 24px 64px rgba(0,0,0,0.5)',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span
          className="ml-2 text-white/25"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
        >
          cite — job-radar
        </span>
        <div
          className="ml-auto px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(8,145,178,0.15)',
            border: '1px solid rgba(8,145,178,0.3)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            color: '#22D3EE',
            letterSpacing: '0.08em',
          }}
        >
          ● LIVE
        </div>
      </div>

      <div className="p-5 flex flex-col items-center gap-5">
        {/* Score gauge (SVG arc) */}
        <div className="relative">
          <svg width={160} height={100} viewBox="0 0 160 100">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891B2" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            {/* Track */}
            <path
              d="M 16 88 A 64 64 0 0 1 144 88"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Fill — 74/100 of arc */}
            <motion.path
              d="M 16 88 A 64 64 0 0 1 144 88"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="201 201"
              initial={{ strokeDashoffset: 201 }}
              whileInView={{ strokeDashoffset: 201 * (1 - 0.74) }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Glow dot at end */}
          </svg>
          {/* Score number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <motion.span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 36,
                fontWeight: 700,
                color: '#22D3EE',
                lineHeight: 1,
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              74
            </motion.span>
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              Security Score
            </span>
          </div>
        </div>

        {/* Alert rows */}
        <div className="w-full flex flex-col gap-2">
          {alerts.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: a.dot, boxShadow: `0 0 6px ${a.dot}60` }}
              />
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                }}
              >
                {a.text}
              </p>
            </motion.div>
          ))}
        </div>

        <div
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg"
          style={{ background: 'rgba(8,145,178,0.08)', border: '1px solid rgba(8,145,178,0.2)' }}
        >
          <span style={{ color: '#22D3EE', fontSize: 12 }}>⬇</span>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: '#22D3EE',
              letterSpacing: '0.06em',
            }}
          >
            Score updated 4 minutes ago
          </span>
        </div>
      </div>
    </div>
  );
};

// ── Main Section ───────────────────────────────────────────────────
interface Engine {
  id: string;
  label: string;
  title: string;
  description: string;
  pills: string[];
  cta: string;
  ctaColor: string;
  bg: string;
  border: string;
  accent: string;
  mockup: React.ReactNode;
  flip: boolean;
}

const engines: Engine[] = [
  {
    id: 'a',
    label: 'ENGINE A',
    title: 'Career Pivot Translator',
    description:
      'Your barista experience is your operations expertise. Your teaching career is your L&D leadership. CITE speaks the exact dialect of your target industry — and rewrites your entire professional identity to match.',
    pills: ['Resume Rewrite', 'Skill Gap Analysis', 'Learning Pathway', 'Industry Dialect Engine'],
    cta: 'Translate your career →',
    ctaColor: '#A78BFA',
    bg: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(13,18,32,0) 60%)',
    border: 'rgba(124,58,237,0.2)',
    accent: '#A78BFA',
    mockup: <TerminalMockup />,
    flip: false,
  },
  {
    id: 'b',
    label: 'ENGINE B',
    title: 'Conversation Copilot',
    description:
      'Stop rehearsing alone at midnight. CITE scripts your salary negotiation, your resignation, your co-founder confrontation — then lets you practice it live against an AI persona trained to push back exactly like the real person would.',
    pills: ['Script Generation', 'Tone Calibration', 'Live Roleplay Simulator', 'Emotional Buffer'],
    cta: 'Script your conversation →',
    ctaColor: '#FCD34D',
    bg: 'linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(13,18,32,0) 60%)',
    border: 'rgba(217,119,6,0.2)',
    accent: '#FCD34D',
    mockup: <ChatMockup />,
    flip: true,
  },
  {
    id: 'c',
    label: 'ENGINE C',
    title: 'Job Security Radar',
    description:
      'By the time the restructuring email arrives, CITE already knew. Real-time monitoring of your employer\'s signals, your industry\'s shifts, and your skillset\'s decay rate — rendered as a single, actionable survivability score.',
    pills: ['Layoff Signal Detection', 'Job Security Score', 'Skill Decay Tracker', 'Euphemism Decoder'],
    cta: 'Scan your position →',
    ctaColor: '#22D3EE',
    bg: 'linear-gradient(135deg, rgba(8,145,178,0.08) 0%, rgba(13,18,32,0) 60%)',
    border: 'rgba(8,145,178,0.2)',
    accent: '#22D3EE',
    mockup: <RadarMockup />,
    flip: false,
  },
];

export const EnginesSection: React.FC = () => {
  return (
    <section
      id="the-engines"
      className="py-28 md:py-36 px-6 cite-surface"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: '#6366F1',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          The Engines
        </motion.p>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-white mb-16 md:mb-20"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(28px, 4vw, 48px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}
        >
          Three systems.{' '}
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>One survival platform.</span>
        </motion.h2>

        {/* Engine cards */}
        <div className="flex flex-col gap-6">
          {engines.map((engine, idx) => (
            <motion.div
              key={engine.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.005, transition: { duration: 0.2 } }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: engine.bg,
                border: `1px solid ${engine.border}`,
              }}
            >
              <div
                className={`flex flex-col ${engine.flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 p-8 md:p-10 lg:p-12 items-center`}
              >
                {/* Content */}
                <div className="flex-1 flex flex-col gap-5">
                  {/* Engine label */}
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      color: engine.accent,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {engine.label}
                  </span>

                  {/* Title */}
                  <h3
                    className="font-black text-white"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'clamp(24px, 3vw, 36px)',
                      letterSpacing: '-0.025em',
                      lineHeight: 1.15,
                    }}
                  >
                    {engine.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.75,
                      maxWidth: 480,
                    }}
                  >
                    {engine.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2">
                    {engine.pills.map((pill) => (
                      <div
                        key={pill}
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          background: `${engine.accent}12`,
                          border: `1px solid ${engine.accent}25`,
                          color: engine.accent,
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        {pill}
                      </div>
                    ))}
                  </div>

                  {/* CTA link */}
                  <a
                    href="/auth/signup"
                    className="inline-flex items-center text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{
                      color: engine.ctaColor,
                      fontFamily: 'Inter, sans-serif',
                      marginTop: 4,
                    }}
                  >
                    {engine.cta}
                  </a>
                </div>

                {/* Mockup */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                  {engine.mockup}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
