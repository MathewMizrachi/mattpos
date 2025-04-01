
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User, Shift } from '@/types';

interface POSHeaderProps {
  currentUser: User | null;
  currentShift: Shift | null;
  onEndShift: () => void;
  onLogout: () => void;
}

const POSHeader: React.FC<POSHeaderProps> = ({
  currentUser,
  currentShift,
  onEndShift,
  onLogout
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  return (
    <header className="bg-white p-4 shadow-sm z-50 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-primary">MiniPos</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{currentUser?.name}</span>
          <span>•</span>
          <span>Shift Active</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          onClick={onEndShift}
          style={{ backgroundColor: '#FAA225', color: 'black' }}
        >
          End Shift
        </Button>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOutIcon className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default POSHeader;
