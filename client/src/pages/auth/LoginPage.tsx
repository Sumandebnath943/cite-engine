import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import {
  AuthPerspectiveGrid,
  AuthOrbs,
  BrandPanel,
  FloatingInput,
} from './AuthShared';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitState('loading');
    setApiError('');

    const result = await login(email, password);

    if (result.success) {
      setSubmitState('success');
      setTimeout(() => navigate('/dashboard'), 800);
    } else {
      setSubmitState('error');
      setApiError(result.error || 'Login failed.');
      setTimeout(() => setSubmitState('idle'), 1200);
    }
  };

  const buttonLabel =
    submitState === 'loading' ? null :
    submitState === 'success' ? 'Access Granted' :
    'Access CITE';

  const buttonBg =
    submitState === 'success'
      ? '#10B981'
      : 'linear-gradient(135deg,#6366F1,#7C3AED)';

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#080B14', display: 'flex', overflow: 'hidden' }}>
      <AuthPerspectiveGrid />
      <AuthOrbs />

      {/* Left brand panel — hidden on mobile */}
      <div className="auth-brand-panel">
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
              textDecoration: 'none', marginBottom: 40,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
          >
            ← Back to CITE
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11,
              color: '#6366F1', letterSpacing: '0.15em',
              textTransform: 'uppercase', marginBottom: 12,
            }}>
              Secure Access
            </p>
            <h1 style={{
              fontFamily: 'Inter,sans-serif', fontWeight: 900,
              fontSize: 32, color: '#fff', letterSpacing: '-0.025em',
              lineHeight: 1.2, margin: 0,
            }}>
              Welcome back, Operator.
            </h1>
            <p style={{
              fontFamily: 'Inter,sans-serif', fontSize: 15,
              color: 'rgba(255,255,255,0.45)', marginTop: 8,
            }}>
              Your intelligence engines are standing by.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FloatingInput
                id="login-email"
                label="Email address"
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                icon={<Mail size={16} />}
                error={fieldErrors.email}
                autoComplete="email"
              />
              <FloatingInput
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(v) => { setPassword(v); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                icon={<Lock size={16} />}
                error={fieldErrors.password}
                autoComplete="current-password"
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 2 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: 10 }}>
              <a href="#" style={{
                fontFamily: 'Inter,sans-serif', fontSize: 13,
                color: '#6366F1', textDecoration: 'none',
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = 'underline')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = 'none')}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={submitState === 'loading' || submitState === 'success'}
              whileHover={submitState === 'idle' ? {
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                filter: 'brightness(1.1)',
              } : {}}
              whileTap={submitState === 'idle' ? { scale: 0.98 } : {}}
              style={{
                width: '100%', height: 52, marginTop: 24,
                background: buttonBg,
                border: 'none', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8,
                fontFamily: 'Inter,sans-serif', fontWeight: 600,
                fontSize: 15, color: '#fff',
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
                <>
                  {buttonLabel}
                  <motion.span
                    whileHover={{ x: 3 }}
                    style={{ display: 'flex' }}
                  >
                    <ArrowRight size={16} />
                  </motion.span>
                </>
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

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '28px 0',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'Google', icon: '🔍' },
              { label: 'LinkedIn', icon: '💼' },
            ].map((s) => (
              <motion.button
                key={s.label}
                type="button"
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
            textAlign: 'center', marginTop: 32,
            fontFamily: 'Inter,sans-serif', fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
          }}>
            Don't have access yet?{' '}
            <Link to="/auth/signup" style={{ color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>
              Request Access
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
