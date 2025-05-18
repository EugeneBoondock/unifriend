'use client';

import React from 'react';

// Import pattern backgrounds
import { PatternBackground } from '@/components/ui/pattern-background';

// Define the theme context
export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Theme provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Apply theme class to body
  React.useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`theme-${theme} min-h-screen`}>
        <PatternBackground />
        <div className="relative z-10">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
