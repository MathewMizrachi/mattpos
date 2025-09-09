
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
    
    // Best day calculations (ensure it's typically higher than current for demo)
    const currentDaySales = viewMode === 'daily' ? totalSales / dailyData.length : totalSales;
    const bestDaySales = Math.max(currentDaySales * 1.2, viewMode === 'daily' ? Math.max(...dailyData.map(d => d.sales)) : totalSales);
    const bestDayVAT = bestDaySales * 0.15;
    const bestDayTransactions = Math.floor(bestDaySales / 45);
    const bestBasketSize = Math.max(averageBasketSize * 1.15, 65); // Historical best basket size
    
    // Current performance vs best day ratios
    const salesRatio = Math.min((currentDaySales / bestDaySales) * 100, 100);
    const vatRatio = Math.min(((vatAmount / (viewMode === 'daily' ? dailyData.length : 1)) / bestDayVAT) * 100, 100);
    const basketRatio = Math.min((averageBasketSize / bestBasketSize) * 100, 100);
    const transactionRatio = Math.min(((totalTransactions / (viewMode === 'daily' ? dailyData.length : 1)) / bestDayTransactions) * 100, 100);
    
    // Check if current performance is best day
    const isBestSales = salesRatio >= 98;
    const isBestVAT = vatRatio >= 98;
    const isBestBasket = basketRatio >= 98;
    const isBestTransactions = transactionRatio >= 98;
    
    return {
      totalSales,
      totalTransactions,
      vatAmount,
      averageBasketSize,
      bestDaySales,
      bestDayVAT,
      bestBasketSize,
      salesRatio,
      vatRatio,
      basketRatio,
      transactionRatio,
      isBestSales,
      isBestVAT,
      isBestBasket,
      isBestTransactions
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
                stroke="#FAA225" 
                strokeWidth={3}
                dot={{ fill: '#FAA225', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, stroke: '#FAA225', strokeWidth: 2, fill: '#0A2645' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`bg-gradient-to-br from-card to-card/80 p-6 rounded-lg border shadow-lg hover-scale animate-fade-in transition-all duration-300 hover:shadow-xl hover:border-secondary/30 ${selectedPeriodTotals.isBestSales ? 'ring-2 ring-secondary border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5' : ''} relative`}>
          {selectedPeriodTotals.isBestSales && (
            <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              🎉 BEST!
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground mb-1">R{selectedPeriodTotals.totalSales.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Turnover</div>
            <div className="text-xs text-primary font-medium mt-1 mb-2">Best Day: R{selectedPeriodTotals.bestDaySales.toFixed(0)}</div>
            <div className="w-full h-1 bg-secondary/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full animate-pulse transition-all duration-1000" style={{width: `${selectedPeriodTotals.salesRatio}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className={`bg-gradient-to-br from-card to-card/80 p-6 rounded-lg border shadow-lg hover-scale animate-fade-in transition-all duration-300 hover:shadow-xl hover:border-secondary/30 ${selectedPeriodTotals.isBestVAT ? 'ring-2 ring-secondary border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5' : ''} relative`} style={{animationDelay: '0.1s'}}>
          {selectedPeriodTotals.isBestVAT && (
            <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              🎉 BEST!
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground mb-1">R{selectedPeriodTotals.vatAmount.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">VAT (15%)</div>
            <div className="text-xs text-primary font-medium mt-1 mb-2">Best Day VAT: R{selectedPeriodTotals.bestDayVAT.toFixed(0)}</div>
            <div className="w-full h-1 bg-secondary/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full animate-pulse transition-all duration-1000" style={{width: `${selectedPeriodTotals.vatRatio}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className={`bg-gradient-to-br from-card to-card/80 p-6 rounded-lg border shadow-lg hover-scale animate-fade-in transition-all duration-300 hover:shadow-xl hover:border-secondary/30 ${selectedPeriodTotals.isBestBasket ? 'ring-2 ring-secondary border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5' : ''} relative`} style={{animationDelay: '0.2s'}}>
          {selectedPeriodTotals.isBestBasket && (
            <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              🎉 BEST!
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground mb-1">R{selectedPeriodTotals.averageBasketSize.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Avg. Basket Size</div>
            <div className="text-xs text-primary font-medium mt-1 mb-2">Best Basket: R{selectedPeriodTotals.bestBasketSize}</div>
            <div className="w-full h-1 bg-secondary/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full animate-pulse transition-all duration-1000" style={{width: `${selectedPeriodTotals.basketRatio}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className={`bg-gradient-to-br from-card to-card/80 p-6 rounded-lg border shadow-lg hover-scale animate-fade-in transition-all duration-300 hover:shadow-xl hover:border-secondary/30 ${selectedPeriodTotals.isBestTransactions ? 'ring-2 ring-secondary border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5' : ''} relative`} style={{animationDelay: '0.3s'}}>
          {selectedPeriodTotals.isBestTransactions && (
            <div className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              🎉 BEST!
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground mb-1">{selectedPeriodTotals.totalTransactions}</div>
            <div className="text-sm text-muted-foreground">Number of Sales</div>
            <div className="text-xs text-primary font-medium mt-1 mb-2">Best Day Sales: {Math.floor(selectedPeriodTotals.bestDaySales / 45)}</div>
            <div className="w-full h-1 bg-secondary/20 rounded-full">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary/70 rounded-full animate-pulse transition-all duration-1000" style={{width: `${selectedPeriodTotals.transactionRatio}%`}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
