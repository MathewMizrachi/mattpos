
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from '@/lib/utils';
import { DateRangePicker } from './DateRangePicker';

interface ProfitPlusTabProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  profitPlusData: {
    daily: {
      date: string;
      transactions: number;
      revenue: number;
      commission: number;
    }[];
    products: {
      name: string;
      count: number;
      value: number;
      commission: number;
    }[];
  };
}

export const ProfitPlusTab: React.FC<ProfitPlusTabProps> = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  profitPlusData
}) => {
  return (
    <div>
      <DateRangePicker 
        fromDate={fromDate} 
        toDate={toDate} 
        setFromDate={setFromDate} 
        setToDate={setToDate} 
      />
      <h3 className="text-lg font-medium mb-4">Profit+ Performance</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profitPlusData.daily.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{day.date}</TableCell>
                <TableCell>{day.transactions}</TableCell>
                <TableCell>{formatCurrency(day.revenue)}</TableCell>
                <TableCell>{formatCurrency(day.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <h3 className="text-lg font-medium my-4">Product Breakdown</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Commission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profitPlusData.products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.count}</TableCell>
                <TableCell>{formatCurrency(product.value)}</TableCell>
                <TableCell>{formatCurrency(product.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Profit+ Summary</h4>
        <p>Total Transactions: <strong>{profitPlusData.daily.reduce((sum, day) => sum + day.transactions, 0)}</strong></p>
        <p>Total Revenue: <strong>{formatCurrency(profitPlusData.daily.reduce((sum, day) => sum + day.revenue, 0))}</strong></p>
        <p>Total Commission: <strong>{formatCurrency(profitPlusData.daily.reduce((sum, day) => sum + day.commission, 0))}</strong></p>
        <p>Most Popular Product: <strong>{
          profitPlusData.products.reduce((prev, current) => 
            (prev.count > current.count) ? prev : current
          ).name
        }</strong></p>
      </div>
    </div>
  );
};
