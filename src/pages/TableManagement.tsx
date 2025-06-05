
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, UsersIcon, ClockIcon, DollarSignIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock table data - in a real app this would come from your database
const mockTables = Array.from({ length: 25 }, (_, i) => {
  const tableNumber = i + 1;
  const isOccupied = Math.random() > 0.6; // 40% chance of being occupied
  
  return {
    number: tableNumber,
    isOccupied,
    balance: isOccupied ? Math.random() * 200 + 10 : 0,
    peopleCount: isOccupied ? Math.floor(Math.random() * 6) + 1 : 0,
    timeOccupied: isOccupied ? Math.floor(Math.random() * 180) + 15 : 0, // minutes
  };
});

const TableManagement = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTableClick = (tableNumber: number) => {
    // In a real app, this would navigate to table details or POS for that table
    console.log(`Clicked on table ${tableNumber}`);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleBackToDashboard}
              className="mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-primary">Table Management</h1>
              <p className="text-muted-foreground">Cook2Day Restaurant System</p>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid gap-4 md:grid-cols-5 sm:grid-cols-3 grid-cols-2">
          {mockTables.map((table) => (
            <Card
              key={table.number}
              className={`cursor-pointer transition-all hover:scale-105 ${
                table.isOccupied 
                  ? 'border-orange-500 bg-orange-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              onClick={() => handleTableClick(table.number)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-center">
                  <div className={`text-2xl font-bold ${
                    table.isOccupied ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    Table {table.number}
                  </div>
                  <div className={`text-sm ${
                    table.isOccupied ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                    {table.isOccupied ? 'Occupied' : 'Available'}
                  </div>
                </CardTitle>
              </CardHeader>
              
              {table.isOccupied && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <DollarSignIcon className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium">Bill:</span>
                      </div>
                      <span className="font-bold text-green-600">
                        {formatCurrency(table.balance)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1 text-blue-600" />
                        <span className="font-medium">People:</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        {table.peopleCount}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-purple-600" />
                        <span className="font-medium">Time:</span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {formatTime(table.timeOccupied)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              )}
              
              {!table.isOccupied && (
                <CardContent className="pt-0 text-center">
                  <div className="text-gray-400 text-sm">Click to seat customers</div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Occupied Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {mockTables.filter(t => t.isOccupied).length}
              </div>
              <div className="text-sm text-muted-foreground">
                out of {mockTables.length} tables
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(mockTables.reduce((sum, table) => sum + table.balance, 0))}
              </div>
              <div className="text-sm text-muted-foreground">
                current open bills
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {mockTables.reduce((sum, table) => sum + table.peopleCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                currently dining
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
