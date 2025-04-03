
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  FileTextIcon,
  ArrowLeftIcon,
  SearchIcon,
  FilterIcon 
} from 'lucide-react';
import ReconciliationReport from '@/components/ReconciliationReport';
import { Shift } from '@/types';

const ShiftReports = () => {
  const {
    currentUser,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    calculateExpectedCashInDrawer
  } = useApp();
  
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  
  // In a real app, we would fetch these from the backend
  useEffect(() => {
    // For now, we'll use mock data
    const mockShifts: Shift[] = [
      {
        id: 1,
        userId: currentUser?.id || 1,
        startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        endTime: new Date(new Date().setDate(new Date().getDate() - 1)),
        startFloat: 500,
        endFloat: 1200,
        salesTotal: 3200,
        transactionCount: 42
      },
      {
        id: 2,
        userId: currentUser?.id || 1,
        startTime: new Date(new Date().setDate(new Date().getDate() - 2)),
        endTime: new Date(new Date().setDate(new Date().getDate() - 2)),
        startFloat: 500,
        endFloat: 950,
        salesTotal: 2800,
        transactionCount: 38
      },
      {
        id: 3,
        userId: currentUser?.id || 1,
        startTime: new Date(new Date().setDate(new Date().getDate() - 3)),
        endTime: new Date(new Date().setDate(new Date().getDate() - 3)),
        startFloat: 500,
        endFloat: 1050,
        salesTotal: 3600,
        transactionCount: 45
      }
    ];
    
    setShifts(mockShifts);
  }, [currentUser]);
  
  const viewShiftReport = (shift: Shift) => {
    setSelectedShift(shift);
  };
  
  if (!currentUser) {
    navigate('/');
    return null;
  }
  
  if (selectedShift) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Button 
          variant="outline" 
          onClick={() => setSelectedShift(null)} 
          className="mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        
        <ReconciliationReport 
          shift={selectedShift}
          totalSales={selectedShift.salesTotal || 0}
          grossProfit={selectedShift.salesTotal ? selectedShift.salesTotal * 0.25 : 0} // Assuming 25% profit margin
          paymentBreakdown={getShiftPaymentBreakdown(selectedShift.id)}
          lowStockProducts={getLowStockProducts(5)}
          refundBreakdown={getShiftRefundBreakdown(selectedShift.id)}
          cashExpected={calculateExpectedCashInDrawer(selectedShift.id)}
          cashActual={selectedShift.endFloat || 0}
          onClose={() => setSelectedShift(null)}
          isPrintable
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <FileTextIcon className="h-6 w-6 mr-2" />
              Shift Reports
            </h1>
            <p className="text-muted-foreground">View past shift summaries and reconciliation reports</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search shifts..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Date Range
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead className="text-right">Sales Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map(shift => (
                <TableRow key={shift.id}>
                  <TableCell>{shift.id}</TableCell>
                  <TableCell>
                    {new Date(shift.startTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{currentUser.name}</TableCell>
                  <TableCell>{shift.transactionCount}</TableCell>
                  <TableCell className="text-right">{formatCurrency(shift.salesTotal || 0)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => viewShiftReport(shift)}
                    >
                      View Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ShiftReports;
