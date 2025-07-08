
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon, UsersIcon, ClockIcon, DollarSignIcon, ChefHat, Plus, Utensils, Coffee } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock table data with orders
const mockTables = Array.from({ length: 25 }, (_, i) => {
  const tableNumber = i + 1;
  const isOccupied = Math.random() > 0.6;
  
  const mockOrders = isOccupied ? [
    { id: 1, name: 'Burger & Chips', price: 45, quantity: 2, status: 'pending' },
    { id: 2, name: 'Coca Cola 330ml', price: 12, quantity: 3, status: 'ready' },
    { id: 3, name: 'Fish & Chips', price: 55, quantity: 1, status: 'preparing' },
  ] : [];
  
  return {
    number: tableNumber,
    isOccupied,
    balance: isOccupied ? mockOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0) : 0,
    peopleCount: isOccupied ? Math.floor(Math.random() * 6) + 1 : 0,
    timeOccupied: isOccupied ? Math.floor(Math.random() * 180) + 15 : 0,
    orders: mockOrders,
  };
});

const TableManagement = () => {
  const navigate = useNavigate();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTableClick = (table) => {
    if (table.isOccupied) {
      setSelectedTable(table);
      setShowOrderDialog(true);
    } else {
      // Navigate to POS to start taking orders for this table
      navigate('/pos', { 
        state: { 
          selectedTable: table.number, 
          peopleCount: 0,
          isNewOrder: true
        } 
      });
    }
  };

  const handleAddMoreItems = () => {
    setShowOrderDialog(false);
    navigate('/pos', { 
      state: { 
        selectedTable: selectedTable.number, 
        peopleCount: selectedTable.peopleCount,
        isAddingToOrder: true,
        existingOrders: selectedTable.orders
      } 
    });
  };

  const handleViewKitchenOrders = () => {
    navigate('/kitchen-orders');
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'preparing': return 'bg-blue-500';
      case 'ready': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 p-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <header className="bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#FAA225]/20 rounded-xl mb-8 backdrop-blur-sm">
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
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0A2645] to-[#0A2645]/80 bg-clip-text text-transparent">
                    🍽️ Table Management
                  </h1>
                  <p className="text-sm text-[#0A2645]/70 font-medium">Cook2Day Restaurant System</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#0A2645]">
                {mockTables.filter(t => t.isOccupied).length}/{mockTables.length} Tables Active
              </div>
              <div className="text-sm text-[#0A2645]/60">Live Management</div>
            </div>
          </div>
        </header>

        {/* Enhanced Tables Grid */}
        <div className="grid gap-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 mb-8">
          {mockTables.map((table) => (
            <Card
              key={table.number}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 group ${
                table.isOccupied 
                  ? 'bg-gradient-to-br from-[#FAA225] via-[#FAA225]/90 to-[#FAA225]/80 border-2 border-[#FAA225] shadow-xl transform animate-pulse' 
                  : 'bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 border-2 border-gray-200 hover:border-[#0A2645]/30 shadow-lg hover:shadow-xl'
              }`}
              onClick={() => handleTableClick(table)}
            >
              <CardHeader className="pb-3 p-4">
                <CardTitle className="text-center">
                  <div className={`text-2xl font-bold mb-2 flex items-center justify-center gap-2 ${
                    table.isOccupied ? 'text-white' : 'text-[#0A2645]'
                  }`}>
                    {table.isOccupied ? '🍽️' : '🪑'}
                    <span>Table {table.number}</span>
                  </div>
                  <div className={`text-xs font-semibold px-3 py-1 rounded-full inline-block ${
                    table.isOccupied 
                      ? 'bg-white/20 text-white backdrop-blur-sm' 
                      : 'bg-gray-100 text-[#0A2645]/70'
                  }`}>
                    {table.isOccupied ? '🔴 Occupied' : '🟢 Available'}
                  </div>
                </CardTitle>
              </CardHeader>
              
              {table.isOccupied && (
                <CardContent className="pt-0 p-4">
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm border border-white/30">
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white font-medium">
                            <DollarSignIcon className="h-3 w-3 mr-1" />
                            <span>💰 Bill:</span>
                          </div>
                          <span className="font-bold text-white text-sm bg-white/20 px-2 py-1 rounded-lg">
                            {formatCurrency(table.balance)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white font-medium">
                            <UsersIcon className="h-3 w-3 mr-1" />
                            <span>👥 People:</span>
                          </div>
                          <span className="font-bold text-white bg-white/20 px-2 py-1 rounded-lg">
                            {table.peopleCount}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white font-medium">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            <span>⏱️ Time:</span>
                          </div>
                          <span className="font-bold text-white bg-white/20 px-2 py-1 rounded-lg">
                            {formatTime(table.timeOccupied)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                      <span className="text-white font-semibold text-sm flex items-center justify-center gap-1">
                        📋 {table.orders.length} items ordered
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
              
              {!table.isOccupied && (
                <CardContent className="pt-0 text-center p-4">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-xl p-4 border-2 border-dashed border-gray-300 group-hover:border-[#0A2645]/40 transition-all duration-300">
                    <div className="text-[#0A2645]/70 text-sm font-semibold flex items-center justify-center gap-2">
                      <Coffee className="h-4 w-4" />
                      Click to seat customers
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Enhanced Summary Stats */}
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          <Card className="bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/20 border-l-4 border-[#FAA225] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3 p-6">
              <CardTitle className="text-lg text-[#0A2645] flex items-center">
                <div className="bg-gradient-to-br from-[#FAA225] to-[#FAA225]/80 p-3 rounded-xl mr-4 shadow-lg">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-base">🪑 Occupied Tables</span>
                  <div className="text-xs text-[#0A2645]/60 font-normal">Active dining areas</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-[#FAA225] mb-1">
                  {mockTables.filter(t => t.isOccupied).length}
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#0A2645]/70">
                    out of {mockTables.length} tables
                  </div>
                  <div className="text-xs text-[#0A2645]/50">
                    {Math.round((mockTables.filter(t => t.isOccupied).length / mockTables.length) * 100)}% occupancy
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 border-l-4 border-green-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3 p-6">
              <CardTitle className="text-lg text-[#0A2645] flex items-center">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl mr-4 shadow-lg">
                  <DollarSignIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-base">💰 Total Revenue</span>
                  <div className="text-xs text-[#0A2645]/60 font-normal">Current active bills</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {formatCurrency(mockTables.reduce((sum, table) => sum + table.balance, 0))}
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#0A2645]/70">
                    open bills
                  </div>
                  <div className="text-xs text-[#0A2645]/50">
                    Live totals
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-l-4 border-[#0A2645] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3 p-6">
              <CardTitle className="text-lg text-[#0A2645] flex items-center">
                <div className="bg-gradient-to-br from-[#0A2645] to-[#0A2645]/80 p-3 rounded-xl mr-4 shadow-lg">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-base">👥 Total Customers</span>
                  <div className="text-xs text-[#0A2645]/60 font-normal">Currently dining</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-[#0A2645] mb-1">
                  {mockTables.reduce((sum, table) => sum + table.peopleCount, 0)}
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#0A2645]/70">
                    guests seated
                  </div>
                  <div className="text-xs text-[#0A2645]/50">
                    Right now
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 border-2 border-[#0A2645] rounded-2xl shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-[#0A2645] via-[#0A2645]/95 to-[#0A2645]/90 text-white p-8 -m-6 mb-8 rounded-t-2xl shadow-lg">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                🍽️
              </div>
              Table {selectedTable?.number} - Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTable && (
            <div className="space-y-8">
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-[#FAA225]/10 via-[#FAA225]/5 to-orange-50/30 rounded-xl border-l-4 border-[#FAA225] shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#0A2645]">
                    <div className="bg-[#FAA225]/20 p-2 rounded-lg">
                      <UsersIcon className="h-5 w-5 text-[#0A2645]" />
                    </div>
                    <span className="font-semibold">👥 {selectedTable.peopleCount} people</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#0A2645]">
                    <div className="bg-[#FAA225]/20 p-2 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-[#0A2645]" />
                    </div>
                    <span className="font-semibold">⏱️ {formatTime(selectedTable.timeOccupied)}</span>
                  </div>
                </div>
                <div className="text-right bg-white/50 p-4 rounded-xl backdrop-blur-sm border border-white/60">
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    {formatCurrency(selectedTable.balance)}
                  </div>
                  <div className="text-sm text-[#0A2645]/70 font-medium">💰 Total Bill</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0A2645] flex items-center gap-2">
                  📋 Current Orders
                  <span className="text-sm font-normal bg-[#FAA225]/20 px-3 py-1 rounded-full">
                    {selectedTable.orders.length} items
                  </span>
                </h3>
                <div className="space-y-3">
                  {selectedTable.orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-5 border-2 border-gray-100 rounded-xl bg-gradient-to-r from-white to-gray-50/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex-1">
                        <div className="font-semibold text-[#0A2645] text-lg mb-1">{order.name}</div>
                        <div className="text-sm text-[#0A2645]/70 flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-1 rounded-lg">
                            Qty: {order.quantity} × {formatCurrency(order.price)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={`${getStatusColor(order.status)} text-white font-semibold px-3 py-1`}>
                          {order.status === 'pending' && '⏳'}
                          {order.status === 'preparing' && '👨‍🍳'}
                          {order.status === 'ready' && '✅'}
                          {' ' + order.status}
                        </Badge>
                        <div className="font-bold text-[#0A2645] text-xl bg-green-100 px-3 py-2 rounded-lg">
                          {formatCurrency(order.price * order.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6 bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 p-8 -m-6 mt-8 rounded-b-2xl border-t border-gray-200">
                <Button
                  onClick={handleAddMoreItems}
                  className="flex-1 bg-gradient-to-r from-[#FAA225] to-[#FAA225]/90 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-[#0A2645] font-bold h-14 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  🍽️ Add More Items
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOrderDialog(false)}
                  className="flex-1 border-2 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ❌ Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableManagement;
