import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Lock, ShieldCheck, Eye, EyeOff,
  Zap, AlertCircle, CheckCircle2, Loader2, Check,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { AuthPerspectiveGrid, AuthOrbs, BrandPanel, FloatingInput } from './AuthShared';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface PasswordStrength {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  width: string;
  bg: string;
}

function getPasswordStrength(pw: string): PasswordStrength {
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum   = /[0-9]/.test(pw);
  const hasSpec  = /[^A-Za-z0-9]/.test(pw);
  const mixed    = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpec ? 1 : 0);

  if (pw.length === 0) return { level: 0, label: '', color: 'transparent', width: '0%', bg: 'transparent' };
  if (pw.length < 6)   return { level: 1, label: 'Weak',      color: '#EF4444', width: '25%', bg: 'rgba(239,68,68,0.15)' };
  if (pw.length < 8 || mixed < 2) return { level: 2, label: 'Fair', color: '#F59E0B', width: '50%', bg: 'rgba(245,158,11,0.15)' };
  if (pw.length < 12 || mixed < 3) return { level: 3, label: 'Strong', color: '#10B981', width: '75%', bg: 'rgba(16,185,129,0.15)' };
  return { level: 4, label: 'Very Strong', color: '#22D3EE', width: '100%', bg: 'rgba(34,211,238,0.15)', };
}

export default function SignupPage() {
  const navigate   = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showPw, setShowPw]           = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [apiError, setApiError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const strength = getPasswordStrength(password);

  const clearFieldError = (field: string) =>
    setFieldErrors((p) => { const n = { ...p }; delete n[field]; return n; });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim())    errs.name = 'Full name is required';
    if (!email)          errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password)       errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPw) errs.confirmPw = 'Passwords do not match';
    if (!agreed)         errs.terms = 'You must agree to the terms';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitState('loading');
    setApiError('');
    const result = await register(name.trim(), email, password);
    if (result.success) {
      setSubmitState('success');
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      setSubmitState('error');
      setApiError(result.error || 'Registration failed.');
      setTimeout(() => setSubmitState('idle'), 1200);
    }
  };

  const buttonBg = submitState === 'success' ? '#10B981' : 'linear-gradient(135deg,#6366F1,#7C3AED)';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#080B14', display: 'flex', overflow: 'hidden' }}>
      <AuthPerspectiveGrid />
      <AuthOrbs />

      {/* Left brand panel */}
      <div className="auth-brand-panel" style={{ display: 'flex' }}>
        <BrandPanel />
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 64px', position: 'relative', zIndex: 10,
        minHeight: '100vh',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 400, width: '100%' }}
        >
          {/* Back link */}
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'Inter,sans-serif', fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none', marginBottom: 36,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
          >
            ← Back to CITE
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11,
              color: '#6366F1', letterSpacing: '0.15em',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Begin Onboarding
            </p>
            <h1 style={{
              fontFamily: 'Inter,sans-serif', fontWeight: 900,
              fontSize: 32, color: '#fff', letterSpacing: '-0.025em',
              lineHeight: 1.2, margin: 0,
            }}>
              Activate your engine.
            </h1>
            <p style={{
              fontFamily: 'Inter,sans-serif', fontSize: 15,
              color: 'rgba(255,255,255,0.45)', marginTop: 8,
            }}>
              Join professionals who refuse to be blindsided.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <FloatingInput
                id="signup-name" label="Full name"
                value={name} onChange={(v) => { setName(v); clearFieldError('name'); }}
                icon={<User size={16} />} error={fieldErrors.name}
                autoComplete="name"
              />

              {/* Email */}
              <FloatingInput
                id="signup-email" label="Work email" type="email"
                value={email} onChange={(v) => { setEmail(v); clearFieldError('email'); }}
                icon={<Mail size={16} />} error={fieldErrors.email}
                autoComplete="email"
              />

              {/* Password */}
              <div>
                <FloatingInput
                  id="signup-password" label="Create password"
                  type={showPw ? 'text' : 'password'}
                  value={password} onChange={(v) => { setPassword(v); clearFieldError('password'); }}
                  icon={<Lock size={16} />} error={fieldErrors.password}
                  autoComplete="new-password"
                  rightSlot={
                    <button type="button" onClick={() => setShowPw((s) => !s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 2 }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                {/* Password strength bar */}
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{
                      height: 3, background: 'rgba(255,255,255,0.06)',
                      borderRadius: 999, overflow: 'hidden',
                    }}>
                      <motion.div
                        animate={{ width: strength.width, background: strength.level === 4
                          ? 'linear-gradient(90deg,#10B981,#22D3EE)' : strength.color }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 999 }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 11, color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <FloatingInput
                id="signup-confirm" label="Confirm password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw} onChange={(v) => { setConfirmPw(v); clearFieldError('confirmPw'); }}
                icon={<ShieldCheck size={16} />} error={fieldErrors.confirmPw}
                autoComplete="new-password"
                rightSlot={
                  <button type="button" onClick={() => setShowConfirm((s) => !s)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 2 }}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            {/* Terms checkbox */}
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <button
                type="button"
                onClick={() => { setAgreed((a) => !a); clearFieldError('terms'); }}
                style={{
                  width: 18, height: 18, flexShrink: 0, marginTop: 2,
                  background: agreed ? '#6366F1' : 'transparent',
                  border: `1.5px solid ${agreed ? '#6366F1' : fieldErrors.terms ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: 4, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {agreed && <Check size={11} color="#fff" strokeWidth={3} />}
              </button>
              <div>
                <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: '#6366F1', textDecoration: 'none' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#6366F1', textDecoration: 'none' }}>Privacy Policy</a>
                </span>
                {fieldErrors.terms && (
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#FCA5A5', marginTop: 4 }}>
                    {fieldErrors.terms}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitState === 'loading' || submitState === 'success'}
              whileHover={submitState === 'idle' ? { boxShadow: '0 8px 24px rgba(99,102,241,0.35)', filter: 'brightness(1.1)' } : {}}
              whileTap={submitState === 'idle' ? { scale: 0.98 } : {}}
              style={{
                width: '100%', height: 52, marginTop: 20,
                background: buttonBg, border: 'none', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: 15, color: '#fff',
                cursor: submitState === 'idle' ? 'pointer' : 'default',
                opacity: submitState === 'loading' ? 0.8 : 1,
                transition: 'background 0.3s ease, opacity 0.2s',
              }}
            >
              {submitState === 'loading' ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : submitState === 'success' ? (
                <><CheckCircle2 size={16} /> Access Granted</>
              ) : (
                <><Zap size={16} /> Activate CITE</>
              )}
            </motion.button>

            {/* API Error */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    marginTop: 12,
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <AlertCircle size={14} style={{ color: '#FCA5A5', flexShrink: 0 }} />
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#FCA5A5', margin: 0 }}>
                    {apiError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Social */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ label: 'Google', icon: '🔍' }, { label: 'LinkedIn', icon: '💼' }].map((s) => (
              <motion.button
                key={s.label} type="button"
                onClick={() => showToast('Social login coming soon', 'info')}
                whileHover={{ background: 'rgba(255,255,255,0.07)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, height: 44, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'Inter,sans-serif', fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>{s.icon}</span> {s.label}
              </motion.button>
            ))}
          </div>

          {/* Bottom link */}
          <p style={{
            textAlign: 'center', marginTop: 28,
            fontFamily: 'Inter,sans-serif', fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
          }}>
            Already have access?{' '}
            <Link to="/auth/login" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
