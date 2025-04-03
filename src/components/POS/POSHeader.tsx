
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOutIcon, MoreVerticalIcon } from 'lucide-react';
import { User, Shift } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderOption {
  label: string;
  action: () => void;
}

interface POSHeaderProps {
  currentUser: User | null;
  currentShift: Shift | null;
  onEndShift: () => void;
  onLogout: () => void;
  options?: HeaderOption[];
}

const POSHeader: React.FC<POSHeaderProps> = ({
  currentUser,
  currentShift,
  onEndShift,
  onLogout,
  options = []
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  return (
    <header className="bg-white p-4 shadow-sm z-50 flex justify-between items-center fixed top-0 left-0 right-0">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/21ec9284-d40a-4bca-a789-7478910aa1fd.png" 
          alt="Shop2Shop Logo" 
          className="h-10 mr-2" 
        />
        <div>
          <h1 className="text-2xl font-bold text-primary">MiniPos</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{currentUser?.name}</span>
            <span>•</span>
            <span>Shift Active</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {options.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {options.map((option, index) => (
                <DropdownMenuItem 
                  key={index}
                  onClick={option.action}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
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
