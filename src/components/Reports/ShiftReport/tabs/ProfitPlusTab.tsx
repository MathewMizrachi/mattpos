
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProfitPlusTabProps {
  profitPlusStats: {
    transactions: number;
    revenue: number;
    commission: number;
    products: {
      name: string;
      count: number;
      value: number;
      commission: number;
    }[];
  };
}

const ProfitPlusTab: React.FC<ProfitPlusTabProps> = ({ profitPlusStats }) => {
  return (
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
      <div className="overflow-x-auto">
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
    </div>
  );
};

export default ProfitPlusTab;
