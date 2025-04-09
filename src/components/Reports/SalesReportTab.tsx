
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { DateRangePicker } from './DateRangePicker';

interface SalesReportTabProps {
  fromDate: Date;
  toDate: Date;
  setFromDate: (date: Date) => void;
  setToDate: (date: Date) => void;
  salesData: {
    date: string;
    total: number;
    transactions: number;
    avgSale: number;
  }[];
}

export const SalesReportTab: React.FC<SalesReportTabProps> = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  salesData
}) => {
  return (
    <div>
      <DateRangePicker 
        fromDate={fromDate} 
        toDate={toDate} 
        setFromDate={setFromDate} 
        setToDate={setToDate} 
      />
      <h3 className="text-lg font-medium mb-4">Daily Sales Overview</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Avg. Sale</TableHead>
              <TableHead>Gross Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesData.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{formatCurrency(row.total)}</TableCell>
                <TableCell>{row.transactions}</TableCell>
                <TableCell>{formatCurrency(row.avgSale)}</TableCell>
                <TableCell>{formatCurrency(row.total * 0.25)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 bg-gray-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Summary</h4>
        <p>Total Revenue for Period: <strong>{formatCurrency(salesData.reduce((sum, item) => sum + item.total, 0))}</strong></p>
        <p>Total Sales: <strong>{salesData.reduce((sum, item) => sum + item.transactions, 0)}</strong></p>
        <p>Total Gross Profit: <strong>{formatCurrency(salesData.reduce((sum, item) => sum + item.total, 0) * 0.25)}</strong></p>
      </div>
    </div>
  );
};
