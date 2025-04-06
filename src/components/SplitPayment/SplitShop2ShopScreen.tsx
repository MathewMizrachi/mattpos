
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface SplitShop2ShopScreenProps {
  amount: number;
  currentPaymentIndex: number;
  totalPayments: number;
  onProcessPayment: () => void;
  onCancel: () => void;
}

const SplitShop2ShopScreen: React.FC<SplitShop2ShopScreenProps> = ({
  amount,
  currentPaymentIndex,
  totalPayments,
  onProcessPayment,
  onCancel
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/9894750c-6a6c-4995-883d-ddd554ab010a.png" 
              alt="Shop2Shop Logo" 
              className="h-36 w-36 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold">Total to Pay</h2>
          <p className="text-5xl mt-2 font-extrabold">{formatCurrency(amount)}</p>
        </div>
        
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/886ad285-9db8-4d56-bcad-1cdc5ab763b5.png" 
            alt="QR Code" 
            className="w-[200px] h-[200px] object-contain border-4 border-white"
          />
        </div>
        
        <div className="text-center mb-8">
          <p className="text-gray-300 mb-2">Shop Code</p>
          <p className="text-5xl font-bold tracking-widest">RALXLF</p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onProcessPayment}
            className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold text-xl px-8 py-6 rounded-md"
          >
            Complete
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitShop2ShopScreen;
