
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CreditCard, Banknote } from 'lucide-react';

interface PaymentOptionsProps {
  onSelectPaymentMethod: (method: 'shop2shop' | 'cash' | 'card') => void;
  onCancel: () => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  onSelectPaymentMethod
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">Select Payment Method</h2>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={() => onSelectPaymentMethod('shop2shop')}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <ShoppingBag className="h-8 w-8 mr-4" />
          Shop2Shop
        </Button>
        
        <Button 
          onClick={() => onSelectPaymentMethod('cash')}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <Banknote className="h-8 w-8 mr-4" />
          Cash
        </Button>
        
        <Button 
          onClick={() => onSelectPaymentMethod('card')}
          className="w-full h-20 bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 hover:border-[#FAA225] text-white text-xl"
        >
          <CreditCard className="h-8 w-8 mr-4" />
          Card
        </Button>
      </div>
    </div>
  );
};

export default PaymentOptions;
