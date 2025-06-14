
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

interface WithdrawalScreenProps {
  onCancel: () => void;
  onWithdraw: (amount: number, reason: string) => boolean | void;
}

const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({ onCancel, onWithdraw }) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const { toast } = useToast();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

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
            <Label htmlFor="name" className="text-[#0A2645] font-semibold mb-1 block">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="bg-white border-[#0A2645] text-[#0A2645]"
              placeholder="Enter name"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="phone" className="text-[#0A2645] font-semibold mb-1 block">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              className="bg-white border-[#0A2645] text-[#0A2645]"
              placeholder="Enter phone number"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="amount" className="text-[#0A2645] font-semibold mb-1 block">
              Withdrawal Amount (Rand)
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2645] font-semibold">R</div>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount || ''}
                onChange={handleAmountChange}
                className="pl-8 bg-white border-[#0A2645] text-[#0A2645]"
                placeholder="0.00"
                autoFocus
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {amount > 0 ? `Withdrawing R${amount.toFixed(2)} from register` : ''}
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
              required
            />
          </div>
          
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-white text-[#0A2645] border border-[#0A2645] hover:bg-gray-100 flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 flex-1 font-semibold"
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
