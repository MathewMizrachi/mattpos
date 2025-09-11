
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface DashboardHeaderProps {
  userName: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onLogout }) => {
  const { currentMode, toggleMode } = useApp();
  
  return (
    <header className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div className="flex items-center w-full sm:w-auto">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/fd658335-de63-4813-b0d9-355f4313e4a5.png" 
            alt="Shop2Shop Logo" 
            className="h-8 sm:h-10 lg:h-12 w-auto object-contain mr-2 sm:mr-3"
          />
          <div className="min-w-0 flex-1">
            <h1 
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity truncate"
              onClick={toggleMode}
              title={`Switch to ${currentMode === 'till' ? 'Cook2Day' : 'Till2Day'}`}
            >
              {currentMode === 'till' ? 'Till2Day' : 'Cook2Day'}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base truncate">Welcome, {userName}</p>
          </div>
        </div>
      </div>
      <Button 
        variant="secondary" 
        onClick={onLogout}
        className="flex items-center space-x-2 self-end sm:self-auto w-auto"
        size="sm"
      >
        <LogOutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-sm sm:text-base">Logout</span>
      </Button>
    </header>
  );
};

export default DashboardHeader;
