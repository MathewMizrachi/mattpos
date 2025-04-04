
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {hasActiveShift ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <AlertCircleIcon className="h-4 w-4 mr-2 text-amber-500" />
              Active Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You have an active shift. Resume your current shift.
            </p>
            <Button 
              className="w-full" 
              onClick={onResumeShift}
              style={{ backgroundColor: '#FAA225', color: 'black' }}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Resume Shift
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Start Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Start a new shift to begin processing sales.
            </p>
            <Button 
              className="w-full" 
              onClick={onStartShift}
              style={{ backgroundColor: '#FAA225', color: 'black' }}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Start Shift
            </Button>
          </CardContent>
        </Card>
      )}
      
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
          <CardTitle>View Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View and manage customer accounts.
          </p>
          <Button className="w-full" onClick={onManageCustomers}>
            <UsersIcon className="h-4 w-4 mr-2" />
            View Customers
          </Button>
        </CardContent>
      </Card>
      
      <Card>
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

export default DashboardActions;
