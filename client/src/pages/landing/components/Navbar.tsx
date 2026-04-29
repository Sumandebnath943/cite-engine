import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CITELogo } from '@/components/ui/CITELogo';
import { useThemeStore } from '@/store/themeStore';
import { Sun, Moon, Palette } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('colorful');
    else setTheme('dark');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 md:px-10 h-16"
      style={{
        background: 'rgba(8,11,20,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <CITELogo size="md" showWordmark={true} animated={true} />
      </Link>

      {/* Center nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        {['How It Works', 'The Engines', 'Pricing'].map((label) => (
          <a
            key={label}
            href={`#${label.toLowerCase().replace(/ /g, '-')}`}
            className="text-sm font-medium transition-colors duration-150"
            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right CTAs */}
      <div className="flex items-center gap-3">
        <button
          onClick={cycleTheme}
          title="Switch theme"
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            color: 'rgba(255,255,255,0.6)',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          {theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Palette size={16} />}
        </button>
        <Link
          to="/auth/login"
          className="hidden sm:inline-flex items-center h-9 px-4 rounded-btn text-sm font-medium border transition-all duration-150"
          style={{
            color: 'rgba(255,255,255,0.65)',
            borderColor: 'rgba(255,255,255,0.12)',
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#fff';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          Sign In
        </Link>
        <Link
          to="/auth/signup"
          className="inline-flex items-center h-9 px-4 rounded-btn text-sm font-semibold transition-all duration-150"
          style={{
            background: '#6366F1',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#818CF8';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(99,102,241,0.4)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#6366F1';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          Get Access
        </Link>
      </div>
    </motion.nav>
  );
};
