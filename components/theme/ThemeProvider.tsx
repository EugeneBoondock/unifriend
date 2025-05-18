'use client';

import React, { useEffect, useState } from 'react';

// Define the theme context
type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

// Theme provider component
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Set the theme on mount
  useEffect(() => {
    setMounted(true);
    // Apply dark theme by default
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Prevent hydration mismatch by not rendering until mounted on client
  if (!mounted) {
    return <div className="min-h-screen w-full" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`min-h-screen w-full`}>
        {children}
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
