
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X,
  Package,
  Users,
  DollarSign,
  Clock
} from 'lucide-react';

interface NotificationCenterProps {
  mode: 'till' | 'restaurant';
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ mode }) => {
  const tillNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'Milk (2L) - Only 3 items left',
      time: '5 min ago',
      icon: Package,
      color: 'orange'
    },
    {
      id: 2,
      type: 'info',
      title: 'Customer Payment',
      message: 'John Smith made account payment of $125.00',
      time: '15 min ago',
      icon: DollarSign,
      color: 'blue'
    },
    {
      id: 3,
      type: 'success',
      title: 'Shift Milestone',
      message: 'Congratulations! 50 transactions completed today',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const restaurantNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Order Delay',
      message: 'Table 3 order taking longer than expected (25 min)',
      time: '2 min ago',
      icon: Clock,
      color: 'orange'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Reservation',
      message: 'Party of 6 booked for 7:30 PM tonight',
      time: '10 min ago',
      icon: Users,
      color: 'blue'
    },
    {
      id: 3,
      type: 'success',
      title: 'Kitchen Update',
      message: 'All orders are caught up - great job team!',
      time: '30 min ago',
      icon: CheckCircle,
      color: 'green'
    }
  ];

  const notifications = mode === 'till' ? tillNotifications : restaurantNotifications;

  const getIconColor = (color: string) => {
    switch (color) {
      case 'orange': return 'text-orange-500';
      case 'blue': return 'text-blue-500';
      case 'green': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive';
      case 'success': return 'default';
      default: return 'secondary';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#0A2645] flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          <Badge variant="secondary" className="ml-2">
            {notifications.length}
          </Badge>
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#0A2645]">
          Clear All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div key={notification.id} className="flex items-start justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${getIconColor(notification.color)}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-[#0A2645]">{notification.title}</p>
                        <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
