
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ClipboardListIcon, 
  TableIcon, 
  PackageIcon, 
  UsersIcon, 
  ChartBarIcon 
} from 'lucide-react';

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
  onViewReports
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Take Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Start taking customer orders and process payments.
          </p>
          <Button 
            className="w-full" 
            onClick={onTakeOrders}
            style={{ backgroundColor: '#FAA225', color: 'black' }}
          >
            <ClipboardListIcon className="h-4 w-4 mr-2" />
            Take Orders
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Manage Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage restaurant table assignments.
          </p>
          <Button 
            className="w-full" 
            onClick={onManageTables}
            style={{ backgroundColor: '#FAA225', color: 'black' }}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Manage Tables
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Manage Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add, edit, or remove products from your inventory.
          </p>
          <Button className="w-full" onClick={onManageStock}>
            <PackageIcon className="h-4 w-4 mr-2" />
            Manage Stock
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customers and Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage customer accounts.
          </p>
          <Button className="w-full" onClick={onManageCustomers}>
            <UsersIcon className="h-4 w-4 mr-2" />
            Customers
          </Button>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View sales, inventory, and financial reports.
          </p>
          <Button className="w-full" onClick={onViewReports}>
            <ChartBarIcon className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestaurantActions;
