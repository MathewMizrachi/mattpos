
import React from 'react';
import ProfitPlusScreen from '@/components/ProfitPlusScreen';
import RefundScreen from '@/components/RefundScreen';
import PaymentOptions from '@/components/PaymentOptions';
import { Product } from '@/types';

interface SpecialScreensProps {
  showPaymentOptions: boolean;
  showRefundScreen: boolean;
  showProfitPlusScreen: boolean;
  handleSelectPaymentMethod: (method: 'shop2shop' | 'cash' | 'card' | 'account' | 'split', customerInfo?: { name: string; phone: string }) => void;
  handleProcessRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => void;
  setShowPaymentOptions: (show: boolean) => void;
  setShowRefundScreen: (show: boolean) => void;
  setShowProfitPlusScreen: (show: boolean) => void;
}

export const SpecialScreens: React.FC<SpecialScreensProps> = ({
  showPaymentOptions,
  showRefundScreen,
  showProfitPlusScreen,
  handleSelectPaymentMethod,
  handleProcessRefund,
  setShowPaymentOptions,
  setShowRefundScreen,
  setShowProfitPlusScreen
}) => {
  if (showPaymentOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <div className="w-full max-w-md p-8 bg-[#0A2645] rounded-lg shadow-lg border border-gray-700">
          <PaymentOptions 
            onSelectPaymentMethod={handleSelectPaymentMethod}
            onCancel={() => setShowPaymentOptions(false)}
          />
        </div>
      </div>
    );
  }
  
  if (showRefundScreen) {
    return (
      <RefundScreen
        onProcessRefund={handleProcessRefund}
        onCancel={() => setShowRefundScreen(false)}
      />
    );
  }
  
  if (showProfitPlusScreen) {
    return (
      <ProfitPlusScreen 
        onCancel={() => setShowProfitPlusScreen(false)}
      />
    );
  }
  
  return null;
};
