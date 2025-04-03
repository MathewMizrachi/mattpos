
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface PaymentSummaryProps {
  total: number;
  change: number;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ total, change }) => {
  return (
    <div className="bg-white/10 p-4 rounded-md mb-6 text-white">
      <div className="flex justify-between mb-2">
        <span>Total Amount:</span>
        <span className="font-bold text-lg">{formatCurrency(total)}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Change:</span>
        <span className={`font-bold text-lg ${change > 0 ? 'text-green-400' : 'text-white'}`}>
          {formatCurrency(change)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
