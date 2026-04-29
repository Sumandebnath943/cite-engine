import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const steps = [
  {
    num: '01',
    title: 'Input Your Context',
    desc: 'Paste your resume, describe your situation, or enter your job title. CITE reads between the lines.',
    color: '#7C3AED',
  },
  {
    num: '02',
    title: 'Engine Activates',
    desc: 'The AI analyzes your professional identity against live market data, industry benchmarks, and communication psychology.',
    color: '#6366F1',
  },
  {
    num: '03',
    title: 'Output Delivered',
    desc: 'A rewritten resume, a scripted conversation, or a threat intelligence report — ready to use.',
    color: '#0891B2',
  },
  {
    num: '04',
    title: 'Stay Protected',
    desc: 'CITE continuously monitors your landscape and updates your risk profile automatically.',
    color: '#22D3EE',
  },
];

// Animated step number counter
const AnimatedNumber: React.FC<{ value: string; color: string; inView: boolean }> = ({ value, color, inView }) => {
  const [display, setDisplay] = useState('00');

  useEffect(() => {
    if (!inView) return;
    const target = parseInt(value);
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setDisplay(String(current).padStart(2, '0'));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 'clamp(36px, 5vw, 56px)',
        fontWeight: 700,
        color,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        opacity: 0.9,
      }}
    >
      {display}
    </span>
  );
};

export const HowItWorksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      ref={sectionRef}
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
          Process
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
            fontSize: 'clamp(28px, 4vw, 44px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
          }}
        >
          From anxiety to action{' '}
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>in minutes.</span>
        </motion.h2>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector line on desktop */}
          <div
            className="hidden lg:block absolute top-[28px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(124,58,237,0.4) 0%, rgba(8,145,178,0.4) 100%)',
            }}
          />
          {/* Dashed overlay */}
          <div
            className="hidden lg:block absolute top-[28px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(255,255,255,0.04) 8px, rgba(255,255,255,0.04) 12px)',
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-4"
              >
                {/* Number + dot */}
                <div className="flex items-start gap-3">
                  <AnimatedNumber value={step.num} color={step.color} inView={isInView} />
                  {/* Connector dot visible on desktop */}
                  <div
                    className="hidden lg:block w-3 h-3 rounded-full mt-3 flex-shrink-0 relative z-10"
                    style={{
                      backgroundColor: step.color,
                      boxShadow: `0 0 10px ${step.color}60`,
                    }}
                  />
                </div>

                {/* Step content */}
                <div className="flex flex-col gap-2">
                  <h3
                    className="font-semibold text-white"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 18,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.7,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>

                {/* Vertical connector for mobile/tablet */}
                {i < steps.length - 1 && (
                  <div
                    className="lg:hidden w-px h-8 ml-6"
                    style={{
                      background: `linear-gradient(180deg, ${step.color}40, ${steps[i + 1].color}40)`,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
