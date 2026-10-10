/**
 * ThemeContext.jsx: Light / dark theme for the whole site.
 * - Remembers the visitor's choice in localStorage (key: portfoliohub_theme).
 * - Without a saved choice it follows the operating-system setting, and keeps following it live.
 * - The theme is applied as <html data-theme="light|dark">; index.css reads that attribute.
 *   index.html sets it once before the first paint so the page never flashes the wrong colours.
 * Use it anywhere with: const { theme, toggleTheme } = useTheme();
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'portfoliohub_theme';
const ThemeContext = createContext(null);

function readSaved() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null; // private mode / blocked storage: just follow the system
  }
}

function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Write the theme onto <html> and the browser's address-bar colour. */
function applyTheme(theme, animate) {
  const root = document.documentElement;
  if (root.getAttribute('data-theme') === theme) return; // already applied (setTheme does it instantly)
  const write = () => {
    root.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#121212' : '#F5F8FC');
  };
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // View Transitions fade a snapshot on the GPU: smooth, with no per-element transitions.
  // Browsers without it just switch instantly.
  if (animate && !reduce && typeof document.startViewTransition === 'function') {
    document.startViewTransition(write);
  } else {
    write();
  }
}

export function ThemeProvider({ children }) {
  const [saved, setSaved] = useState(readSaved);          // 'light' | 'dark' | null (= follow system)
  const [system, setSystem] = useState(systemTheme);
  const theme = saved || system;

  // Follow the operating system while the visitor has not chosen
  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return undefined;
    }
    const onChange = (e) => setSystem(e.matches ? 'dark' : 'light');
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Keep several open tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setSaved(readSaved());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Apply (first run: no fade, index.html already set it)
  const firstRun = React.useRef(true);
  useEffect(() => {
    applyTheme(theme, !firstRun.current);
    firstRun.current = false;
  }, [theme]);

  const setTheme = useCallback((next) => {
    applyTheme(next, true); // paint the new colours right away, don't wait for React to re-render
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked: the choice lasts until the page is closed */
    }
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
