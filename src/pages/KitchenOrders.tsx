
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftIcon, Clock, CheckCircle, AlertCircle, Users, ChefHat, Timer, Flame } from 'lucide-react';

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
      case 'pending': return 'bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 text-white shadow-lg';
      case 'preparing': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg';
      case 'ready': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Timer className="h-4 w-4" />;
      case 'preparing': return <ChefHat className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 shadow-red-200';
      case 'medium': return 'border-[#FAA225] shadow-orange-200';
      case 'low': return 'border-green-500 shadow-green-200';
      default: return 'border-gray-300 shadow-gray-200';
    }
  };

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-50 via-red-50/80 to-red-100/60';
      case 'medium': return 'bg-gradient-to-r from-orange-50 via-orange-50/80 to-orange-100/60';
      case 'low': return 'bg-gradient-to-r from-green-50 via-green-50/80 to-green-100/60';
      default: return 'bg-gradient-to-r from-gray-50 via-gray-50/80 to-gray-100/60';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/40 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <header className="bg-gradient-to-r from-white via-blue-50/80 to-blue-100/60 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#FAA225]/20 rounded-xl mb-8 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToDashboard}
                className="text-[#0A2645] hover:bg-[#0A2645]/10 hover:scale-110 transition-all duration-200 rounded-xl"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#FAA225] to-[#FAA225]/80 p-3 rounded-xl shadow-lg">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0A2645] to-[#0A2645]/80 bg-clip-text text-transparent">
                    👨‍🍳 Kitchen Orders
                  </h1>
                  <p className="text-sm text-[#0A2645]/70 font-medium">Cook2Day Restaurant System</p>
                </div>
              </div>
            </div>
            <div className="text-center bg-gradient-to-br from-[#FAA225] to-[#FAA225]/80 p-4 rounded-xl text-white shadow-lg">
              <div className="text-3xl font-bold mb-1">
                {orders.length}
              </div>
              <div className="text-white/90 text-sm font-medium flex items-center justify-center gap-1">
                🔥 Active Orders
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Orders List */}
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order.id} className={`bg-gradient-to-br from-white via-blue-50/50 to-blue-100/40 border-2 ${getPriorityColor(order.priority)} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-xl overflow-hidden`}>
              <CardHeader className={`pb-4 ${getPriorityGradient(order.priority)} rounded-t-xl border-b-2 border-white/50 shadow-lg`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-[#0A2645] to-[#0A2645]/80 text-white px-4 py-2 rounded-xl shadow-lg">
                      <div className="text-2xl font-bold flex items-center gap-2">
                        🍽️ Table {order.tableNumber}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary"
                      className={
                        order.priority === 'high' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-lg px-4 py-2 text-base font-bold' 
                          : order.priority === 'medium'
                          ? 'bg-gradient-to-r from-[#FAA225] to-[#FAA225]/80 text-white border-[#FAA225] shadow-lg px-4 py-2 text-base font-bold'
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg px-4 py-2 text-base font-bold'
                      }
                    >
                      {order.priority === 'high' && '🚨'} 
                      {order.priority === 'medium' && '⚡'} 
                      {order.priority === 'low' && '🟢'} 
                      {order.priority} priority
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[#0A2645] bg-white/80 px-4 py-2 rounded-xl border-2 border-white/60 shadow-lg backdrop-blur-sm">
                    <div className="bg-[#FAA225]/20 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-[#0A2645]" />
                    </div>
                    <span className="font-bold text-lg">⏰ {getTimeSince(order.orderTime)} ago</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-white via-blue-50/50 to-blue-100/30 rounded-xl border-2 border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                      <div className="flex-1">
                        <div className="font-bold text-[#0A2645] text-xl mb-2 flex items-center gap-2">
                          🍽️ {item.name}
                        </div>
                        <div className="text-[#0A2645]/80 text-base mb-2 flex items-center gap-2">
                          <span className="bg-blue-100 px-3 py-1 rounded-lg font-semibold">
                            📦 Qty: {item.quantity}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="bg-gradient-to-r from-[#FAA225]/10 to-[#FAA225]/5 text-[#0A2645] font-semibold px-3 py-2 rounded-lg text-sm inline-block border-2 border-[#FAA225]/30 shadow-md">
                            📝 Note: {item.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={`${getStatusColor(item.status)} flex items-center gap-2 px-4 py-2 text-base font-bold`}>
                          {getStatusIcon(item.status)}
                          <span className="capitalize">{item.status}</span>
                        </Badge>
                        
                        <div className="flex gap-3">
                          {item.status === 'pending' && (
                            <Button
                              size="lg"
                              onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              🔥 Start Cooking
                            </Button>
                          )}
                          {item.status === 'preparing' && (
                            <Button
                              size="lg"
                              onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              ✅ Ready to Serve
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
          <div className="text-center py-16 bg-gradient-to-br from-white via-blue-50/50 to-blue-100/40 rounded-2xl shadow-xl border-2 border-blue-200">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <div className="text-[#0A2645] text-2xl mb-3 font-bold">No active orders</div>
            <div className="text-[#0A2645]/70 text-lg">All caught up! Time for a break! 🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenOrders;
