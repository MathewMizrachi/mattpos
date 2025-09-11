
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  BarChart3, 
  Users, 
  Package, 
  DollarSign,
  Play
} from 'lucide-react';

interface DashboardActionsProps {
  hasActiveShift: boolean;
  onStartShift: () => void;
  onResumeShift: () => void;
  onManageStock: () => void;
  onManageCustomers: () => void;
  onViewReports: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ 
  hasActiveShift,
  onStartShift,
  onResumeShift,
  onManageStock,
  onManageCustomers,
  onViewReports
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3">
      {hasActiveShift ? (
        <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <Button
              onClick={onResumeShift}
              className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
            >
              <Play className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
              <span className="leading-tight">Resume Shift</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <Button
              onClick={onStartShift}
              className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
            >
              <Calculator className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
              <span className="leading-tight">Start Shift</span>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onManageStock}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Manage Stock</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onManageCustomers}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Manage Customers</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={() => navigate('/cashup')}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Cashup</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onViewReports}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">View Reports</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions;
