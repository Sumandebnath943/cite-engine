import React from 'react';
import { motion } from 'framer-motion';

const cards = [
  {
    icon: '🔄',
    stat: '87% of career pivoters',
    text: 'Are rejected not because they lack the skills — but because their resume speaks the wrong industry dialect. They\'re fluent in the wrong language.',
    accent: '#7C3AED',
    accentLabel: 'Career Translation',
  },
  {
    icon: '😰',
    stat: 'The night before the conversation',
    text: 'Most professionals rehearse salary negotiations, resignations, and confrontations alone — in their heads — at 2AM. There is no preparation infrastructure.',
    accent: '#F59E0B',
    accentLabel: 'Conversation Readiness',
  },
  {
    icon: '📉',
    stat: '2.5-year skill half-life',
    text: 'The technical skills you mastered are expiring faster than you think. Most people discover they\'re obsolete after the layoff notice arrives.',
    accent: '#22D3EE',
    accentLabel: 'Market Survival',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const ProblemSection: React.FC = () => {
  return (
    <section
      id="problem"
      className="py-24 md:py-32 px-6"
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
            marginBottom: 24,
          }}
        >
          The Reality
        </motion.p>

        {/* Main statement */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-white mb-16 md:mb-20"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(28px, 4.5vw, 52px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            maxWidth: 800,
          }}
        >
          Millions of professionals are trapped.{' '}
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>
            Not by incompetence — by mistranslation.
          </span>
        </motion.h2>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {cards.map((card) => (
            <motion.div
              key={card.stat}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden"
              style={{
                background: '#111827',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 32,
                borderLeft: `3px solid ${card.accent}`,
              }}
            >
              {/* Subtle glow behind accent border */}
              <div
                className="absolute top-0 left-0 w-24 h-full pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, ${card.accent}08 0%, transparent 100%)`,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div className="text-3xl mb-5">{card.icon}</div>

                {/* Stat */}
                <p
                  className="font-black mb-3 leading-tight"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 20,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {card.stat}
                </p>

                {/* Text */}
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.7,
                  }}
                >
                  {card.text}
                </p>

                {/* Accent label */}
                <div
                  className="inline-flex items-center gap-1.5 mt-5 rounded-full px-2.5 py-1"
                  style={{
                    background: `${card.accent}15`,
                    border: `1px solid ${card.accent}30`,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 10,
                    color: card.accent,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: card.accent }}
                  />
                  {card.accentLabel}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
