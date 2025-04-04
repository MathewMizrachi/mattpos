
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentAmountInputsProps {
  amounts: {
    shop2shop: string;
    cash: string;
    card: string;
    account: string;
  };
  handleAmountChange: (method: 'shop2shop' | 'cash' | 'card' | 'account', value: string) => void;
  setShowCustomerFields: (show: boolean) => void;
}

const PaymentAmountInputs: React.FC<PaymentAmountInputsProps> = ({
  amounts,
  handleAmountChange,
  setShowCustomerFields
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Payment Amounts</h3>
      
      <div>
        <Label htmlFor="shop2shop-amount" className="text-white mb-1 block">Shop2Shop Amount</Label>
        <Input 
          id="shop2shop-amount" 
          value={amounts.shop2shop} 
          onChange={(e) => handleAmountChange('shop2shop', e.target.value)} 
          placeholder="0.00"
          className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
          type="number"
          step="0.01"
          min="0"
        />
      </div>
      
      <div>
        <Label htmlFor="cash-amount" className="text-white mb-1 block">Cash Amount</Label>
        <Input 
          id="cash-amount" 
          value={amounts.cash} 
          onChange={(e) => handleAmountChange('cash', e.target.value)} 
          placeholder="0.00"
          className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
          type="number"
          step="0.01"
          min="0"
        />
      </div>
      
      <div>
        <Label htmlFor="card-amount" className="text-white mb-1 block">Card Amount</Label>
        <Input 
          id="card-amount" 
          value={amounts.card} 
          onChange={(e) => handleAmountChange('card', e.target.value)} 
          placeholder="0.00" 
          className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
          type="number"
          step="0.01"
          min="0"
        />
      </div>
      
      <div>
        <Label htmlFor="account-amount" className="text-white mb-1 block">Account Amount</Label>
        <Input 
          id="account-amount" 
          value={amounts.account} 
          onChange={(e) => {
            handleAmountChange('account', e.target.value);
            setShowCustomerFields(parseFloat(e.target.value) > 0);
          }} 
          placeholder="0.00"
          className="bg-white border-gray-300 text-[#0A2645] placeholder:text-gray-400"
          type="number"
          step="0.01"
          min="0"
        />
      </div>
    </div>
  );
};

export default PaymentAmountInputs;
