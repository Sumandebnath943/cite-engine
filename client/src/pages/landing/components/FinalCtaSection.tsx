import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const FinalCtaSection: React.FC = () => {
  return (
    <section
      className="relative py-36 md:py-44 px-6 overflow-hidden"
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-7">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-black text-white"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(30px, 5vw, 56px)',
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
          }}
        >
          Your career doesn't have{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6366F1, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            a second draft.
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.6,
          }}
        >
          Activate CITE today. Translate. Script. Survive.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/auth/signup">
            <motion.button
              whileHover={{
                boxShadow: '0 0 48px rgba(99,102,241,0.55)',
                scale: 1.03,
                background: '#818CF8',
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center font-semibold rounded-btn transition-all"
              style={{
                height: 56,
                paddingLeft: 36,
                paddingRight: 36,
                background: '#6366F1',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontSize: 16,
                letterSpacing: '-0.01em',
                boxShadow: '0 0 24px rgba(99,102,241,0.3)',
              }}
            >
              Activate Your Engine
            </motion.button>
          </Link>
        </motion.div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          No credit card required. Free tier available.
        </motion.p>
      </div>
    </section>
  );
};
