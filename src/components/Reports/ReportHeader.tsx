
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartBarIcon, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export const ReportHeader: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="border"
          style={{
            color: theme.text,
            borderColor: theme.border,
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.border + '20';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 
            className="text-3xl font-bold flex items-center"
            style={{ color: theme.text }}
          >
            <ChartBarIcon className="mr-3 h-8 w-8" />
            Reports & Analytics
          </h1>
          <p 
            className="mt-1"
            style={{ color: theme.textSecondary }}
          >
            View and analyze business performance
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  );
};
