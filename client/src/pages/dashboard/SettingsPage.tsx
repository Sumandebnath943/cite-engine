import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import { useThemeStore, Theme, applyTheme } from '@/store/themeStore';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, clearAuth } = useAuthStore();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', { name });
      showToast('Profile updated successfully', 'success');
    } catch { showToast('Failed to save changes', 'error'); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') { showToast('Please type DELETE to confirm', 'error'); return; }
    try {
      await api.delete('/dashboard/account');
      clearAuth(); navigate('/auth/login');
    } catch { showToast('Failed to delete account', 'error'); }
  };

  const S: React.CSSProperties = {
    fontFamily: 'JetBrains Mono,monospace',
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    borderLeft: '2px solid var(--border-default)',
    paddingLeft: 12,
    marginBottom: 16,
  };
  const inp: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontFamily: 'Inter,sans-serif',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };
  const card: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 14,
    padding: 28,
    marginBottom: 20,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 30, color: 'var(--text-primary)', letterSpacing: '-0.025em', margin: '0 0 6px' }}>Settings</h1>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div style={card}>
        <p style={S}>Profile</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Full Name</p>
            <input style={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Email Address</p>
            <input style={{ ...inp, color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed' }} value={user?.email || ''} readOnly />
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>Email changes coming soon</p>
          </div>
          <button onClick={handleSave} disabled={saving} style={{ height: 40, background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366F1,#7C3AED)', border: 'none', borderRadius: 9, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: '#fff' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div style={card}>
        <p style={S}>Subscription</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, padding: '4px 12px', marginBottom: 8 }}>
              <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#A78BFA' }}>ANALYST · FREE</span>
            </div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>3 engine scans per month · Basic AI outputs</p>
          </div>
          <button style={{ height: 40, padding: '0 20px', background: 'linear-gradient(135deg,#6366F1,#7C3AED)', border: 'none', borderRadius: 9, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: '#fff' }}>
            Upgrade to Operator
          </button>
        </div>
      </div>

      {/* API Access */}
      <div style={{ ...card, background: 'rgba(255,255,255,0.02)' }}>
        <p style={S}>API Access</p>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#A78BFA', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 999, padding: '4px 12px' }}>OPERATOR TIER</span>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>API access coming soon in Operator tier.</p>
        </div>
      </div>

      {/* Appearance */}
      <div style={card}>
        <p style={S}>Appearance</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Choose your interface theme. Changes apply instantly and persist on refresh.</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 16 }}>
          {([
            {
              id: 'dark' as Theme,
              label: 'Dark',
              sub: 'Default',
              preview: (
                <svg viewBox="0 0 140 80" width="140" height="80" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
                  {/* Dark bg */}
                  <rect width="140" height="80" fill="#080B14" />
                  {/* Sidebar strip */}
                  <rect width="24" height="80" fill="#0D1220" />
                  {/* Nav dots */}
                  <circle cx="12" cy="20" r="4" fill="rgba(99,102,241,0.6)" />
                  <circle cx="12" cy="34" r="4" fill="rgba(255,255,255,0.15)" />
                  <circle cx="12" cy="48" r="4" fill="rgba(255,255,255,0.15)" />
                  {/* Card */}
                  <rect x="32" y="12" width="98" height="40" rx="5" fill="#111827" />
                  {/* Gradient bar */}
                  <rect x="40" y="20" width="40" height="4" rx="2" fill="url(#darkGrad)" />
                  <defs><linearGradient id="darkGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#22D3EE" /></linearGradient></defs>
                  {/* Text lines */}
                  <rect x="40" y="30" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />
                  <rect x="40" y="38" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />
                  {/* Accent dots */}
                  <circle cx="115" cy="22" r="3" fill="#7C3AED" />
                  <circle cx="123" cy="22" r="3" fill="#D97706" />
                  <circle cx="131" cy="22" r="3" fill="#0891B2" />
                </svg>
              ),
            },
            {
              id: 'light' as Theme,
              label: 'Light',
              sub: 'Professional',
              preview: (
                <svg viewBox="0 0 140 80" width="140" height="80" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
                  {/* Light bg */}
                  <rect width="140" height="80" fill="#EEF2F7" />
                  {/* Dark sidebar */}
                  <rect width="24" height="80" fill="#1E2340" />
                  {/* Nav dots */}
                  <circle cx="12" cy="20" r="4" fill="rgba(99,102,241,0.8)" />
                  <circle cx="12" cy="34" r="4" fill="rgba(255,255,255,0.2)" />
                  <circle cx="12" cy="48" r="4" fill="rgba(255,255,255,0.2)" />
                  {/* White card */}
                  <rect x="32" y="10" width="98" height="44" rx="5" fill="#FFFFFF" filter="url(#lightShadow)" />
                  <defs><filter id="lightShadow"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" /></filter></defs>
                  {/* Colored accent bar */}
                  <rect x="40" y="18" width="40" height="4" rx="2" fill="url(#lightGrad)" />
                  <defs><linearGradient id="lightGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6D28D9" /><stop offset="100%" stopColor="#0369A1" /></linearGradient></defs>
                  {/* Dark text lines */}
                  <rect x="40" y="28" width="60" height="3" rx="1.5" fill="rgba(15,23,42,0.2)" />
                  <rect x="40" y="36" width="40" height="3" rx="1.5" fill="rgba(15,23,42,0.12)" />
                  {/* Accent dots */}
                  <circle cx="115" cy="22" r="3" fill="#6D28D9" />
                  <circle cx="123" cy="22" r="3" fill="#B45309" />
                  <circle cx="131" cy="22" r="3" fill="#0369A1" />
                </svg>
              ),
            },
            {
              id: 'colorful' as Theme,
              label: 'Colorful',
              sub: 'Jewel',
              preview: (
                <svg viewBox="0 0 140 80" width="140" height="80" style={{ display: 'block', borderRadius: '8px 8px 0 0' }}>
                  <defs>
                    <linearGradient id="colBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1A0533" /><stop offset="50%" stopColor="#0D1B4B" /><stop offset="100%" stopColor="#0A3352" /></linearGradient>
                    <linearGradient id="colGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#A78BFA" /><stop offset="100%" stopColor="#67E8F9" /></linearGradient>
                  </defs>
                  {/* Jewel gradient bg */}
                  <rect width="140" height="80" fill="url(#colBg)" />
                  {/* Deep purple sidebar */}
                  <rect width="24" height="80" fill="#2D1B69" />
                  {/* Nav dots — bright lavender */}
                  <circle cx="12" cy="20" r="4" fill="#A78BFA" />
                  <circle cx="12" cy="34" r="4" fill="rgba(167,139,250,0.35)" />
                  <circle cx="12" cy="48" r="4" fill="rgba(167,139,250,0.35)" />
                  {/* Glassy card */}
                  <rect x="32" y="10" width="98" height="44" rx="5" fill="rgba(255,255,255,0.1)" stroke="rgba(167,139,250,0.35)" strokeWidth="1" />
                  {/* Vivid gradient bar */}
                  <rect x="40" y="18" width="44" height="4" rx="2" fill="url(#colGrad)" />
                  {/* Lavender text lines */}
                  <rect x="40" y="28" width="60" height="3" rx="1.5" fill="rgba(196,181,253,0.5)" />
                  <rect x="40" y="36" width="36" height="3" rx="1.5" fill="rgba(196,181,253,0.3)" />
                  {/* Vivid neon accent dots */}
                  <circle cx="115" cy="22" r="3" fill="#A78BFA" />
                  <circle cx="123" cy="22" r="3" fill="#FCD34D" />
                  <circle cx="131" cy="22" r="3" fill="#67E8F9" />
                </svg>
              ),
            },
          ] as { id: Theme; label: string; sub: string; preview: React.ReactNode }[]).map(({ id, label, sub, preview }) => {
            const isActive = theme === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setTheme(id);
                  applyTheme(id);
                }}
                style={{
                  width: 140,
                  padding: 0,
                  borderRadius: 10,
                  cursor: 'pointer',
                  background: 'none',
                  border: isActive ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isActive ? '0 0 0 4px rgba(99,102,241,0.15)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Checkmark badge */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 6, right: 6, zIndex: 2,
                    width: 20, height: 20, borderRadius: '50%',
                    background: '#6366F1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {preview}
                <div style={{ padding: '8px 10px 10px', textAlign: 'left' }}>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: 'var(--text-primary,#fff)', margin: 0 }}>{label}</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: 'var(--text-muted,rgba(255,255,255,0.35))', margin: '2px 0 0' }}>{sub}</p>
                </div>
              </button>
            );
          })}
        </div>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'var(--text-muted,rgba(255,255,255,0.4))', margin: 0 }}>
          Active theme: <span style={{ color: '#6366F1', fontWeight: 600 }}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
        </p>
      </div>

      {/* Danger Zone */}
      <div style={{ ...card, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <p style={{ ...S, borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>Danger Zone</p>
        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button onClick={() => setDeleteOpen(true)} style={{ height: 38, padding: '0 18px', background: 'none', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#EF4444' }}>Delete Account</button>
      </div>

      {/* Delete confirmation modal */}
      {deleteOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setDeleteOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#111827', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16, padding: 32, width: 400, maxWidth: '90vw' }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', marginBottom: 10 }}>Delete your account?</p>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>This permanently removes all your data. Type <strong style={{ color: '#EF4444' }}>DELETE</strong> to confirm.</p>
            <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" style={{ ...inp, marginBottom: 14, borderColor: 'rgba(239,68,68,0.3)' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteOpen(false)} style={{ flex: 1, height: 40, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, height: 40, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 13, color: '#EF4444' }}>Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
