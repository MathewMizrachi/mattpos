
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon, UsersIcon, ClockIcon, DollarSignIcon, ChefHat, Plus } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-l-4 border-[#FAA225]">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToDashboard}
                className="mr-4 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-[#0A2645] mb-1">Table Management</h1>
                <p className="text-[#0A2645]/70 text-lg">Cook2Day Restaurant System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid gap-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mb-8">
          {mockTables.map((table) => (
            <Card
              key={table.number}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                table.isOccupied 
                  ? 'bg-gradient-to-br from-[#FAA225] to-[#FAA225]/80 border-[#FAA225] shadow-lg transform' 
                  : 'bg-white border-gray-200 hover:border-[#0A2645] shadow-md'
              }`}
              onClick={() => handleTableClick(table)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    table.isOccupied ? 'text-white' : 'text-[#0A2645]'
                  }`}>
                    Table {table.number}
                  </div>
                  <div className={`text-sm font-medium ${
                    table.isOccupied ? 'text-white/90' : 'text-[#0A2645]/60'
                  }`}>
                    {table.isOccupied ? 'Occupied' : 'Available'}
                  </div>
                </CardTitle>
              </CardHeader>
              
              {table.isOccupied && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center text-white">
                          <DollarSignIcon className="h-4 w-4 mr-1" />
                          <span className="font-medium">Bill:</span>
                        </div>
                        <span className="font-bold text-white text-lg">
                          {formatCurrency(table.balance)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm mb-2">
                        <div className="flex items-center text-white">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          <span className="font-medium">People:</span>
                        </div>
                        <span className="font-bold text-white">
                          {table.peopleCount}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-white">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="font-medium">Time:</span>
                        </div>
                        <span className="font-bold text-white">
                          {formatTime(table.timeOccupied)}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-white/90 text-sm font-medium">
                        {table.orders.length} items ordered
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
              
              {!table.isOccupied && (
                <CardContent className="pt-0 text-center">
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div className="text-[#0A2645]/60 text-sm font-medium">Click to seat customers</div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          <Card className="bg-white border-l-4 border-[#FAA225] shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0A2645] flex items-center">
                <div className="bg-[#FAA225] p-2 rounded-lg mr-3">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
                Occupied Tables
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#FAA225] mb-1">
                {mockTables.filter(t => t.isOccupied).length}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                out of {mockTables.length} tables
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-green-500 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0A2645] flex items-center">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <DollarSignIcon className="h-5 w-5 text-white" />
                </div>
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 mb-1">
                {formatCurrency(mockTables.reduce((sum, table) => sum + table.balance, 0))}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                current open bills
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-[#0A2645] shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#0A2645] flex items-center">
                <div className="bg-[#0A2645] p-2 rounded-lg mr-3">
                  <UsersIcon className="h-5 w-5 text-white" />
                </div>
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#0A2645] mb-1">
                {mockTables.reduce((sum, table) => sum + table.peopleCount, 0)}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                currently dining
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-2xl bg-white border-2 border-[#0A2645] rounded-xl">
          <DialogHeader className="bg-gradient-to-r from-[#0A2645] to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-xl">
            <DialogTitle className="text-xl">
              Table {selectedTable?.number} - Order Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTable && (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#FAA225]/10 to-[#FAA225]/5 rounded-lg border-l-4 border-[#FAA225]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#0A2645]">
                    <UsersIcon className="h-4 w-4" />
                    <span className="font-medium">{selectedTable.peopleCount} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#0A2645]">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-medium">{formatTime(selectedTable.timeOccupied)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(selectedTable.balance)}
                  </div>
                  <div className="text-sm text-[#0A2645]/70">Total Bill</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0A2645]">Current Orders</h3>
                {selectedTable.orders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-4 border-2 border-gray-100 rounded-lg bg-white hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-medium text-[#0A2645]">{order.name}</div>
                      <div className="text-sm text-[#0A2645]/70">
                        Qty: {order.quantity} × {formatCurrency(order.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {order.status}
                      </Badge>
                      <div className="font-bold text-[#0A2645] text-lg">
                        {formatCurrency(order.price * order.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 bg-gray-50 p-6 -m-6 mt-6 rounded-b-xl border-t border-gray-200">
                <Button
                  onClick={handleAddMoreItems}
                  className="flex-1 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-semibold h-12"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Items
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowOrderDialog(false)}
                  className="flex-1 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white h-12"
                >
                  Close
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
