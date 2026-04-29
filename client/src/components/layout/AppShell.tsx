import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { applyTheme, useThemeStore } from '@/store/themeStore';

// ── Top loading bar ───────────────────────────────────────────────
export let setGlobalLoading: (v: boolean) => void = () => {};

const LoadingBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const progressRef = React.useRef(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  setGlobalLoading = (loading: boolean) => {
    if (loading) {
      setVisible(true);
      setProgress(5);
      progressRef.current = 5;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (progressRef.current < 70) {
          progressRef.current = Math.min(progressRef.current + Math.random() * 5 + 1, 70);
          setProgress(progressRef.current);
        }
      }, 400);
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setProgress(100);
      setTimeout(() => { setVisible(false); setProgress(0); }, 500);
    }
  };

  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999 }}>
      <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7C3AED,#22D3EE)', transition: progress === 100 ? 'width 0.3s ease' : 'width 0.4s ease', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
};

// ── Scroll-to-top on route change ────────────────────────────────
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// ── Mobile bottom tab bar ─────────────────────────────────────────
const MobileTabBar: React.FC = () => {
  const location = useLocation();
  const tabs = [
    { icon: '🏠', label: 'Home',     path: '/dashboard' },
    { icon: '🪄', label: 'Pivot',    path: '/dashboard/pivot' },
    { icon: '💬', label: 'Copilot',  path: '/dashboard/copilot' },
    { icon: '📡', label: 'Radar',    path: '/dashboard/radar' },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
  ];
  const ACCENT: Record<string, string> = {
    '/dashboard/pivot':    '#A78BFA',
    '/dashboard/copilot':  '#F59E0B',
    '/dashboard/radar':    '#22D3EE',
    '/dashboard':          '#6366F1',
    '/dashboard/settings': '#6B7280',
  };
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 64, background: 'var(--bg-secondary,#0D1220)', borderTop: '1px solid var(--border-default,rgba(255,255,255,0.07))', display: 'flex', alignItems: 'center', zIndex: 300, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map((t) => {
        const isActive = t.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(t.path);
        const color = isActive ? (ACCENT[t.path] || '#fff') : 'rgba(255,255,255,0.3)';
        return (
          <a key={t.path} href={t.path} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color, fontWeight: isActive ? 600 : 400 }}>{t.label}</span>
          </a>
        );
      })}
    </div>
  );
};

// ── AppShell ──────────────────────────────────────────────────────
const COLLAPSED_W = 64;
const EXPANDED_W  = 240;
const TRANSITION  = '250ms cubic-bezier(0.4,0,0.2,1)';

export const AppShell: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const location = useLocation();
  const { theme } = useThemeStore();

  // Apply theme class on mount + theme change
  useEffect(() => { applyTheme(theme); }, [theme]);

  // Update CSS variable on sidebar toggle — used by TopBar + main
  useEffect(() => {
    const w = sidebarExpanded ? EXPANDED_W : COLLAPSED_W;
    document.documentElement.style.setProperty('--sidebar-width', `${w}px`);
  }, [sidebarExpanded]);

  // Set initial CSS var on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${COLLAPSED_W}px`);
  }, []);

  const sidebarW = sidebarExpanded ? EXPANDED_W : COLLAPSED_W;

  return (
    <div className="app-shell-root" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary,#080B14)' }}>
      <LoadingBar />
      <ScrollToTop />

      <Sidebar expanded={sidebarExpanded} onExpandedChange={setSidebarExpanded} />

      <TopBar sidebarWidth={sidebarW} />

      <main
        style={{
          marginLeft: sidebarW,
          paddingTop: 64,
          transition: `margin-left ${TRANSITION}`,
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 32 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile tab bar */}
      <style>{`
        @media(min-width:768px){.mobile-tabs{display:none!important}}
        @media(max-width:767px){.sidebar-desktop{display:none!important}main{margin-left:0!important;padding-bottom:80px!important}}
      `}</style>
      <div className="mobile-tabs"><MobileTabBar /></div>
    </div>
  );
};
