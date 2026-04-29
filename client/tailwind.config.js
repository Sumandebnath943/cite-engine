/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-primary': '#080B14',
        'bg-secondary': '#0D1220',
        'bg-card': '#111827',
        'bg-elevated': '#161F35',
        
        // Engine A — Electric Violet
        violet: {
          primary: '#7C3AED',
          light: '#A78BFA',
          glow: 'rgba(124,58,237,0.3)',
        },
        
        // Engine B — Ember Gold
        gold: {
          primary: '#D97706',
          light: '#FCD34D',
          glow: 'rgba(217,119,6,0.3)',
        },
        
        // Engine C — Neon Cyan
        cyan: {
          primary: '#0891B2',
          light: '#22D3EE',
          glow: 'rgba(8,145,178,0.3)',
        },
        
        // Global
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
          400: '#818CF8',
        },
        
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.03em',
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        badge: '999px',
      },
      boxShadow: {
        'glow-violet': '0 0 0 1px rgba(124,58,237,0.2), 0 8px 32px rgba(124,58,237,0.08)',
        'glow-gold': '0 0 0 1px rgba(217,119,6,0.2), 0 8px 32px rgba(217,119,6,0.08)',
        'glow-cyan': '0 0 0 1px rgba(8,145,178,0.2), 0 8px 32px rgba(8,145,178,0.08)',
        'glow-indigo': '0 0 0 1px rgba(99,102,241,0.3), 0 8px 32px rgba(99,102,241,0.12)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #7C3AED, #A78BFA)',
        'gradient-gold': 'linear-gradient(135deg, #D97706, #FCD34D)',
        'gradient-cyan': 'linear-gradient(135deg, #0891B2, #22D3EE)',
        'gradient-indigo': 'linear-gradient(135deg, #6366F1, #818CF8)',
        'mesh-bg': 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(8,145,178,0.06) 0%, transparent 60%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
