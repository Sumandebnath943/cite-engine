import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const freeFeatures = [
  '3 career pivot analyses / mo',
  '5 conversation scripts / mo',
  '1 radar scan / mo',
  'Basic learning pathways',
];

const proFeatures = [
  'Unlimited career pivot analyses',
  'Unlimited conversation scripts',
  'Live roleplay voice simulator',
  'Real-time radar monitoring',
  'LinkedIn profile rewrite',
  'Corporate euphemism decoder',
  'Priority AI processing',
];

export const PricingSection: React.FC = () => {
  return (
    <section
      id="pricing"
      className="py-24 md:py-32 px-6 cite-surface"
    >
      <div className="max-w-4xl mx-auto">
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
            textAlign: 'center',
          }}
        >
          Pricing
        </motion.p>

        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-white mb-14"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(24px, 3.5vw, 44px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            textAlign: 'center',
          }}
        >
          Built for the professional{' '}
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>who can't afford to lose.</span>
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="flex flex-col gap-6 rounded-2xl p-8"
            style={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div>
              <h3
                className="font-black text-white mb-3"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 24, letterSpacing: '-0.02em' }}
              >
                Analyst
              </h3>
              <div className="flex items-baseline gap-1">
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 36,
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  $0
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  / month
                </span>
              </div>
            </div>

            <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

            <ul className="flex flex-col gap-3">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <Check size={10} strokeWidth={2.5} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link to="/auth/signup">
              <motion.button
                whileHover={{ borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-11 rounded-btn border font-medium transition-all"
                style={{
                  background: 'transparent',
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                }}
              >
                Start Free
              </motion.button>
            </Link>
          </motion.div>

          {/* Pro tier */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              y: -6,
              boxShadow: '0 0 64px rgba(99,102,241,0.2)',
              transition: { duration: 0.2 },
            }}
            className="relative flex flex-col gap-6 rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, #111827, #161F35)',
              border: '1px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 48px rgba(99,102,241,0.12)',
            }}
          >
            {/* Most Popular badge */}
            <div
              className="absolute top-5 right-5 rounded-full px-2.5 py-1"
              style={{
                background: 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.4)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 9,
                color: '#A78BFA',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Most Popular
            </div>

            <div>
              <h3
                className="font-black text-white mb-3"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 28, letterSpacing: '-0.025em' }}
              >
                Operator
              </h3>
              <div className="flex items-baseline gap-1">
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 44,
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.03em',
                  }}
                >
                  $19
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, color: 'rgba(255,255,255,0.7)' }}>
                  .99
                </span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                  / month
                </span>
              </div>
            </div>

            <div className="w-full h-px" style={{ background: 'rgba(99,102,241,0.2)' }} />

            <ul className="flex flex-col gap-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(124,58,237,0.2)',
                      border: '1px solid rgba(124,58,237,0.4)',
                    }}
                  >
                    <Check size={10} strokeWidth={2.5} style={{ color: '#A78BFA' }} />
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link to="/auth/signup">
              <motion.button
                whileHover={{
                  background: '#818CF8',
                  boxShadow: '0 0 32px rgba(99,102,241,0.5)',
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-11 rounded-btn font-semibold transition-all"
                style={{
                  background: '#6366F1',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  boxShadow: '0 0 20px rgba(99,102,241,0.25)',
                }}
              >
                Activate Operator
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
