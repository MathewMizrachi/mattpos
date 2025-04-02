
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingBag, CreditCard, Banknote } from 'lucide-react';

interface PaymentOptionsProps {
  onSelectPaymentMethod: (method: 'cash' | 'card' | 'shop2shop') => void;
  onCancel: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  onSelectPaymentMethod, 
  onCancel 
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'cash' | 'card' | 'shop2shop'>('cash');

  const handlePaymentSelect = (method: 'cash' | 'card' | 'shop2shop') => {
    setSelectedMethod(method);
    onSelectPaymentMethod(method);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Select Payment Method</h2>
      </div>
      
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => setSelectedMethod(value as 'cash' | 'card' | 'shop2shop')}
        className="space-y-4 mb-6"
      >
        <div 
          className="flex items-center space-x-3 border p-4 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800 text-white"
          onClick={() => handlePaymentSelect('cash')}
        >
          <RadioGroupItem value="cash" id="cash" className="text-white" />
          <Label htmlFor="cash" className="flex items-center space-x-3 cursor-pointer w-full">
            <Banknote className="h-5 w-5" />
            <span className="font-medium">Cash</span>
          </Label>
        </div>
        
        <div 
          className="flex items-center space-x-3 border p-4 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800 text-white"
          onClick={() => handlePaymentSelect('card')}
        >
          <RadioGroupItem value="card" id="card" className="text-white" />
          <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer w-full">
            <CreditCard className="h-5 w-5" />
            <span className="font-medium">Card</span>
          </Label>
        </div>
        
        <div 
          className="flex items-center space-x-3 border p-4 rounded-md hover:bg-gray-700 cursor-pointer bg-gray-800 text-white"
          onClick={() => handlePaymentSelect('shop2shop')}
        >
          <RadioGroupItem value="shop2shop" id="shop2shop" className="text-white" />
          <Label htmlFor="shop2shop" className="flex items-center space-x-3 cursor-pointer w-full">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-medium">Shop2Shop</span>
          </Label>
        </div>
      </RadioGroup>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="text-white border-white hover:bg-gray-700">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default PaymentOptions;
