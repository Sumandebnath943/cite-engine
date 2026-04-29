import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from '@/components/ui/Toast';
import '@/styles/global.css';
import '@/styles/themes.css';
import '@/styles/theme-overrides.css'; // MUST be last — overrides all hardcoded component styles

// ── Apply persisted theme BEFORE first render (prevents FOUC) ──────
// Zustand 'persist' middleware stores: { state: { theme: 'dark' }, version: 0 }
// We also support a legacy bare string 'theme-dark' format.
(function initTheme() {
  let theme = 'dark';
  try {
    const raw = localStorage.getItem('cite_theme');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.theme) {
        // Standard Zustand persist format: { state: { theme: 'light' } }
        theme = parsed.state.theme;
      } else if (typeof parsed === 'string') {
        // Bare string fallback (legacy)
        theme = parsed.replace('theme-', '');
      }
    }
  } catch {
    // JSON parse error — fall back to dark
  }

  const validThemes = ['dark', 'light', 'colorful'];
  if (!validThemes.includes(theme)) theme = 'dark';

  document.documentElement.classList.remove('theme-dark', 'theme-light', 'theme-colorful');
  document.documentElement.classList.add(`theme-${theme}`);
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);
