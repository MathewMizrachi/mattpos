
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { DateRangePicker } from './DateRangePicker';

interface PaymentMethodsTabProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  paymentMethodsData: {
    method: string;
    amount: number;
    percentage: number;
  }[];
}

export const PaymentMethodsTab: React.FC<PaymentMethodsTabProps> = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  paymentMethodsData
}) => {
  return (
    <div className="p-2 sm:p-4">
      <div className="mb-4">
        <DateRangePicker 
          fromDate={fromDate} 
          toDate={toDate} 
          setFromDate={setFromDate} 
          setToDate={setToDate} 
        />
      </div>
      <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Payment Methods Analysis</h3>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-3">
        {paymentMethodsData.map((method) => (
          <div key={method.method} className="bg-white rounded-lg p-3 shadow-sm border">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sm">{method.method}</h4>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {method.percentage}%
              </span>
            </div>
            <p className="text-lg font-bold text-primary">{formatCurrency(method.amount)}</p>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Payment Method</TableHead>
              <TableHead className="text-xs sm:text-sm">Amount</TableHead>
              <TableHead className="text-xs sm:text-sm">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethodsData.map((method) => (
              <TableRow key={method.method}>
                <TableCell className="text-xs sm:text-sm font-medium">{method.method}</TableCell>
                <TableCell className="text-xs sm:text-sm font-bold">{formatCurrency(method.amount)}</TableCell>
                <TableCell className="text-xs sm:text-sm">{method.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-3 sm:mt-4 bg-muted p-3 sm:p-4 rounded-md">
        <h4 className="font-medium mb-2 text-sm sm:text-base">Payment Methods Summary</h4>
        <div className="space-y-1 text-xs sm:text-sm">
          <p>Total Amount: <strong className="text-primary">{formatCurrency(paymentMethodsData.reduce((sum, method) => sum + method.amount, 0))}</strong></p>
          <p>Most Popular Method: <strong className="text-primary">{
            paymentMethodsData.reduce((prev, current) => 
              (prev.amount > current.amount) ? prev : current
            ).method
          }</strong></p>
        </div>
      </div>
    </div>
  );
};
