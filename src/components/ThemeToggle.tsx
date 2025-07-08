
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-2"
      style={{
        backgroundColor: isDarkMode ? '#0A2645' : '#FFFFFF',
        borderColor: isDarkMode ? '#FAA225' : '#E5E7EB',
        color: isDarkMode ? '#FFFFFF' : '#1F2937'
      }}
    >
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};

export default ThemeToggle;
