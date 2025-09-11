
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  AlertTriangle,
  Users,
  ChefHat,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

interface DashboardStatsProps {
  mode: 'till' | 'restaurant';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ mode }) => {
  const { currentShift } = useApp();
  
  // Mock data - in real app this would come from your data source
  const tillStats = {
    todaySales: 2450.75,
    transactionCount: 87,
    shiftHours: currentShift ? Math.floor((Date.now() - new Date(currentShift.startTime).getTime()) / (1000 * 60 * 60)) : 0,
    lowStockItems: 3
  };

  const restaurantStats = {
    activeOrders: 12,
    tablesOccupied: 8,
    totalTables: 15,
    todayRevenue: 1850.25,
    averageOrderValue: 35.50
  };

  if (mode === 'till') {
    return (
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Today's Sales</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">{formatCurrency(tillStats.todaySales)}</div>
            <p className="text-xs text-gray-600">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Transactions</CardTitle>
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">{tillStats.transactionCount}</div>
            <p className="text-xs text-gray-600">This shift</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Shift Time</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">{tillStats.shiftHours}h</div>
            <p className="text-xs text-gray-600">Current shift</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Low Stock</CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{tillStats.lowStockItems}</div>
            <p className="text-xs text-gray-600">Items need restocking</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-4 sm:mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Active Orders</CardTitle>
          <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">{restaurantStats.activeOrders}</div>
          <p className="text-xs text-gray-600">Kitchen & pending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Tables</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">
            {restaurantStats.tablesOccupied}/{restaurantStats.totalTables}
          </div>
          <p className="text-xs text-gray-600">Occupied tables</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Today's Revenue</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">{formatCurrency(restaurantStats.todayRevenue)}</div>
          <p className="text-xs text-gray-600">+8% from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-[#0A2645] leading-tight">Avg Order</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-[#FAA225] flex-shrink-0" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A2645]">{formatCurrency(restaurantStats.averageOrderValue)}</div>
          <p className="text-xs text-gray-600">Per order today</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
