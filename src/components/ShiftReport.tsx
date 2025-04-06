
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { Shift } from '@/types';

interface ShiftReportProps {
  shift: Shift;
  paymentBreakdown: {
    cash: number;
    card: number;
    shop2shop: number;
    account: number;
  };
  refundBreakdown: {
    total: number;
    items: {
      productId: number;
      productName: string;
      quantity: number;
      amount: number;
    }[];
  };
  lowStockProducts: any[];
  expectedCashInDrawer: number;
  onClose: () => void;
}

const ShiftReport: React.FC<ShiftReportProps> = ({
  shift,
  paymentBreakdown,
  refundBreakdown,
  lowStockProducts,
  expectedCashInDrawer,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('sales');
  
  // Calculate totals
  const totalSales = shift?.salesTotal || 0;
  const grossProfit = totalSales * 0.25; // Assuming 25% profit margin
  
  // Calculate Profit+ stats (example data - should be replaced with real data in production)
  const profitPlusStats = {
    transactions: 5,
    revenue: 450.00,
    commission: 22.50,
    products: [
      { name: "Airtime R10", count: 15, value: 150.00, commission: 7.50 },
      { name: "Electricity", count: 3, value: 300.00, commission: 15.00 }
    ]
  };
  
  const formattedDate = shift ? format(new Date(shift.startTime), 'yyyy-MM-dd') : '';
  const formattedStartTime = shift ? format(new Date(shift.startTime), 'HH:mm:ss') : '';
  const formattedEndTime = shift?.endTime ? format(new Date(shift.endTime), 'HH:mm:ss') : 'Active';

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-4 bg-[#0A2645] text-white flex items-center">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Shift Report</h1>
          <p className="text-sm">
            {formattedDate} ({formattedStartTime} - {formattedEndTime})
          </p>
        </div>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-[#FAA225] text-[#0A2645]">
            <TabsTrigger value="sales" className="data-[state=active]:bg-white">Sales</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-white">Payment Methods</TabsTrigger>
            {refundBreakdown.items.length > 0 && (
              <TabsTrigger value="refunds" className="data-[state=active]:bg-white">Refunds</TabsTrigger>
            )}
            {lowStockProducts.length > 0 && (
              <TabsTrigger value="inventory" className="data-[state=active]:bg-white">Low Stock</TabsTrigger>
            )}
            <TabsTrigger value="profitplus" className="data-[state=active]:bg-white">Profit+</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Shift Summary</h3>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Revenue</span>
                  <span>{formatCurrency(totalSales)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Gross Profit</span>
                  <span>{formatCurrency(grossProfit)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Transactions</span>
                  <span>{shift.transactionCount || 0}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Starting Float</span>
                  <span>{formatCurrency(shift.startFloat)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="font-medium">Expected Cash in Drawer</span>
                  <span>{formatCurrency(expectedCashInDrawer)}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Payment Method Breakdown</h3>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Cash</span>
                  <span>{formatCurrency(paymentBreakdown.cash)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Card</span>
                  <span>{formatCurrency(paymentBreakdown.card)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Shop2Shop</span>
                  <span>{formatCurrency(paymentBreakdown.shop2shop)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Account</span>
                  <span>{formatCurrency(paymentBreakdown.account)}</span>
                </div>
                
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(totalSales)}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {refundBreakdown.items.length > 0 && (
            <TabsContent value="refunds">
              <h3 className="text-lg font-medium mb-4">Refunds ({formatCurrency(refundBreakdown.total)})</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundBreakdown.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}
          
          {lowStockProducts.length > 0 && (
            <TabsContent value="inventory">
              <h3 className="text-lg font-medium mb-4">Low Stock Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}
          
          <TabsContent value="profitplus">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">Profit+ Summary</h3>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Transactions</span>
                  <span>{profitPlusStats.transactions}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Revenue</span>
                  <span>{formatCurrency(profitPlusStats.revenue)}</span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="font-medium">Commission Earned</span>
                  <span>{formatCurrency(profitPlusStats.commission)}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-medium my-4">Product Breakdown</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profitPlusStats.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">{product.count}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.value)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.commission)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button onClick={onClose}>
            Back to End Shift
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShiftReport;
