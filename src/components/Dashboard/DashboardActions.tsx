
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  BarChart3, 
  Users, 
  Package, 
  LogOut,
  DollarSign
} from 'lucide-react';

interface DashboardActionsProps {
  onEndShift: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({ onEndShift }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: BarChart3,
      label: 'Reports',
      description: 'View sales and analytics',
      action: () => navigate('/reports'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Users,
      label: 'Customers',
      description: 'Manage customer accounts',
      action: () => navigate('/customers'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Package,
      label: 'Stock',
      description: 'Inventory management',
      action: () => navigate('/stock-management'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: DollarSign,
      label: 'Cashup',
      description: 'End of day till reconciliation',
      action: () => navigate('/cashup'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardContent className="p-4 text-center">
              <Button
                variant="ghost"
                onClick={action.action}
                className="w-full h-auto flex flex-col items-center space-y-2 p-4"
              >
                <div className={`p-3 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{action.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Management Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="destructive" 
          onClick={onEndShift}
          className="flex-1 h-12 text-lg font-semibold"
        >
          <LogOut className="mr-2 h-5 w-5" />
          End Shift
        </Button>
      </div>
    </div>
  );
};

export default DashboardActions;
