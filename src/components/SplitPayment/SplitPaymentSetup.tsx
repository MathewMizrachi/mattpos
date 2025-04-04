
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import PaymentAmountInputs from './PaymentAmountInputs';
import CustomerInformation from './CustomerInformation';

interface SplitPaymentSetupProps {
  total: number;
  totalAllocated: number;
  amounts: {
    shop2shop: string;
    cash: string;
    card: string;
    account: string;
  };
  customerName: string;
  customerPhone: string;
  showCustomerFields: boolean;
  handleAmountChange: (method: 'shop2shop' | 'cash' | 'card' | 'account', value: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setShowCustomerFields: (show: boolean) => void;
  onCancel: () => void;
  onProceed: () => void;
  readyForPayment: boolean;
}

const SplitPaymentSetup: React.FC<SplitPaymentSetupProps> = ({
  total,
  totalAllocated,
  amounts,
  customerName,
  customerPhone,
  showCustomerFields,
  handleAmountChange,
  setCustomerName,
  setCustomerPhone,
  setShowCustomerFields,
  onCancel,
  onProceed,
  readyForPayment
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="w-full max-w-lg mx-auto text-white">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Split Payment</h2>
          <p className="text-xl mt-2">
            Total: <span className="font-bold">{formatCurrency(total)}</span>
          </p>
          <p className="text-md mt-2">
            Allocated: <span className={`font-bold ${totalAllocated > total ? 'text-red-500' : ''}`}>
              {formatCurrency(totalAllocated)}
            </span>
            <span className="ml-2">
              {totalAllocated < total 
                ? `(Remaining: ${formatCurrency(total - totalAllocated)})`
                : totalAllocated > total 
                  ? `(Over by: ${formatCurrency(totalAllocated - total)})`
                  : '(Exact amount)'}
            </span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <PaymentAmountInputs 
            amounts={amounts}
            handleAmountChange={handleAmountChange}
            setShowCustomerFields={setShowCustomerFields}
          />
          
          {showCustomerFields && (
            <CustomerInformation 
              customerName={customerName}
              customerPhone={customerPhone}
              setCustomerName={setCustomerName}
              setCustomerPhone={setCustomerPhone}
            />
          )}
        </div>
        
        <div className="flex justify-between space-x-4 mt-6">
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="flex-1 bg-transparent text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            onClick={onProceed} 
            className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold"
            disabled={!readyForPayment}
          >
            <Check className="h-4 w-4 mr-2" />
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentSetup;
