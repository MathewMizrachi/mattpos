
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCartIcon, 
  PackageIcon, 
  UsersIcon, 
  ChartBarIcon, 
  AlertCircleIcon 
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
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {hasActiveShift ? (
        <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <Button
              onClick={onResumeShift}
              className="w-full h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-lg font-semibold flex flex-col items-center justify-center gap-2"
            >
              <AlertCircleIcon className="h-8 w-8" />
              Resume Shift
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <Button
              onClick={onStartShift}
              className="w-full h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-lg font-semibold flex flex-col items-center justify-center gap-2"
            >
              <ShoppingCartIcon className="h-8 w-8" />
              Open Till
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onManageStock}
            className="w-full h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <PackageIcon className="h-8 w-8" />
            Till Stock
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onManageCustomers}
            className="w-full h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <UsersIcon className="h-8 w-8" />
            Manage Customers
          </Button>
        </CardContent>
      </Card>
      
      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onViewReports}
            className="w-full h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <ChartBarIcon className="h-8 w-8" />
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActions;
