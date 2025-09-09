
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
  // Automatically determine view mode based on date range
  const isSingleDay = fromDate.toDateString() === toDate.toDateString();
  const viewMode = isSingleDay ? 'hourly' : 'daily';

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

  // Calculate totals and metrics based on current view mode and selected data
  const selectedPeriodTotals = React.useMemo(() => {
    const currentData = viewMode === 'hourly' ? hourlyData : dailyData;
    const totalSales = currentData.reduce((sum, item) => sum + item.sales, 0);
    const totalTransactions = Math.floor(totalSales / 45); // Average transaction ~R45
    const vatAmount = totalSales * 0.15; // 15% VAT
    const averageBasketSize = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    return {
      totalSales,
      totalTransactions,
      vatAmount,
      averageBasketSize
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
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 rounded-lg text-primary-foreground shadow-lg">
          <h3 className="text-xl font-bold mb-4">
            {viewMode === 'hourly' 
              ? `Sales for ${format(fromDate, 'PPP')}` 
              : `Sales from ${format(fromDate, 'MMM dd')} to ${format(toDate, 'MMM dd')}`
            }
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">R{selectedPeriodTotals.totalSales.toFixed(2)}</div>
              <div className="text-primary-foreground/80 text-sm">Total Sales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{selectedPeriodTotals.totalTransactions}</div>
              <div className="text-primary-foreground/80 text-sm">Transactions</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sales Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">
          {viewMode === 'hourly' ? "Cumulative Sales Throughout the Day" : "Daily Sales Trends"}
        </h3>
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={viewMode === 'hourly' ? hourlyData : dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `R${value}`}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#0A2645" 
                strokeWidth={2}
                dot={{ fill: '#0A2645', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0A2645', strokeWidth: 2, fill: '#FAA225' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">R{selectedPeriodTotals.totalSales.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">Turnover</div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">R{selectedPeriodTotals.vatAmount.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">VAT (15%)</div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">R{selectedPeriodTotals.averageBasketSize.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">Avg. Basket Size</div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">{selectedPeriodTotals.totalTransactions}</div>
            <div className="text-sm text-muted-foreground mt-1">Number of Sales</div>
          </div>
        </div>
      </div>
    </div>
  );
};
