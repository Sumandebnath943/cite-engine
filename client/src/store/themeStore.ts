import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'colorful';

interface ThemeState {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
    }),
    { name: 'cite_theme' }
  )
);

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('theme-dark', 'theme-light', 'theme-colorful');
  root.classList.add(`theme-${theme}`);
}
