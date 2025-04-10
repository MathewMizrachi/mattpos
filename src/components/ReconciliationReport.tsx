
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shift, Product } from '@/types';

interface PaymentBreakdown {
  cash: number;
  card: number;
  shop2shop: number;
  account: number;
}

interface RefundBreakdown {
  total: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    amount: number;
  }[];
}

interface ReconciliationReportProps {
  shift: Shift;
  totalSales: number;
  grossProfit: number;
  paymentBreakdown: PaymentBreakdown;
  lowStockProducts: Product[];
  refundBreakdown: RefundBreakdown;
  cashExpected: number;
  cashActual: number;
  onClose: () => void;
}

const ReconciliationReport: React.FC<ReconciliationReportProps> = ({
  shift,
  totalSales,
  grossProfit,
  paymentBreakdown,
  lowStockProducts,
  refundBreakdown,
  cashExpected,
  cashActual,
  onClose
}) => {
  const cashDifference = cashActual - cashExpected;
  const formattedDate = new Date(shift.startTime).toLocaleDateString();
  const formattedStartTime = new Date(shift.startTime).toLocaleTimeString();
  const formattedEndTime = shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : '';

  // Sample Profit+ stats (replace with actual data from your system)
  const profitPlusStats = {
    transactions: 7,
    revenue: 675.00,
    commission: 33.75,
    products: [
      { name: "Airtime R10", count: 20, value: 200.00, commission: 10.00 },
      { name: "Data 1GB", count: 5, value: 425.00, commission: 21.25 },
      { name: "Electricity", count: 1, value: 50.00, commission: 2.50 }
    ]
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary">End-of-Day Reconciliation Report</h1>
        <p className="text-muted-foreground">
          Shift #{shift.id} - {formattedDate} ({formattedStartTime} to {formattedEndTime})
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sales Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Revenue</span>
              <span>{formatCurrency(totalSales)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Gross Profit</span>
              <span>{formatCurrency(grossProfit)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Sales Count</span>
              <span>{shift.transactionCount || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Starting Float</span>
              <span>{formatCurrency(shift.startFloat)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Expected Cash</span>
              <span>{formatCurrency(cashExpected)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Actual Cash</span>
              <span>{formatCurrency(cashActual)}</span>
            </div>
            <div className={`flex justify-between py-2 font-bold ${cashDifference < 0 ? 'text-red-600' : cashDifference > 0 ? 'text-green-600' : ''}`}>
              <span>Discrepancy</span>
              <span>{formatCurrency(cashDifference)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Method Breakdown</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
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
      </div>
      
      {refundBreakdown.items.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Refunds ({formatCurrency(refundBreakdown.total)})</h2>
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
        </div>
      )}
      
      {lowStockProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Low Stock Items</h2>
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
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profit+ Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Profit+ Transactions</span>
              <span>{profitPlusStats.transactions}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Revenue</span>
              <span>{formatCurrency(profitPlusStats.revenue)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Commission Earned</span>
              <span>{formatCurrency(profitPlusStats.commission)}</span>
            </div>
          </div>
          
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitPlusStats.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="text-right">{product.count}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.commission)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button onClick={onClose} className="min-w-[200px]">
          Close Report
        </Button>
      </div>
    </div>
  );
};

export default ReconciliationReport;
