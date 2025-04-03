
import React from 'react';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';
import AccountPaymentScreen from '@/components/AccountPaymentScreen';
import SplitPaymentScreen from '@/components/SplitPaymentScreen';
import { SplitPaymentDetails } from '@/types';

interface PaymentScreensProps {
  showCardPayment: boolean;
  showShop2Shop: boolean;
  showAccountPayment: boolean;
  showSplitPayment: boolean;
  calculateTotal: () => number;
  customerInfo?: { name: string; phone: string };
  handleNonCashPayment: () => void;
  handleAccountPayment: (customerName: string, customerPhone: string) => void;
  handleSplitPayment: (splitPayments: SplitPaymentDetails[]) => void;
  setShowCardPayment: (show: boolean) => void;
  setShowShop2Shop: (show: boolean) => void;
  setShowAccountPayment: (show: boolean) => void;
  setShowSplitPayment: (show: boolean) => void;
}

export const PaymentScreens: React.FC<PaymentScreensProps> = ({
  showCardPayment,
  showShop2Shop,
  showAccountPayment,
  showSplitPayment,
  calculateTotal,
  customerInfo,
  handleNonCashPayment,
  handleAccountPayment,
  handleSplitPayment,
  setShowCardPayment,
  setShowShop2Shop,
  setShowAccountPayment,
  setShowSplitPayment
}) => {
  if (showCardPayment) {
    return (
      <CardPaymentScreen
        total={calculateTotal()}
        onProcessPayment={handleNonCashPayment}
        onCancel={() => setShowCardPayment(false)}
      />
    );
  }
  
  if (showShop2Shop) {
    return (
      <Shop2ShopScreen
        total={calculateTotal()}
        onProcessPayment={handleNonCashPayment}
        onCancel={() => setShowShop2Shop(false)}
      />
    );
  }

  if (showAccountPayment) {
    return (
      <AccountPaymentScreen
        total={calculateTotal()}
        onProcessPayment={handleAccountPayment}
        onCancel={() => setShowAccountPayment(false)}
        customerInfo={customerInfo}
      />
    );
  }

  if (showSplitPayment) {
    return (
      <SplitPaymentScreen
        total={calculateTotal()}
        onProcessSplitPayment={handleSplitPayment}
        onCancel={() => setShowSplitPayment(false)}
        customerInfo={customerInfo}
      />
    );
  }
  
  return null;
};
