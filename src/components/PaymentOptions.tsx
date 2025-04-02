
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingBag, CreditCard, Banknote } from 'lucide-react';

interface PaymentOptionsProps {
  onSelectPaymentMethod: (method: 'shop2shop' | 'cash' | 'card') => void;
  onCancel: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  onSelectPaymentMethod, 
  onCancel 
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<'shop2shop' | 'cash' | 'card'>('shop2shop');

  const handlePaymentSelect = () => {
    onSelectPaymentMethod(selectedMethod);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Select Payment Method</h2>
      </div>
      
      <RadioGroup
        value={selectedMethod}
        onValueChange={(value) => setSelectedMethod(value as 'shop2shop' | 'cash' | 'card')}
        className="space-y-6 mb-8"
      >
        <div 
          className={`flex items-center space-x-4 border-2 p-6 rounded-lg hover:bg-gray-700 cursor-pointer bg-gray-800 text-white ${selectedMethod === 'shop2shop' ? 'border-[#FAA225]' : 'border-gray-700'}`}
          onClick={() => setSelectedMethod('shop2shop')}
        >
          <RadioGroupItem value="shop2shop" id="shop2shop" className="text-white scale-125" />
          <Label htmlFor="shop2shop" className="flex items-center space-x-4 cursor-pointer w-full">
            <ShoppingBag className="h-8 w-8" />
            <span className="font-bold text-xl">Shop2Shop</span>
          </Label>
        </div>
        
        <div 
          className={`flex items-center space-x-4 border-2 p-6 rounded-lg hover:bg-gray-700 cursor-pointer bg-gray-800 text-white ${selectedMethod === 'cash' ? 'border-[#FAA225]' : 'border-gray-700'}`}
          onClick={() => setSelectedMethod('cash')}
        >
          <RadioGroupItem value="cash" id="cash" className="text-white scale-125" />
          <Label htmlFor="cash" className="flex items-center space-x-4 cursor-pointer w-full">
            <Banknote className="h-8 w-8" />
            <span className="font-bold text-xl">Cash</span>
          </Label>
        </div>
        
        <div 
          className={`flex items-center space-x-4 border-2 p-6 rounded-lg hover:bg-gray-700 cursor-pointer bg-gray-800 text-white ${selectedMethod === 'card' ? 'border-[#FAA225]' : 'border-gray-700'}`}
          onClick={() => setSelectedMethod('card')}
        >
          <RadioGroupItem value="card" id="card" className="text-white scale-125" />
          <Label htmlFor="card" className="flex items-center space-x-4 cursor-pointer w-full">
            <CreditCard className="h-8 w-8" />
            <span className="font-bold text-xl">Card</span>
          </Label>
        </div>
      </RadioGroup>
      
      <div className="flex justify-between space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="text-white border-white hover:bg-gray-700">
          Cancel
        </Button>
        <Button 
          onClick={handlePaymentSelect}
          className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PaymentOptions;
