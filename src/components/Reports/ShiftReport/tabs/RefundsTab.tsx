
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

interface RefundsTabProps {
  refundBreakdown: {
    total: number;
    items: {
      productId: number;
      productName: string;
      quantity: number;
      amount: number;
    }[];
  };
}

const RefundsTab: React.FC<RefundsTabProps> = ({ refundBreakdown }) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Refunds ({formatCurrency(refundBreakdown.total)})</h3>
      <div className="overflow-x-auto">
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
    </>
  );
};

export default RefundsTab;
