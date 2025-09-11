
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
    <div className="fixed top-0 left-0 right-0 bg-[#0A2645] text-white p-2 sm:p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 z-20">
      <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="text-white border-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <div className="min-w-0 flex-1 sm:flex-none">
          <h2 className="text-sm sm:text-lg font-semibold truncate">{currentUser?.name}</h2>
          <p className="text-xs text-gray-300 truncate">
            Shift: {currentShift?.id} | Float: {formatCurrency(currentShift?.startFloat || 0)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-end">
        {onSimulateGlobalFound && onSimulateNotFound && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulateGlobalFound}
              className="text-green-400 border-green-400 hover:bg-green-400/20 text-xs px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Sim: Found</span>
              <span className="sm:hidden">Found</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSimulateNotFound}
              className="text-red-400 border-red-400 hover:bg-red-400/20 text-xs px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Sim: Not Found</span>
              <span className="sm:hidden">Not Found</span>
            </Button>
          </>
        )}
        
        <Button
          variant="default"
          size="sm"
          onClick={onEndShift}
          className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-semibold border-2 border-[#FAA225] shadow-lg text-xs sm:text-sm px-2 sm:px-3"
        >
          <span className="hidden sm:inline">End Shift</span>
          <span className="sm:hidden">End</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3"
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default POSHeader;
