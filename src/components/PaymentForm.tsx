
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

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
  
  const generateQuickAmounts = () => {
    const amounts = [50, 100, 200, 500];
    return amounts.filter(amount => amount >= total);
  };
  
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-[#0A2645] p-4" 
    : "w-full max-w-md p-8 bg-[#0A2645] rounded-lg shadow-lg";
  
  return (
    <div className={`${fullScreen ? 'min-h-screen' : ''} flex items-center justify-center bg-[#0A2645] p-4`}>
      <div className={containerClasses}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Payment</h2>
        </div>
        
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
          
          <div className="grid grid-cols-2 gap-2">
            {generateQuickAmounts().map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                className="text-white border-white hover:bg-white/20"
                onClick={() => setCashReceived(amount.toString())}
              >
                {formatCurrency(amount)}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              className="col-span-2 text-white border-white hover:bg-white/20"
              onClick={() => setCashReceived(total.toString())}
            >
              Exact Amount ({formatCurrency(total)})
            </Button>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="text-white border-white hover:bg-white/20" 
              onClick={onCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
              disabled={parseFloat(cashReceived) < total}
            >
              Complete Sale
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
