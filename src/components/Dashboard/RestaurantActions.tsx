
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Table, FileText, ChefHat, Utensils, DollarSign } from 'lucide-react';
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

  const handleRestaurantStock = () => {
    navigate('/restaurant-stock');
  };

  const handleRecipes = () => {
    navigate('/recipes');
  };

  const handleCashup = () => {
    navigate('/cashup');
  };

  return (
    <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3">
      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onTakeOrders}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Take Orders</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onManageTables}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <Table className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Manage Tables</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={handleKitchenOrders}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Kitchen Orders</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={handleRestaurantStock}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <Utensils className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight text-center">Restaurant Stock</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={handleRecipes}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Recipes</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onManageCustomers}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight text-center">Manage Customers</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#0A2645] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={handleCashup}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#0A2645] hover:bg-[#0A2645]/90 text-white text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">Cashup</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-[#FAA225] hover:shadow-lg transition-all">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <Button
            onClick={onViewReports}
            className="w-full h-16 sm:h-20 lg:h-24 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] text-sm sm:text-base lg:text-lg font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2"
          >
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
            <span className="leading-tight">View Reports</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantActions;
