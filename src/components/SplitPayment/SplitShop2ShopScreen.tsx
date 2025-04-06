
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Check } from 'lucide-react';

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
          
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/886ad285-9db8-4d56-bcad-1cdc5ab763b5.png" 
              alt="QR Code" 
              className="w-[200px] h-[200px] object-contain border-4 border-white"
            />
          </div>
          
          <p className="text-gray-300 mb-2">Shop Code</p>
          <p className="text-5xl font-bold tracking-widest mb-8">RALXLF</p>
          
          <p className="text-2xl">Amount to Pay:</p>
          <p className="text-6xl mt-2 font-extrabold mb-4">{formatCurrency(amount)}</p>
          
          <p className="text-xl mb-6">Payment {currentPaymentIndex + 1} of {totalPayments}</p>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-md mb-8">
          <p>Process Shop2Shop payment of {formatCurrency(amount)}</p>
          <p className="mt-2">Verify Shop2Shop transaction before proceeding</p>
        </div>
        
        <div className="flex justify-between space-x-4">
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="flex-1 bg-transparent text-white border-gray-600 hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <Button 
            onClick={onProcessPayment}
            className="flex-1 bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-bold"
          >
            <Check className="h-4 w-4 mr-2" />
            {currentPaymentIndex < totalPayments - 1 ? "Next Payment" : "Complete Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SplitShop2ShopScreen;
