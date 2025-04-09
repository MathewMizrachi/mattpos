
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
import { useIsMobile } from '@/hooks/use-mobile';

const Reports = () => {
  const { currentUser, getShiftPaymentBreakdown, products } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sales');
  const [fromDate, setFromDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [toDate, setToDate] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  const salesData = [
    { date: '2025-03-31', total: 1256.75, transactions: 42, avgSale: 29.92 },
    { date: '2025-04-01', total: 987.50, transactions: 35, avgSale: 28.21 },
    { date: '2025-04-02', total: 1432.25, transactions: 48, avgSale: 29.84 },
    { date: '2025-04-03', total: 1105.00, transactions: 39, avgSale: 28.33 },
  ];
  
  const inventoryData = products.map(product => ({
    productName: product.name,
    currentStock: product.stock !== undefined ? product.stock : 0,
    reorderLevel: Math.max(10, Math.floor((product.stock || 0) * 0.2)), // 20% of current stock as reorder level
    lastRestocked: '2025-04-01' // Sample data as we don't have real restock dates
  }));
  
  const paymentMethodsData = [
    { method: 'Shop2Shop', amount: 587.25, percentage: 12.2 },
    { method: 'Card', amount: 2156.75, percentage: 45.0 },
    { method: 'Cash', amount: 1845.50, percentage: 38.5 },
    { method: 'Account', amount: 205.00, percentage: 4.3 },
  ];
  
  const profitPlusData = {
    daily: [
      { date: '2025-03-31', transactions: 5, revenue: 450.00, commission: 22.50 },
      { date: '2025-04-01', transactions: 3, revenue: 275.00, commission: 13.75 },
      { date: '2025-04-02', transactions: 7, revenue: 675.00, commission: 33.75 },
      { date: '2025-04-03', transactions: 4, revenue: 400.00, commission: 20.00 },
    ],
    products: [
      { name: "Airtime R10", count: 35, value: 350.00, commission: 17.50 },
      { name: "Data 1GB", count: 12, value: 1020.00, commission: 51.00 },
      { name: "Electricity", count: 6, value: 430.00, commission: 21.50 }
    ]
  };

  const DateRangePicker = () => {
    return (
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">From Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-white text-[#0A2645] border-[#0A2645]"
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
                className="w-full justify-start text-left font-normal bg-white text-[#0A2645] border-[#0A2645]"
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
              <TabsList 
                scrollable={true}
                className={cn(
                  "w-full justify-start mb-6 bg-[#FAA225] text-[#0A2645]",
                  isMobile && "w-[auto] min-w-full flex-nowrap"
                )}
              >
                <TabsTrigger value="sales" className="data-[state=active]:bg-white whitespace-nowrap">Sales Report</TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-white whitespace-nowrap">Inventory Status</TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-white whitespace-nowrap">Payment Methods</TabsTrigger>
                <TabsTrigger value="profitplus" className="data-[state=active]:bg-white whitespace-nowrap">Profit+</TabsTrigger>
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
                    {inventoryData.slice(0, 10).map((item) => (
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
                  <p>Total Products: <strong>{inventoryData.length}</strong></p>
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
              
              <TabsContent value="profitplus">
                <DateRangePicker />
                <h3 className="text-lg font-medium mb-4">Profit+ Performance</h3>
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
                
                <h3 className="text-lg font-medium my-4">Product Breakdown</h3>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
