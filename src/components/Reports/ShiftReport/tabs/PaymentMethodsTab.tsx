
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PaymentMethodsTabProps {
  paymentBreakdown: {
    cash: number;
    card: number;
    shop2shop: number;
    account: number;
  };
  totalSales: number;
}

const PaymentMethodsTab: React.FC<PaymentMethodsTabProps> = ({
  paymentBreakdown,
  totalSales
}) => {
  return (
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
  );
};

export default PaymentMethodsTab;
