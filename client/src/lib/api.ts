import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Use Vite proxy (baseURL='/api' proxied to http://localhost:3001 via vite.config.ts)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s timeout for AI calls
});

// ── Attach JWT to every request ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Handle 401 — clear auth and redirect (skip on auth routes) ───────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't redirect on login/register endpoints — let the UI handle the error
      const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
      if (!isAuthRoute) {
        useAuthStore.getState().clearAuth();
        // Use React Router history if available, else fallback
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ── Pivot API ─────────────────────────────────────────────────────────
export const pivotApi = {
  translate: (data: object) => api.post('/pivot/translate', data),
  linkedin: (data: object) => api.post('/pivot/linkedin', data),
  learningPath: (data: object) => api.post('/pivot/learning-path', data),
};

// ── Copilot API ───────────────────────────────────────────────────────
export const copilotApi = {
  generateScript: (data: object) => api.post('/copilot/generate-script', data),
  roleplayMessage: (data: object) => api.post('/copilot/roleplay', data),
  analyzeSession: (data: object) => api.post('/copilot/analyze', data),
};

// ── Radar API ─────────────────────────────────────────────────────────
export const radarApi = {
  scan: (data: object) => api.post('/radar/scan', data),
  newsScan: (data: object) => api.post('/radar/news-scan', data),
  history: () => api.get('/radar/history'),
  latestScore: () => api.get('/radar/latest-score'),
};

// ── Dashboard API ─────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
  activity: () => api.get('/dashboard/activity'),
};

export default api;
