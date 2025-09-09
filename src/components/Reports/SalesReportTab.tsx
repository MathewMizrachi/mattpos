
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { DateRangePicker } from './DateRangePicker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";

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
  const [viewMode, setViewMode] = React.useState<'hourly' | 'daily'>('hourly');

  // Generate hourly cumulative sales data for the selected date (from date)
  const hourlyData = React.useMemo(() => {
    const hours = [];
    let cumulativeSales = 0;
    
    for (let i = 8; i <= 22; i++) { // Start from 8 AM to 10 PM
      const hour = i.toString().padStart(2, '0') + ':00';
      // Generate hourly increment (random between R500-R3000)
      const hourlySales = i === 8 ? 0 : Math.floor(Math.random() * 2500) + 500;
      cumulativeSales += hourlySales;
      
      hours.push({
        time: hour,
        sales: cumulativeSales,
        displayTime: i <= 12 ? `${i}:00 AM` : `${i - 12}:00 PM`,
        date: format(fromDate, 'yyyy-MM-dd')
      });
    }
    return hours;
  }, [fromDate]);

  // Generate daily sales data for the selected date range
  const dailyData = React.useMemo(() => {
    const days = [];
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= diffDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const sales = Math.floor(Math.random() * 15000) + 5000; // Random sales between R5000-R20000
      days.push({
        time: `${dayName} ${format(date, 'MM/dd')}`,
        sales: sales,
        date: format(date, 'yyyy-MM-dd')
      });
    }
    return days;
  }, [fromDate, toDate]);

  // Calculate totals based on current view mode and selected data
  const selectedPeriodTotals = React.useMemo(() => {
    const currentData = viewMode === 'hourly' ? hourlyData : dailyData;
    const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
    const totalTransactions = Math.floor(totalSales / 45); // Average transaction ~R45
    return {
      totalSales,
      totalTransactions
    };
  }, [hourlyData, dailyData, viewMode]);

  const formatTooltipValue = (value: number) => {
    return [`R${value.toFixed(2)}`, 'Sales'];
  };

  return (
    <div>
      <DateRangePicker 
        fromDate={fromDate} 
        toDate={toDate} 
        setFromDate={setFromDate} 
        setToDate={setToDate} 
      />
      
      {/* Today's Total Sales Summary */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-lg text-white shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            {viewMode === 'hourly' 
              ? `Sales for ${format(fromDate, 'PPP')}` 
              : `Sales from ${format(fromDate, 'MMM dd')} to ${format(toDate, 'MMM dd')}`
            }
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">R{selectedPeriodTotals.totalSales.toFixed(2)}</div>
              <div className="text-blue-100 text-sm">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{selectedPeriodTotals.totalTransactions}</div>
              <div className="text-blue-100 text-sm">Transactions</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {viewMode === 'hourly' ? "Today's Hourly Sales" : "Daily Sales Trends"}
          </h3>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'hourly' ? 'default' : 'outline'}
              onClick={() => setViewMode('hourly')}
              size="sm"
            >
              Hourly
            </Button>
            <Button
              variant={viewMode === 'daily' ? 'default' : 'outline'}
              onClick={() => setViewMode('daily')}
              size="sm"
            >
              Daily
            </Button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewMode === 'hourly' ? hourlyData : dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `R${value}`}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #d1d5db',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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
