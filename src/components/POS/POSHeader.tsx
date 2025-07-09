
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface POSHeaderProps {
  currentUser: any;
  currentShift: any;
  onEndShift: () => void;
  onLogout: () => void;
  options: any[];
}

const POSHeader: React.FC<POSHeaderProps> = ({
  currentUser,
  currentShift,
  onEndShift,
  onLogout,
  options,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#0A2645] text-white p-3 flex justify-between items-center z-20">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
          <p className="text-xs text-gray-300">
            Shift: {currentShift?.id} | Float: {formatCurrency(currentShift?.startFloat || 0)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-white border-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onEndShift}
          className="text-white border-white hover:bg-white/20"
        >
          End Shift
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-white hover:bg-white/20"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default POSHeader;
