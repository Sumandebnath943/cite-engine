import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, Settings, LogOut, Wand2, MessageSquare, Radio, LayoutDashboard, Sun, Moon, Palette } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':          { title: 'Command Center',            subtitle: 'Overview of your intelligence engines' },
  '/dashboard/pivot':    { title: 'Career Pivot Translator',   subtitle: 'Translate your experience for any role' },
  '/dashboard/copilot':  { title: 'Conversation Copilot',      subtitle: 'AI-powered communication intelligence' },
  '/dashboard/radar':    { title: 'Job Security Radar',        subtitle: 'Real-time market threat assessment' },
  '/dashboard/settings': { title: 'Settings',                  subtitle: 'Manage your account and preferences' },
};

const NAV_LINKS = [
  { label: 'Command Center',         path: '/dashboard',          icon: <LayoutDashboard size={14} />, color: '#6366F1' },
  { label: 'Career Pivot Translator',path: '/dashboard/pivot',   icon: <Wand2 size={14} />,           color: '#A78BFA' },
  { label: 'Conversation Copilot',   path: '/dashboard/copilot', icon: <MessageSquare size={14} />,   color: '#F59E0B' },
  { label: 'Job Security Radar',     path: '/dashboard/radar',   icon: <Radio size={14} />,            color: '#22D3EE' },
];

// ── Cmd+K Search Modal ────────────────────────────────────────────
const SearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = NAV_LINKS.filter((l) => !q || l.label.toLowerCase().includes(q.toLowerCase()));
  const go = (path: string) => { navigate(path); onClose(); };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 560, maxWidth: '90vw', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'Inter,sans-serif', fontSize: 15, color: '#fff' }} />
          <kbd style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '2px 6px' }}>ESC</kbd>
        </div>
        <div style={{ padding: 12 }}>
          <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px', marginBottom: 6 }}>Quick Navigation</p>
          {filtered.map((l) => (
            <button key={l.path} onClick={() => go(l.path)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
              <span style={{ color: l.color }}>{l.icon}</span>
              <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: '#fff' }}>{l.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{l.path}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Avatar dropdown ───────────────────────────────────────────────
const AvatarDropdown: React.FC<{ onClose: () => void; name: string; email: string; initials: string }> = ({ onClose, name, email, initials }) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  const handleLogout = () => { clearAuth(); localStorage.removeItem('cite-completed-actions'); navigate('/auth/login'); };
  return (
    <div ref={ref} style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 200, background: '#161F35', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 8, boxShadow: '0 16px 48px rgba(0,0,0,0.4)', zIndex: 1000 }}>
      <div style={{ padding: '8px 10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 11, color: '#fff', marginBottom: 8 }}>{initials}</div>
        <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: '#fff', margin: '0 0 2px' }}>{name}</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</p>
      </div>
      {[
        { icon: <Settings size={13} />, label: 'Settings', action: () => { navigate('/dashboard/settings'); onClose(); } },
        { icon: <LogOut size={13} />, label: 'Sign Out', action: handleLogout },
      ].map((item) => (
        <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 7, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'left', transition: 'background 0.15s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
          {item.icon} {item.label}
        </button>
      ))}
    </div>
  );
};

// ── TopBar ────────────────────────────────────────────────────────
const TRANSITION = '250ms cubic-bezier(0.4,0,0.2,1)';

export const TopBar: React.FC<{ sidebarWidth: number }> = ({ sidebarWidth }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'CITE', subtitle: '' };
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : (user?.email?.slice(0, 2).toUpperCase() ?? 'U');
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  // Cmd+K
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('colorful');
    else setTheme('dark');
  };

  return (
    <>
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      <header
        className="theme-topbar"
        style={{
          position: 'fixed',
          top: 0,
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 200,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(8,11,20,0.9)',
          backdropFilter: 'blur(12px)',
          transition: `left ${TRANSITION}, width ${TRANSITION}`,
          boxSizing: 'border-box',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text-primary,#fff)', margin: 0, letterSpacing: '-0.01em' }}>{pageInfo.title}</h1>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'var(--text-muted,rgba(255,255,255,0.35))', margin: 0 }}>{pageInfo.subtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setSearchOpen(true)} style={{ height: 32, padding: '0 10px', borderRadius: 7, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter,sans-serif', fontSize: 12, transition: 'all 0.15s' }}>
            <Search size={13} /> <span>Search</span> <kbd style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', borderRadius: 3, padding: '1px 4px' }}>⌘K</kbd>
          </button>
          
          <button onClick={cycleTheme} title="Switch Theme" style={{ height: 32, width: 32, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
            {theme === 'dark' ? <Moon size={15} /> : theme === 'light' ? <Sun size={15} /> : <Palette size={15} />}
          </button>

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', marginLeft: 4, marginRight: 4 }} />
          <div style={{ position: 'relative' }}>
            <button onClick={() => setAvatarOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 10, color: '#fff' }}>{initials}</div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{user?.name || 'User'}</p>
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{user?.email}</p>
              </div>
            </button>
            {avatarOpen && <AvatarDropdown onClose={() => setAvatarOpen(false)} name={user?.name || 'User'} email={user?.email || ''} initials={initials} />}
          </div>
        </div>
      </header>
    </>
  );
};
