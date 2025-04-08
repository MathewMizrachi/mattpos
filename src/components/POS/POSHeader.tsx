
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { User, Shift } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleEndShift = () => {
    onEndShift();
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
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
          <h1 className="text-2xl font-bold text-primary">MiniPOS</h1>
          <div className="flex items-center space-x-2 text-muted-foreground" style={isMobile ? {fontSize: '0.75rem'} : {}}>
            <span>{currentUser?.name}</span>
            <span>•</span>
            <span>Shift Active</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {isMobile ? (
          // Mobile view - show End Shift and back button
          <>
            <Button
              className="bg-[#0A2645] hover:bg-[#0A2645]/90 text-[#FAA225]"
              onClick={handleEndShift}
            >
              End Shift
            </Button>
            <Button
              className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
              size="icon"
              onClick={handleGoToDashboard}
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          // Desktop view - buttons for both options
          <>
            <Button
              variant="outline"
              className="bg-transparent border border-gray-300 hover:bg-gray-100 text-[#0A2645]"
              onClick={handleGoToDashboard}
            >
              Dashboard
            </Button>
            <Button
              className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-medium"
              onClick={handleEndShift}
            >
              End Shift
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default POSHeader;
