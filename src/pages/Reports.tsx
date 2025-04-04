
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBarIcon, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const Reports = () => {
  const { currentUser, getShiftPaymentBreakdown } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sales');
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [toDate, setToDate] = useState<Date>(new Date());
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Mock data for reports
  const salesData = [
    { date: '2025-03-31', total: 1256.75, transactions: 42, avgSale: 29.92 },
    { date: '2025-04-01', total: 987.50, transactions: 35, avgSale: 28.21 },
    { date: '2025-04-02', total: 1432.25, transactions: 48, avgSale: 29.84 },
    { date: '2025-04-03', total: 1105.00, transactions: 39, avgSale: 28.33 },
  ];
  
  const inventoryData = [
    { productName: 'Widget A', currentStock: 43, reorderLevel: 20, lastRestocked: '2025-03-25' },
    { productName: 'Widget B', currentStock: 12, reorderLevel: 15, lastRestocked: '2025-03-28' },
    { productName: 'Widget C', currentStock: 65, reorderLevel: 30, lastRestocked: '2025-03-22' },
    { productName: 'Widget D', currentStock: 8, reorderLevel: 10, lastRestocked: '2025-04-01' },
  ];
  
  const paymentMethodsData = [
    { method: 'Cash', amount: 1845.50, percentage: 38.5 },
    { method: 'Card', amount: 2156.75, percentage: 45.0 },
    { method: 'Shop2Shop', amount: 587.25, percentage: 12.2 },
    { method: 'Account', amount: 205.00, percentage: 4.3 },
  ];

  const DateRangePicker = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">From Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {format(fromDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={(date) => date && setFromDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">To Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {format(toDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={(date) => date && setToDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-[#0A2645] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center">
                <ChartBarIcon className="mr-2 h-6 w-6" />
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground">View and analyze business performance</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sales" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="w-full justify-start mb-6 bg-[#FAA225] text-[#0A2645]">
                <TabsTrigger value="sales" className="data-[state=active]:bg-white">Sales Report</TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-white">Inventory Status</TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-white">Payment Methods</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sales">
                <DateRangePicker />
                <h3 className="text-lg font-medium mb-4">Daily Sales Overview</h3>
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
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p>Total Revenue for Period: <strong>{formatCurrency(salesData.reduce((sum, item) => sum + item.total, 0))}</strong></p>
                  <p>Total Sales: <strong>{salesData.reduce((sum, item) => sum + item.transactions, 0)}</strong></p>
                  <p>Total Gross Profit: <strong>{formatCurrency(salesData.reduce((sum, item) => sum + item.total, 0) * 0.25)}</strong></p>
                </div>
              </TabsContent>
              
              <TabsContent value="inventory">
                <h3 className="text-lg font-medium mb-4">Inventory Status Report</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Last Restocked</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.map((item) => (
                      <TableRow key={item.productName}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>{item.lastRestocked}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.currentStock < item.reorderLevel 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.currentStock < item.reorderLevel ? 'Reorder' : 'Ok'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Inventory Summary</h4>
                  <p>Products Below Reorder Level: <strong>{inventoryData.filter(item => item.currentStock < item.reorderLevel).length}</strong></p>
                </div>
              </TabsContent>
              
              <TabsContent value="payment">
                <DateRangePicker />
                <h3 className="text-lg font-medium mb-4">Payment Methods Analysis</h3>
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
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Payment Methods Summary</h4>
                  <p>Total Amount: <strong>{formatCurrency(paymentMethodsData.reduce((sum, method) => sum + method.amount, 0))}</strong></p>
                  <p>Most Popular Method: <strong>{
                    paymentMethodsData.reduce((prev, current) => 
                      (prev.amount > current.amount) ? prev : current
                    ).method
                  }</strong></p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
