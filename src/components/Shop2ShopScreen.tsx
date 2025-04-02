
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Shop2ShopScreenProps {
  total: number;
  onProcessPayment: () => void;
  onCancel: () => void;
}

const Shop2ShopScreen: React.FC<Shop2ShopScreenProps> = ({
  total,
  onProcessPayment,
  onCancel
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/4531f963-ec96-471b-b1d6-1adba2dbf7cb.png" 
              alt="Shop2Shop Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold">Total to Pay</h2>
          <p className="text-4xl mt-2 font-extrabold">{formatCurrency(total)}</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/886ad285-9db8-4d56-bcad-1cdc5ab763b5.png" 
              alt="QR Code" 
              className="w-[150px] h-[150px] object-contain"
            />
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-2">Shop Code</p>
            <p className="text-3xl font-bold tracking-widest">RALXLF</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onProcessPayment} 
            className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
          >
            Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop2ShopScreen;
