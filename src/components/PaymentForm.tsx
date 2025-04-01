
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface PaymentFormProps {
  total: number;
  onProcessPayment: (cashReceived: number) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  total, 
  onProcessPayment, 
  onCancel 
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
  
  // Quick amount buttons
  const generateQuickAmounts = () => {
    const amounts = [50, 100, 200, 500];
    // Filter out amounts that are less than the total
    return amounts.filter(amount => amount >= total);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Payment</h2>
      </div>
      
      <div className="bg-secondary p-4 rounded-md mb-6">
        <div className="flex justify-between mb-2">
          <span>Total Amount:</span>
          <span className="font-bold text-lg">{formatCurrency(total)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Change:</span>
          <span className={`font-bold text-lg ${change > 0 ? 'text-green-600' : ''}`}>
            {formatCurrency(change)}
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cashReceived" className="block text-sm font-medium mb-2">
            Cash Received (R)
          </label>
          <Input
            id="cashReceived"
            type="number"
            step="0.01"
            min={total}
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="text-lg"
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {generateQuickAmounts().map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              onClick={() => setCashReceived(amount.toString())}
            >
              {formatCurrency(amount)}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => setCashReceived(total.toString())}
            className="col-span-2"
          >
            Exact Amount ({formatCurrency(total)})
          </Button>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={parseFloat(cashReceived) < total}
          >
            Complete Sale
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
