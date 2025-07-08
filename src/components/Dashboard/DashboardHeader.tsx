
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onLogout }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="rounded-lg shadow-sm p-6 mb-8 border-2"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: theme.text }}
          >
            Welcome, {userName}
          </h1>
          <p 
            className="text-lg"
            style={{ color: theme.textSecondary }}
          >
            Dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-2"
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.text
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
