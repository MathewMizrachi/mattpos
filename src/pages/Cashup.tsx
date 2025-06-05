
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeftIcon, DollarSignIcon, ClockIcon, UsersIcon, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

// Mock data for active tills
const mockTills = [
  {
    id: 1,
    tillNumber: 'TILL-001',
    user: 'John Doe',
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    startFloat: 100,
    currentSales: 1250.75,
    transactionCount: 45,
    expectedCash: 350.25,
    status: 'active'
  },
  {
    id: 2,
    tillNumber: 'TILL-002',
    user: 'Jane Smith',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    startFloat: 150,
    currentSales: 890.50,
    transactionCount: 32,
    expectedCash: 425.75,
    status: 'active'
  },
  {
    id: 3,
    tillNumber: 'TILL-003',
    user: 'Mike Johnson',
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    startFloat: 100,
    currentSales: 0,
    transactionCount: 0,
    expectedCash: 100,
    status: 'idle'
  }
];

const Cashup = () => {
  const navigate = useNavigate();
  const [selectedTill, setSelectedTill] = useState(null);
  const [showCashupDialog, setShowCashupDialog] = useState(false);
  const [actualCash, setActualCash] = useState('');

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTillCashup = (till) => {
    setSelectedTill(till);
    setActualCash(till.expectedCash.toString());
    setShowCashupDialog(true);
  };

  const handleSubmitCashup = () => {
    const difference = parseFloat(actualCash) - selectedTill.expectedCash;
    console.log(`Till ${selectedTill.tillNumber} cashup completed. Difference: ${formatCurrency(difference)}`);
    setShowCashupDialog(false);
    setSelectedTill(null);
    setActualCash('');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getHoursWorked = (startTime) => {
    const hours = (Date.now() - new Date(startTime).getTime()) / (1000 * 60 * 60);
    return Math.floor(hours * 10) / 10; // Round to 1 decimal place
  };

  const getTotalSales = () => {
    return mockTills.reduce((sum, till) => sum + till.currentSales, 0);
  };

  const getTotalTransactions = () => {
    return mockTills.reduce((sum, till) => sum + till.transactionCount, 0);
  };

  const getActiveTillsCount = () => {
    return mockTills.filter(till => till.status === 'active').length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border-l-4 border-[#FAA225]">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBackToDashboard}
                className="mr-4 bg-white border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[#0A2645] mb-1">End of Day Cashup</h1>
                <p className="text-[#0A2645]/70">Till2Day Restaurant System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 mb-6">
          <Card className="bg-white border-l-4 border-[#FAA225] shadow-lg">
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-base text-[#0A2645] flex items-center">
                <div className="bg-[#FAA225] p-2 rounded-lg mr-3">
                  <Calculator className="h-4 w-4 text-white" />
                </div>
                Active Tills
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-bold text-[#FAA225] mb-1">
                {getActiveTillsCount()}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                out of {mockTills.length} total
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-green-500 shadow-lg">
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-base text-[#0A2645] flex items-center">
                <div className="bg-green-500 p-2 rounded-lg mr-3">
                  <DollarSignIcon className="h-4 w-4 text-white" />
                </div>
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(getTotalSales())}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                across all tills
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-blue-500 shadow-lg">
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-base text-[#0A2645] flex items-center">
                <div className="bg-blue-500 p-2 rounded-lg mr-3">
                  <UsersIcon className="h-4 w-4 text-white" />
                </div>
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {getTotalTransactions()}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                total today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-l-4 border-purple-500 shadow-lg">
            <CardHeader className="pb-2 p-4">
              <CardTitle className="text-base text-[#0A2645] flex items-center">
                <div className="bg-purple-500 p-2 rounded-lg mr-3">
                  <ClockIcon className="h-4 w-4 text-white" />
                </div>
                Avg Transaction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {formatCurrency(getTotalTransactions() > 0 ? getTotalSales() / getTotalTransactions() : 0)}
              </div>
              <div className="text-sm text-[#0A2645]/70">
                per sale
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Till Cards */}
        <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 grid-cols-1">
          {mockTills.map((till) => (
            <Card
              key={till.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                till.status === 'active' 
                  ? 'bg-white border-[#FAA225] shadow-lg border-2' 
                  : 'bg-gray-50 border-gray-200 shadow-md'
              }`}
            >
              <CardHeader className="pb-3 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className={`text-xl font-bold mb-1 ${
                      till.status === 'active' ? 'text-[#0A2645]' : 'text-gray-500'
                    }`}>
                      {till.tillNumber}
                    </CardTitle>
                    <p className={`text-sm ${
                      till.status === 'active' ? 'text-[#0A2645]/70' : 'text-gray-400'
                    }`}>
                      Operator: {till.user}
                    </p>
                  </div>
                  <Badge variant={till.status === 'active' ? 'default' : 'secondary'}>
                    {till.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 p-4">
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Start Time</div>
                        <div className="font-semibold">{formatTime(till.startTime)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Hours Worked</div>
                        <div className="font-semibold">{getHoursWorked(till.startTime)}h</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Start Float</div>
                        <div className="font-semibold">{formatCurrency(till.startFloat)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Transactions</div>
                        <div className="font-semibold">{till.transactionCount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-500">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-green-800">Sales Total</span>
                      <span className="text-lg font-bold text-green-700">
                        {formatCurrency(till.currentSales)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-800">Expected Cash</span>
                      <span className="text-lg font-bold text-green-700">
                        {formatCurrency(till.expectedCash)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleTillCashup(till)}
                    disabled={till.status === 'idle'}
                    className="w-full bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-semibold"
                  >
                    {till.status === 'active' ? 'Cashup Till' : 'No Activity'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cashup Dialog */}
      <Dialog open={showCashupDialog} onOpenChange={setShowCashupDialog}>
        <DialogContent className="max-w-md bg-white border-2 border-[#0A2645] rounded-xl">
          <DialogHeader className="bg-gradient-to-r from-[#0A2645] to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-xl">
            <DialogTitle className="text-xl">
              Cashup {selectedTill?.tillNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTill && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Expected Cash:</span>
                  <span className="font-bold">{formatCurrency(selectedTill.expectedCash)}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Sales Total:</span>
                  <span>{formatCurrency(selectedTill.currentSales)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Start Float:</span>
                  <span>{formatCurrency(selectedTill.startFloat)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A2645] mb-2">
                  Actual Cash Count (R)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FAA225] focus:border-transparent text-lg font-mono"
                  placeholder="0.00"
                />
              </div>

              {actualCash && (
                <div className={`bg-gray-50 rounded-lg p-3 ${
                  parseFloat(actualCash) - selectedTill.expectedCash === 0 
                    ? 'border-l-4 border-green-500' 
                    : 'border-l-4 border-red-500'
                }`}>
                  <div className="flex justify-between">
                    <span className="font-medium">Difference:</span>
                    <span className={`font-bold ${
                      parseFloat(actualCash) - selectedTill.expectedCash >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(parseFloat(actualCash) - selectedTill.expectedCash)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCashupDialog(false)}
                  className="flex-1 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitCashup}
                  disabled={!actualCash}
                  className="flex-1 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-semibold"
                >
                  Complete Cashup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cashup;
