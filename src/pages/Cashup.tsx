
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeftIcon, DollarSignIcon, ClockIcon, UsersIcon, Calculator, CreditCard, Banknote, Smartphone, Receipt, FileText, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import db from '@/lib/db';

const Cashup = () => {
  const navigate = useNavigate();
  const [selectedTill, setSelectedTill] = useState(null);
  const [showCashupDialog, setShowCashupDialog] = useState(false);
  const [showEndOfDayDialog, setShowEndOfDayDialog] = useState(false);
  const [actualCash, setActualCash] = useState('');
  const [shifts, setShifts] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({
    cash: 0,
    card: 0,
    shop2shop: 0,
    account: 0,
    total: 0
  });

  useEffect(() => {
    // Get all shifts for today (in a real app, you'd filter by date)
    const allShifts = db.getAllShifts ? db.getAllShifts() : [];
    setShifts(allShifts);
    
    // Calculate total payment summary for the day
    let totalPayments = { cash: 0, card: 0, shop2shop: 0, account: 0, total: 0 };
    
    allShifts.forEach(shift => {
      const breakdown = db.getShiftPaymentBreakdown(shift.id);
      totalPayments.cash += breakdown.cash;
      totalPayments.card += breakdown.card;
      totalPayments.shop2shop += breakdown.shop2shop;
      totalPayments.account += breakdown.account;
    });
    
    totalPayments.total = totalPayments.cash + totalPayments.card + totalPayments.shop2shop + totalPayments.account;
    setPaymentSummary(totalPayments);
  }, []);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTillCashup = (shift) => {
    setSelectedTill(shift);
    const expectedCash = db.calculateExpectedCashInDrawer(shift.id);
    setActualCash(expectedCash.toString());
    setShowCashupDialog(true);
  };

  const handleSubmitCashup = () => {
    const difference = parseFloat(actualCash) - db.calculateExpectedCashInDrawer(selectedTill.id);
    console.log(`Shift ${selectedTill.id} cashup completed. Difference: ${formatCurrency(difference)}`);
    
    // Update the shift as completed
    const updatedShifts = shifts.map(shift => 
      shift.id === selectedTill.id 
        ? { ...shift, endTime: new Date().toISOString(), cashupAmount: parseFloat(actualCash) }
        : shift
    );
    setShifts(updatedShifts);
    
    setShowCashupDialog(false);
    setSelectedTill(null);
    setActualCash('');
  };

  const handleEndOfDay = () => {
    setShowEndOfDayDialog(true);
  };

  const handleAutoCompleteCashups = () => {
    const updatedShifts = shifts.map(shift => {
      if (!shift.endTime) {
        const expectedCash = db.calculateExpectedCashInDrawer(shift.id);
        return {
          ...shift,
          endTime: new Date().toISOString(),
          cashupAmount: expectedCash
        };
      }
      return shift;
    });
    
    setShifts(updatedShifts);
    console.log('All active tills have been auto-cashed up');
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getHoursWorked = (startTime, endTime) => {
    const endTimeValue = endTime ? new Date(endTime).getTime() : Date.now();
    const hours = (endTimeValue - new Date(startTime).getTime()) / (1000 * 60 * 60);
    return Math.floor(hours * 10) / 10;
  };

  const getTotalSales = () => {
    return shifts.reduce((sum, shift) => sum + (shift.salesTotal || 0), 0);
  };

  const getTotalTransactions = () => {
    return shifts.reduce((sum, shift) => sum + (shift.transactionCount || 0), 0);
  };

  const getActiveTillsCount = () => {
    return shifts.filter(shift => !shift.endTime).length;
  };

  const getCompletedTillsCount = () => {
    return shifts.filter(shift => shift.endTime).length;
  };

  const getDayStartTime = () => {
    const earliestShift = shifts.reduce((earliest, shift) => 
      !earliest || new Date(shift.startTime) < new Date(earliest.startTime) ? shift : earliest
    , null);
    return earliestShift ? formatTime(earliestShift.startTime) : 'N/A';
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'cash': return <Banknote className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'shop2shop': return <Smartphone className="h-4 w-4" />;
      case 'account': return <Receipt className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
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
            <div className="flex gap-3">
              <Button
                onClick={handleEndOfDay}
                className="bg-gradient-to-r from-[#0A2645] to-[#0A2645]/90 hover:from-[#0A2645]/90 hover:to-[#0A2645] text-white font-semibold px-6 py-2 flex items-center gap-2"
              >
                <FileText className="h-5 w-5" />
                End of Day Report
              </Button>
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
                out of {shifts.length} total
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

        {/* Daily Payment Summary */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-[#0A2645] flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Daily Payment Methods Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center mb-2">
                  <Banknote className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Cash</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(paymentSummary.cash)}
                </div>
                <div className="text-sm text-green-600">
                  {paymentSummary.total > 0 ? ((paymentSummary.cash / paymentSummary.total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center mb-2">
                  <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Card</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {formatCurrency(paymentSummary.card)}
                </div>
                <div className="text-sm text-blue-600">
                  {paymentSummary.total > 0 ? ((paymentSummary.card / paymentSummary.total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center mb-2">
                  <Smartphone className="h-4 w-4 text-orange-600 mr-2" />
                  <span className="font-medium text-orange-800">Shop2Shop</span>
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {formatCurrency(paymentSummary.shop2shop)}
                </div>
                <div className="text-sm text-orange-600">
                  {paymentSummary.total > 0 ? ((paymentSummary.shop2shop / paymentSummary.total) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center mb-2">
                  <Receipt className="h-4 w-4 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">Account</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">
                  {formatCurrency(paymentSummary.account)}
                </div>
                <div className="text-sm text-purple-600">
                  {paymentSummary.total > 0 ? ((paymentSummary.account / paymentSummary.total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Per-Till Payment Breakdown */}
        <Card className="bg-white shadow-lg mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-[#0A2645]">Payment Methods by Till</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Till</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead className="text-right">Cash</TableHead>
                    <TableHead className="text-right">Card</TableHead>
                    <TableHead className="text-right">Shop2Shop</TableHead>
                    <TableHead className="text-right">Account</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shifts.map((shift) => {
                    const breakdown = db.getShiftPaymentBreakdown(shift.id);
                    const total = breakdown.cash + breakdown.card + breakdown.shop2shop + breakdown.account;
                    const user = db.getUser ? db.getUser(shift.userId) : { name: `User ${shift.userId}` };
                    
                    return (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">Till #{shift.id}</TableCell>
                        <TableCell>{user?.name || `User ${shift.userId}`}</TableCell>
                        <TableCell className="text-right">{formatCurrency(breakdown.cash)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(breakdown.card)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(breakdown.shop2shop)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(breakdown.account)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(total)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Till Cards */}
        <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 grid-cols-1">
          {shifts.map((shift) => {
            const user = db.getUser ? db.getUser(shift.userId) : { name: `User ${shift.userId}` };
            const expectedCash = db.calculateExpectedCashInDrawer(shift.id);
            const breakdown = db.getShiftPaymentBreakdown(shift.id);
            const isActive = !shift.endTime;
            
            return (
              <Card
                key={shift.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isActive 
                    ? 'bg-white border-[#FAA225] shadow-lg border-2' 
                    : 'bg-gray-50 border-gray-200 shadow-md'
                }`}
              >
                <CardHeader className="pb-3 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className={`text-xl font-bold mb-1 ${
                        isActive ? 'text-[#0A2645]' : 'text-gray-500'
                      }`}>
                        TILL-{shift.id.toString().padStart(3, '0')}
                      </CardTitle>
                      <p className={`text-sm ${
                        isActive ? 'text-[#0A2645]/70' : 'text-gray-400'
                      }`}>
                        Operator: {user?.name || `User ${shift.userId}`}
                      </p>
                    </div>
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                      {isActive ? 'active' : 'completed'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 p-4">
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-1">Start Time</div>
                          <div className="font-semibold">{formatTime(shift.startTime)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Hours Worked</div>
                          <div className="font-semibold">{getHoursWorked(shift.startTime, shift.endTime)}h</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Start Float</div>
                          <div className="font-semibold">{formatCurrency(shift.startFloat)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Transactions</div>
                          <div className="font-semibold">{shift.transactionCount || 0}</div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Breakdown for this till */}
                    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <div className="text-sm font-medium text-blue-800 mb-2">Payment Methods</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Cash:</span>
                          <span className="font-semibold">{formatCurrency(breakdown.cash)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Card:</span>
                          <span className="font-semibold">{formatCurrency(breakdown.card)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shop2Shop:</span>
                          <span className="font-semibold">{formatCurrency(breakdown.shop2shop)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Account:</span>
                          <span className="font-semibold">{formatCurrency(breakdown.account)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border-l-4 border-green-500">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-800">Sales Total</span>
                        <span className="text-lg font-bold text-green-700">
                          {formatCurrency(shift.salesTotal || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800">Expected Cash</span>
                        <span className="text-lg font-bold text-green-700">
                          {formatCurrency(expectedCash)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleTillCashup(shift)}
                      disabled={!isActive}
                      className="w-full bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-semibold"
                    >
                      {isActive ? 'Cashup Till' : 'Completed'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cashup Dialog */}
      <Dialog open={showCashupDialog} onOpenChange={setShowCashupDialog}>
        <DialogContent className="max-w-md bg-white border-2 border-[#0A2645] rounded-xl">
          <DialogHeader className="bg-gradient-to-r from-[#0A2645] to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-xl">
            <DialogTitle className="text-xl">
              Cashup {selectedTill?.id ? `TILL-${selectedTill.id.toString().padStart(3, '0')}` : ''}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTill && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Expected Cash:</span>
                  <span className="font-bold">{formatCurrency(db.calculateExpectedCashInDrawer(selectedTill.id))}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Sales Total:</span>
                  <span>{formatCurrency(selectedTill.salesTotal || 0)}</span>
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
                  parseFloat(actualCash) - db.calculateExpectedCashInDrawer(selectedTill.id) === 0 
                    ? 'border-l-4 border-green-500' 
                    : 'border-l-4 border-red-500'
                }`}>
                  <div className="flex justify-between">
                    <span className="font-medium">Difference:</span>
                    <span className={`font-bold ${
                      parseFloat(actualCash) - db.calculateExpectedCashInDrawer(selectedTill.id) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(parseFloat(actualCash) - db.calculateExpectedCashInDrawer(selectedTill.id))}
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

      {/* End of Day Dialog */}
      <Dialog open={showEndOfDayDialog} onOpenChange={setShowEndOfDayDialog}>
        <DialogContent className="max-w-4xl bg-white border-2 border-[#0A2645] rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-[#0A2645] to-[#0A2645]/90 text-white p-6 -m-6 mb-6 rounded-t-xl">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              End of Day Report - {new Date().toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Day Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="text-sm text-blue-600 mb-1">Day Started</div>
                <div className="font-bold text-blue-800">{getDayStartTime()}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <div className="text-sm text-green-600 mb-1">Total Tills</div>
                <div className="font-bold text-green-800">{shifts.length}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <div className="text-sm text-orange-600 mb-1">Completed</div>
                <div className="font-bold text-orange-800">{getCompletedTillsCount()}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <div className="text-sm text-red-600 mb-1">Still Active</div>
                <div className="font-bold text-red-800">{getActiveTillsCount()}</div>
              </div>
            </div>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0A2645]">Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Sales</div>
                    <div className="text-2xl font-bold text-[#0A2645]">{formatCurrency(getTotalSales())}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
                    <div className="text-2xl font-bold text-[#0A2645]">{getTotalTransactions()}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Average Sale</div>
                    <div className="text-2xl font-bold text-[#0A2645]">
                      {formatCurrency(getTotalTransactions() > 0 ? getTotalSales() / getTotalTransactions() : 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Till by Till Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0A2645]">Till Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Till</TableHead>
                        <TableHead>Operator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Sales</TableHead>
                        <TableHead className="text-right">Transactions</TableHead>
                        <TableHead className="text-right">Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shifts.map((shift) => {
                        const user = db.getUser ? db.getUser(shift.userId) : { name: `User ${shift.userId}` };
                        const isActive = !shift.endTime;
                        
                        return (
                          <TableRow key={shift.id}>
                            <TableCell className="font-medium">Till #{shift.id}</TableCell>
                            <TableCell>{user?.name || `User ${shift.userId}`}</TableCell>
                            <TableCell>
                              <Badge variant={isActive ? 'destructive' : 'default'}>
                                {isActive ? 'Active' : 'Completed'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(shift.salesTotal || 0)}</TableCell>
                            <TableCell className="text-right">{shift.transactionCount || 0}</TableCell>
                            <TableCell className="text-right">{getHoursWorked(shift.startTime, shift.endTime)}h</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowEndOfDayDialog(false)}
                className="border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white"
              >
                Close Report
              </Button>
              {getActiveTillsCount() > 0 && (
                <Button
                  onClick={() => {
                    handleAutoCompleteCashups();
                    setShowEndOfDayDialog(false);
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Auto-Complete All Cashups
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cashup;
