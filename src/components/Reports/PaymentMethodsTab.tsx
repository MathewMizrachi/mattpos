
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
    <div>
      <DateRangePicker 
        fromDate={fromDate} 
        toDate={toDate} 
        setFromDate={setFromDate} 
        setToDate={setToDate} 
      />
      <h3 className="text-lg font-medium mb-4">Payment Methods Analysis</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMethodsData.map((method) => (
              <TableRow key={method.method}>
                <TableCell>{method.method}</TableCell>
                <TableCell>{formatCurrency(method.amount)}</TableCell>
                <TableCell>{method.percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Payment Methods Summary</h4>
        <p>Total Amount: <strong>{formatCurrency(paymentMethodsData.reduce((sum, method) => sum + method.amount, 0))}</strong></p>
        <p>Most Popular Method: <strong>{
          paymentMethodsData.reduce((prev, current) => 
            (prev.amount > current.amount) ? prev : current
          ).method
        }</strong></p>
      </div>
    </div>
  );
};
