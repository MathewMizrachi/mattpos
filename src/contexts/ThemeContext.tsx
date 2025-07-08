
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: {
    background: string;
    border: string;
    text: string;
    textSecondary: string;
    card: string;
    button: string;
    buttonText: string;
    accent: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    background: isDarkMode ? '#0A2645' : '#F9FAFB',
    border: isDarkMode ? '#FAA225' : '#E5E7EB',
    text: isDarkMode ? '#FFFFFF' : '#1F2937',
    textSecondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#6B7280',
    card: isDarkMode ? '#0A2645' : '#FFFFFF',
    button: isDarkMode ? '#FAA225' : '#0A2645',
    buttonText: isDarkMode ? '#0A2645' : '#FFFFFF',
    accent: '#FAA225'
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
