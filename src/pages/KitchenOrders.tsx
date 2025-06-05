
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';

// Mock kitchen orders data
const mockKitchenOrders = [
  {
    id: 1,
    tableNumber: 3,
    orderTime: new Date(Date.now() - 10 * 60000),
    items: [
      { id: 1, name: 'Burger & Chips', quantity: 2, notes: 'No onions', status: 'preparing' },
      { id: 2, name: 'Fish & Chips', quantity: 1, notes: 'Extra lemon', status: 'pending' },
    ],
    priority: 'high'
  },
  {
    id: 2,
    tableNumber: 7,
    orderTime: new Date(Date.now() - 5 * 60000),
    items: [
      { id: 3, name: 'Chicken Curry', quantity: 1, notes: '', status: 'pending' },
      { id: 4, name: 'Rice', quantity: 2, notes: '', status: 'pending' },
    ],
    priority: 'medium'
  },
  {
    id: 3,
    tableNumber: 12,
    orderTime: new Date(Date.now() - 15 * 60000),
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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#FAA225] text-white';
      case 'preparing': return 'bg-blue-500 text-white';
      case 'ready': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-[#FAA225]';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  // Sort orders by priority and time
  const sortedOrders = orders.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
    }
    return a.orderTime.getTime() - b.orderTime.getTime();
  });

  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-2 border-[#FAA225]">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleBackToDashboard}
                className="mr-4 bg-[#0A2645] text-white hover:bg-[#0A2645]/90"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-[#0A2645]">Kitchen Orders</h1>
                <p className="text-[#0A2645]/70">Manage and track all incoming orders</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FAA225]">
                {orders.length}
              </div>
              <div className="text-[#0A2645]/70">Active Orders</div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id} className={`bg-white border-2 ${getPriorityColor(order.priority)}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-[#0A2645]">
                      Table {order.tableNumber}
                    </div>
                    <Badge 
                      variant="secondary"
                      className={
                        order.priority === 'high' 
                          ? 'bg-red-500 text-white' 
                          : order.priority === 'medium'
                          ? 'bg-[#FAA225] text-white'
                          : 'bg-green-500 text-white'
                      }
                    >
                      {order.priority} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[#0A2645]/70">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeSince(order.orderTime)} ago</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold text-[#0A2645] text-lg">{item.name}</div>
                        <div className="text-[#0A2645]/70">Quantity: {item.quantity}</div>
                        {item.notes && (
                          <div className="text-[#FAA225] font-medium">Note: {item.notes}</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                          {getStatusIcon(item.status)}
                          {item.status}
                        </Badge>
                        
                        <div className="flex gap-2">
                          {item.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                              Start
                            </Button>
                          )}
                          {item.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              Ready
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-white text-2xl mb-4">No active orders</div>
            <div className="text-white/70">All caught up! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenOrders;
