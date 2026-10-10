/**
 * ThemeToggle.jsx: Sun / moon button that switches between light and dark mode.
 * Both icons are always rendered and cross-fade, so the switch feels smooth.
 */
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-white text-soft shadow-2xs transition-colors hover:bg-paper-2 hover:text-ink cursor-pointer ${className}`}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
      />
    </button>
  );
}
