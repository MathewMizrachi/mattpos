
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import { ArrowDown, DollarSign } from 'lucide-react';

interface WithdrawalScreenProps {
  onCancel: () => void;
  onWithdraw: (amount: number, reason: string) => void;
}

const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({ onCancel, onWithdraw }) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }
    
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please enter a reason for the withdrawal",
        variant: "destructive"
      });
      return;
    }
    
    onWithdraw(amount, reason);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#0A2645] p-3 rounded-full mr-3">
            <ArrowDown className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2645]">Cash Withdrawal</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="amount" className="text-[#0A2645] font-semibold mb-1 block">
              Withdrawal Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2645]" size={18} />
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount || ''}
                onChange={handleAmountChange}
                className="pl-10 bg-white border-[#0A2645] text-[#0A2645]"
                placeholder="0.00"
                autoFocus
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {amount > 0 ? `Withdrawing ${formatCurrency(amount)} from register` : ''}
            </p>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="reason" className="text-[#0A2645] font-semibold mb-1 block">
              Reason for Withdrawal
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={handleReasonChange}
              className="bg-white border-[#0A2645] text-[#0A2645]"
              placeholder="Enter reason for withdrawal"
              rows={3}
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white hover:bg-gray-600 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0A2645] text-white hover:bg-blue-800 flex-1"
            >
              Withdraw
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalScreen;
