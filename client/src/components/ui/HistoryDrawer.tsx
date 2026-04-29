import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  accentColor: string;
  children: React.ReactNode;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  title,
  accentColor,
  children,
}) => {
  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 300,
            }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer-panel"
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 'min(380px, 100vw)',
              background: 'var(--bg-elevated, #161F35)',
              borderLeft: '1px solid var(--border-default, rgba(255,255,255,0.08))',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
              zIndex: 301,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              height: 60,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-default, rgba(255,255,255,0.08))',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}80`,
                }} />
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'var(--text-primary, #fff)',
                }}>
                  {title}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 28, height: 28,
                  borderRadius: 6,
                  border: '1px solid var(--border-default, rgba(255,255,255,0.08))',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-muted, rgba(255,255,255,0.4))',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={(e) => { (e.currentTarget).style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 16px',
            }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryDrawer;
