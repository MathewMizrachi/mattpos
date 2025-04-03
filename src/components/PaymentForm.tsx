
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import PaymentSummary from './PaymentForm/PaymentSummary';
import QuickAmountButtons from './PaymentForm/QuickAmountButtons';
import PaymentActions from './PaymentForm/PaymentActions';

interface PaymentFormProps {
  total: number;
  onProcessPayment: (cashReceived: number) => void;
  onCancel: () => void;
  fullScreen?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  total, 
  onProcessPayment, 
  onCancel,
  fullScreen = false
}) => {
  const [cashReceived, setCashReceived] = useState<string>('');
  const [change, setChange] = useState<number>(0);
  
  useEffect(() => {
    const cashAmount = parseFloat(cashReceived) || 0;
    setChange(Math.max(0, cashAmount - total));
  }, [cashReceived, total]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cashAmount = parseFloat(cashReceived);
    if (cashAmount >= total) {
      onProcessPayment(cashAmount);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="w-full max-w-md p-8 bg-[#0A2645] rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Payment</h2>
        </div>
        
        <PaymentSummary total={total} change={change} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cashReceived" className="block text-sm font-medium mb-2 text-white">
              Cash Received (R)
            </label>
            <Input
              id="cashReceived"
              type="number"
              step="0.01"
              min={total}
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              className="text-lg bg-white text-black"
              placeholder="0.00"
              required
            />
          </div>
          
          <QuickAmountButtons 
            total={total} 
            onSelectAmount={(amount) => setCashReceived(amount)} 
          />
          
          <PaymentActions 
            onCancel={onCancel} 
            isSubmitDisabled={parseFloat(cashReceived) < total} 
          />
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
