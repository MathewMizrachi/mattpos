
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
    <header className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/fd658335-de63-4813-b0d9-355f4313e4a5.png" 
            alt="Shop2Shop Logo" 
            className="h-12 w-auto object-contain mr-3"
          />
          <div>
            <h1 
              className="text-4xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleMode}
              title={`Switch to ${currentMode === 'till' ? 'Cook2Day' : 'Till2Day'}`}
            >
              {currentMode === 'till' ? 'Till2Day' : 'Cook2Day'}
            </h1>
            <p className="text-muted-foreground">Welcome, {userName}</p>
          </div>
        </div>
      </div>
      <Button 
        variant="secondary" 
        onClick={onLogout}
        className="flex items-center space-x-2"
      >
        <LogOutIcon className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </header>
  );
};

export default DashboardHeader;
