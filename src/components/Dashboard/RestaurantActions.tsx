
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Table, Package, FileText, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RestaurantActionsProps {
  onTakeOrders: () => void;
  onManageTables: () => void;
  onManageStock: () => void;
  onManageCustomers: () => void;
  onViewReports: () => void;
}

const RestaurantActions: React.FC<RestaurantActionsProps> = ({
  onTakeOrders,
  onManageTables,
  onManageStock,
  onManageCustomers,
  onViewReports,
}) => {
  const navigate = useNavigate();

  const handleKitchenOrders = () => {
    navigate('/kitchen-orders');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onTakeOrders}
            className="w-full h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Users className="h-8 w-8" />
            Take Orders
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onManageTables}
            className="w-full h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Table className="h-8 w-8" />
            Manage Tables
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={handleKitchenOrders}
            className="w-full h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <ChefHat className="h-8 w-8" />
            Kitchen Orders
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onManageStock}
            className="w-full h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Package className="h-8 w-8" />
            Manage Stock
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-6">
          <Button
            onClick={onManageCustomers}
            className="w-full h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Users className="h-8 w-8" />
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
            <FileText className="h-8 w-8" />
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantActions;
