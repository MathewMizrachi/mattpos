
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

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
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-2">
      <div className="w-full max-w-md mx-auto text-white">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <img 
              src="/lovable-uploads/9894750c-6a6c-4995-883d-ddd554ab010a.png" 
              alt="Shop2Shop Logo" 
              className="h-36 w-36 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold">Total to Pay</h2>
          <p className="text-5xl mt-2 font-extrabold">{formatCurrency(total)}</p>
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
            onClick={handlePayment} 
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

export default Shop2ShopScreen;
