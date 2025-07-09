
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingCart, 
  Users, 
  Utensils, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface RecentActivityProps {
  mode: 'till' | 'restaurant';
}

const RecentActivity: React.FC<RecentActivityProps> = ({ mode }) => {
  const tillActivities = [
    {
      id: 1,
      type: 'sale',
      description: 'Sale #1247 - Customer purchase',
      amount: 45.75,
      time: '2 min ago',
      icon: ShoppingCart
    },
    {
      id: 2,
      type: 'customer',
      description: 'New customer added - John Smith',
      time: '5 min ago',
      icon: Users
    },
    {
      id: 3,
      type: 'sale',
      description: 'Sale #1246 - Shop2Shop payment',
      amount: 125.00,
      time: '8 min ago',
      icon: ShoppingCart
    },
    {
      id: 4,
      type: 'refund',
      description: 'Refund processed - #1240',
      amount: -15.50,
      time: '12 min ago',
      icon: AlertCircle
    }
  ];

  const restaurantActivities = [
    {
      id: 1,
      type: 'order',
      description: 'Table 5 - Order completed',
      status: 'completed',
      time: '1 min ago',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'order',
      description: 'Table 3 - New order received',
      status: 'pending',
      time: '3 min ago',
      icon: Utensils
    },
    {
      id: 3,
      type: 'table',
      description: 'Table 7 - Party of 4 seated',
      time: '7 min ago',
      icon: Users
    },
    {
      id: 4,
      type: 'order',
      description: 'Table 1 - Order in kitchen',
      status: 'cooking',
      time: '10 min ago',
      icon: Clock
    }
  ];

  const activities = mode === 'till' ? tillActivities : restaurantActivities;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-[#0A2645] flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-3">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#FAA225]/10 rounded-full">
                      <IconComponent className="h-4 w-4 text-[#FAA225]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0A2645]">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {mode === 'till' && 'amount' in activity && (
                      <span className={`text-sm font-medium ${
                        activity.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(activity.amount))}
                      </span>
                    )}
                    {mode === 'restaurant' && 'status' in activity && (
                      <Badge variant={
                        activity.status === 'completed' ? 'default' :
                        activity.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
