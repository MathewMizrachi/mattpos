
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
          <p className="text-xl mt-2">{formatCurrency(total)}</p>
        </div>
        
        <div className="bg-[#0A2645] border-2 border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded">
              <img 
                src="/lovable-uploads/994da451-404b-44cf-a00d-5d8a3840a069.png" 
                alt="QR Code" 
                className="w-[200px] h-[200px] object-contain"
              />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 mb-2">Shop Code</p>
            <p className="text-3xl font-bold tracking-widest">RALXF</p>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <p>Scan the QR code or use the shop code to complete your payment</p>
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
