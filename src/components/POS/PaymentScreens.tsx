
import React from 'react';
import { SplitPaymentDetails } from '@/types';
import {
  CashPaymentScreenContainer,
  CardPaymentScreenContainer,
  Shop2ShopScreenContainer,
  AccountPaymentScreenContainer,
  SplitPaymentScreenContainer
} from './PaymentScreens/index';

interface PaymentScreensProps {
  showPaymentForm: boolean;
  showCardPayment: boolean;
  showShop2ShopScreen: boolean;
  showAccountPayment: boolean;
  showSplitPayment: boolean;
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  customerInfo?: { name: string; phone: string };
  onClosePaymentForm: () => void;
  onCloseCardPayment: () => void;
  onCloseShop2ShopScreen: () => void;
  onCloseAccountPayment: () => void;
  onCloseSplitPayment: () => void;
}

const PaymentScreens: React.FC<PaymentScreensProps> = ({
  showPaymentForm,
  showCardPayment,
  showShop2ShopScreen,
  showAccountPayment,
  showSplitPayment,
  calculateTotal,
  processPayment,
  customerInfo,
  onClosePaymentForm,
  onCloseCardPayment,
  onCloseShop2ShopScreen,
  onCloseAccountPayment,
  onCloseSplitPayment
}) => {
  if (showPaymentForm) {
    return (
      <CashPaymentScreenContainer
        calculateTotal={calculateTotal}
        processPayment={(amount, method) => processPayment(amount, method)}
        onClose={onClosePaymentForm}
      />
    );
  }
  
  if (showCardPayment) {
    return (
      <CardPaymentScreenContainer
        calculateTotal={calculateTotal}
        processPayment={(amount, method) => processPayment(amount, method)}
        onClose={onCloseCardPayment}
      />
    );
  }
  
  if (showShop2ShopScreen) {
    return (
      <Shop2ShopScreenContainer
        calculateTotal={calculateTotal}
        processPayment={(amount, method) => processPayment(amount, method)}
        onClose={onCloseShop2ShopScreen}
      />
    );
  }
  
  if (showAccountPayment) {
    return (
      <AccountPaymentScreenContainer
        calculateTotal={calculateTotal}
        processPayment={(amount, method, customerName, customerPhone) => 
          processPayment(amount, method, customerName, customerPhone)
        }
        onClose={onCloseAccountPayment}
        customerInfo={customerInfo}
      />
    );
  }
  
  if (showSplitPayment) {
    return (
      <SplitPaymentScreenContainer
        calculateTotal={calculateTotal}
        processPayment={processPayment}
        onClose={onCloseSplitPayment}
        customerInfo={customerInfo}
      />
    );
  }
  
  return null;
};

export default PaymentScreens;
