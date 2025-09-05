
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
  onSimulateGlobalFound?: () => void;
  onSimulateNotFound?: () => void;
}

const POSHeader: React.FC<POSHeaderProps> = ({
  currentUser,
  currentShift,
  onEndShift,
  onLogout,
  options,
  onSimulateGlobalFound,
  onSimulateNotFound,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#0A2645] text-white p-3 flex justify-between items-center z-20">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-white border-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Button>
        
        <div>
          <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
          <p className="text-xs text-gray-300">
            Shift: {currentShift?.id} | Float: {formatCurrency(currentShift?.startFloat || 0)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onSimulateGlobalFound && onSimulateNotFound && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulateGlobalFound}
              className="text-green-400 border-green-400 hover:bg-green-400/20 text-xs"
            >
              Sim: Found
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulateNotFound}
              className="text-red-400 border-red-400 hover:bg-red-400/20 text-xs"
            >
              Sim: Not Found
            </Button>
          </>
        )}
        
        <Button
          variant="default"
          size="sm"
          onClick={onEndShift}
          className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-semibold border-2 border-[#FAA225] shadow-lg"
        >
          End Shift
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-white hover:bg-white/20"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default POSHeader;
