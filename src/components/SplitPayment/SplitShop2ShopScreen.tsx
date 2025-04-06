
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
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
          <h2 className="text-3xl font-bold">Shop2Shop Payment</h2>
          <p className="text-xl mt-2">
            Amount: <span className="font-bold">{formatCurrency(amount)}</span>
          </p>
          <p className="text-md mt-2">
            Payment {currentPaymentIndex + 1} of {totalPayments}
          </p>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-md mb-6">
          <p className="text-lg mb-2">Process Shop2Shop payment of {formatCurrency(amount)}</p>
          <p className="text-gray-300">Verify Shop2Shop transaction before proceeding</p>
        </div>
        
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/886ad285-9db8-4d56-bcad-1cdc5ab763b5.png" 
            alt="QR Code" 
            className="w-[150px] h-[150px] object-contain"
          />
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-400 mb-2">Shop Code</p>
          <p className="text-3xl font-bold tracking-widest">RALXLF</p>
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
