import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Wand2, MessageSquare, Radar, Settings, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { CITELogo } from '@/components/ui/CITELogo';

const navItems = [
  { label: 'Dashboard',            to: '/dashboard',          icon: <LayoutDashboard size={18} />, accent: '#6366F1', activeBg: 'rgba(99,102,241,0.1)',  activeBorder: 'rgba(99,102,241,0.3)',  exact: true },
  { label: 'Career Pivot',         to: '/dashboard/pivot',    icon: <Wand2 size={18} />,           accent: '#A78BFA', activeBg: 'rgba(124,58,237,0.1)',  activeBorder: 'rgba(124,58,237,0.3)',  exact: false },
  { label: 'Conversation Copilot', to: '/dashboard/copilot',  icon: <MessageSquare size={18} />,   accent: '#F59E0B', activeBg: 'rgba(217,119,6,0.1)',   activeBorder: 'rgba(217,119,6,0.3)',   exact: false },
  { label: 'Job Radar',            to: '/dashboard/radar',    icon: <Radar size={18} />,            accent: '#22D3EE', activeBg: 'rgba(8,145,178,0.1)',   activeBorder: 'rgba(8,145,178,0.3)',   exact: false },
  { label: 'Settings',             to: '/dashboard/settings', icon: <Settings size={18} />,        accent: '#9CA3AF', activeBg: 'rgba(255,255,255,0.06)', activeBorder: 'rgba(255,255,255,0.12)', exact: false },
];

export const Sidebar: React.FC<{ expanded: boolean; onExpandedChange: (v: boolean) => void }> = ({ expanded, onExpandedChange }) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : (user?.email?.slice(0, 2).toUpperCase() ?? 'U');

  return (
    <motion.aside className="fixed left-0 top-0 h-full z-[150] flex flex-col overflow-hidden"
      style={{ backgroundColor: '#0D1220', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      animate={{ width: expanded ? 240 : 64 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => onExpandedChange(true)}
      onHoverEnd={() => onExpandedChange(false)}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', height: 64, padding: '0 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, overflow: 'hidden' }}>
        <CITELogo size="md" showWordmark={expanded} animated={false} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((item) => {
          const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
          return (
            <NavLink key={item.to} to={item.to} style={{ display: 'flex', alignItems: 'center', height: 40, borderRadius: 8, border: '1px solid', padding: expanded ? '0 10px' : '0', justifyContent: expanded ? 'flex-start' : 'center', gap: 10, textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'all 0.15s', color: isActive ? item.accent : 'rgba(255,255,255,0.4)', background: isActive ? item.activeBg : 'transparent', borderColor: isActive ? item.activeBorder : 'transparent' }}
              onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = item.accent; (e.currentTarget as HTMLElement).style.background = `${item.activeBg}50`; } }}
              onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}>
              {isActive && <motion.div layoutId="side-indicator" style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, borderRadius: 1, background: item.accent }} transition={{ duration: 0.2 }} />}
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <AnimatePresence>
                {expanded && (
                  <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }} style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile card (expanded only) */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            style={{ margin: '8px', padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 11, color: '#fff', flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 12, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
            </div>
            <NavLink to="/dashboard/settings" style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}><Settings size={13} /></NavLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <motion.button onClick={() => onExpandedChange(!expanded)} style={{ width: '100%', height: 32, borderRadius: 7, display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', padding: '0 8px', gap: 8 }}>
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <ChevronRight size={14} />
          </motion.span>
          <AnimatePresence>
            {expanded && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.3)' }}>Collapse sidebar</motion.span>}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};
