
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentProcessProps {
  currentMethod: string;
  methodAmount: number;
  currentPaymentIndex: number;
  totalPayments: number;
  customerName?: string;
  customerPhone?: string;
  onCancel: () => void;
  onProcessPayment: () => void;
}

const PaymentProcess: React.FC<PaymentProcessProps> = ({
  currentMethod,
  methodAmount,
  currentPaymentIndex,
  totalPayments,
  customerName,
  customerPhone,
  onCancel,
  onProcessPayment
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">{getMethodLabel(currentMethod)} Payment</h2>
          <p className="text-xl mt-2">
            Amount: <span className="font-bold">{formatCurrency(methodAmount)}</span>
          </p>
          <p className="text-md mt-2">
            Payment {currentPaymentIndex + 1} of {totalPayments}
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {currentMethod === 'cash' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Please collect cash payment of {formatCurrency(methodAmount)}</p>
            </div>
          )}
          
          {currentMethod === 'card' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Process card payment of {formatCurrency(methodAmount)}</p>
              <p className="mt-2">Ensure card payment is approved before proceeding</p>
            </div>
          )}
          
          {currentMethod === 'shop2shop' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Process Shop2Shop payment of {formatCurrency(methodAmount)}</p>
              <p className="mt-2">Verify Shop2Shop transaction before proceeding</p>
            </div>
          )}
          
          {currentMethod === 'account' && (
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-md">
              <p>Process account payment of {formatCurrency(methodAmount)}</p>
              {customerName && <p className="mt-2">Customer: {customerName}</p>}
              {customerPhone && <p>Phone: {customerPhone}</p>}
            </div>
          )}
        </div>
        
        <div className="flex justify-between space-x-4">
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="flex-1 bg-transparent text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            onClick={onProcessPayment}
            className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold"
          >
            <Check className="h-4 w-4 mr-2" />
            {currentPaymentIndex < totalPayments - 1 ? "Next Payment" : "Complete Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get display label for payment method
function getMethodLabel(method: string) {
  switch (method) {
    case 'cash': return 'Cash';
    case 'card': return 'Card';
    case 'shop2shop': return 'Shop2Shop';
    case 'account': return 'Account';
    default: return method;
  }
}

export default PaymentProcess;
