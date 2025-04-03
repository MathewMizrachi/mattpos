
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { Shop2ShopLogo } from './Shop2Shop/Shop2ShopLogo';
import { TotalDisplay } from './Shop2Shop/TotalDisplay';
import { QRCodeDisplay } from './Shop2Shop/QRCodeDisplay';
import { ShopCodeDisplay } from './Shop2Shop/ShopCodeDisplay';
import { PaymentButtons } from './Shop2Shop/PaymentButtons';

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
  const handlePayment = () => {
    // First show the custom toast
    toast({
      title: "Payment Successful",
      description: "",
      className: "bg-[#0A2645] text-white text-2xl font-bold text-center p-6",
      duration: 3000, // 3 seconds
    });
    
    // Then call the original process payment function
    onProcessPayment();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0A2645] z-50 pt-0">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-4">
          <Shop2ShopLogo />
          <TotalDisplay total={total} />
        </div>
        
        <div className="mb-6">
          <QRCodeDisplay />
          <ShopCodeDisplay />
        </div>
        
        <PaymentButtons 
          onCancel={onCancel} 
          onComplete={handlePayment} 
        />
      </div>
    </div>
  );
};

export default Shop2ShopScreen;
