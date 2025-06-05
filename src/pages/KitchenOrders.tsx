import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock kitchen orders data
const mockKitchenOrders = [
  {
    id: 1,
    tableNumber: 3,
    orderTime: new Date(Date.now() - 10 * 60000), // 10 minutes ago
    items: [
      { id: 1, name: 'Burger & Chips', quantity: 2, notes: 'No onions', status: 'preparing' },
      { id: 2, name: 'Fish & Chips', quantity: 1, notes: 'Extra lemon', status: 'pending' },
    ],
    priority: 'high'
  },
  {
    id: 2,
    tableNumber: 7,
    orderTime: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    items: [
      { id: 3, name: 'Chicken Curry', quantity: 1, notes: '', status: 'pending' },
      { id: 4, name: 'Rice', quantity: 2, notes: '', status: 'pending' },
    ],
    priority: 'medium'
  },
  {
    id: 3,
    tableNumber: 12,
    orderTime: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    items: [
      { id: 5, name: 'Steak & Eggs', quantity: 1, notes: 'Medium rare', status: 'ready' },
      { id: 6, name: 'Side Salad', quantity: 1, notes: '', status: 'ready' },
    ],
    priority: 'low'
  },
];

const KitchenOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(mockKitchenOrders);

  const handleBackToTables = () => {
    navigate('/tables');
  };

  const updateItemStatus = (orderId: number, itemId: number, newStatus: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map(item =>
                item.id === itemId ? { ...item, status: newStatus } : item
              )
            }
          : order
      )
    );
  };

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Sort orders by priority and time
  const sortedOrders = orders.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    }
    return a.orderTime.getTime() - b.orderTime.getTime(); // Older orders first
  });

  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleBackToTables}
              className="mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Kitchen Orders</h1>
              <p className="text-muted-foreground">Cook2Day Restaurant System - Kitchen View</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              {orders.length}
            </div>
            <div className="text-sm text-gray-600">Active Orders</div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedOrders.map((order) => (
            <Card
              key={order.id}
              className={`${getPriorityColor(order.priority)} border-2`}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold">Table {order.tableNumber}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.priority === 'high' ? 'destructive' : 'secondary'}>
                      {order.priority}
                    </Badge>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getTimeSince(order.orderTime)}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                          {item.notes && (
                            <div className="text-sm text-blue-600 italic">Note: {item.notes}</div>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(item.status)} text-white flex items-center gap-1`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {item.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Start Cooking
                          </Button>
                        )}
                        {item.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Mark Ready
                          </Button>
                        )}
                        {item.status === 'ready' && (
                          <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Ready for Service
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-xl mb-2">No active orders</div>
            <div className="text-gray-400">All caught up! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenOrders;
