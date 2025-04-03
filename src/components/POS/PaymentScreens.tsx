
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Product, SplitPaymentDetails } from '@/types';
import PaymentForm from '@/components/PaymentForm';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';
import AccountPaymentScreen from '@/components/AccountPaymentScreen';
import SplitPaymentScreen from '@/components/SplitPaymentScreen';

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
  const { toast } = useToast();
  
  const handleProcessCashPayment = (cashReceived: number) => {
    const result = processPayment(cashReceived, 'cash');
    
    if (result.success) {
      toast({
        title: "Payment successful",
        description: `Change: ${formatCurrency(result.change)}`,
      });
      onClosePaymentForm();
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };

  const handleProcessCardPayment = () => {
    const result = processPayment(calculateTotal(), 'card');
    
    if (result.success) {
      toast({
        title: "Card payment successful",
        description: "",
      });
      onCloseCardPayment();
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };

  const handleProcessShop2ShopPayment = () => {
    const result = processPayment(calculateTotal(), 'shop2shop');
    
    if (result.success) {
      toast({
        title: "Shop2Shop payment successful",
        description: "",
      });
      onCloseShop2ShopScreen();
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };
  
  const handleProcessAccountPayment = (customerName: string, customerPhone: string, idNumber?: string, paymentTermDays?: number) => {
    const result = processPayment(calculateTotal(), 'account', customerName, customerPhone);
    
    if (result.success) {
      toast({
        title: "Account payment successful",
        description: "",
      });
      onCloseAccountPayment();
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };

  const handleProcessSplitPayment = (payments: SplitPaymentDetails[]) => {
    // Calculate total from split payments to ensure it matches
    const splitTotal = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const cartTotal = calculateTotal();
    
    if (Math.abs(splitTotal - cartTotal) > 0.01) {
      toast({
        title: "Payment amount mismatch",
        description: `Total payments (${formatCurrency(splitTotal)}) don't match cart total (${formatCurrency(cartTotal)})`,
        variant: "destructive"
      });
      return;
    }
    
    const result = processPayment(
      cartTotal, 
      'split', 
      customerInfo?.name, 
      customerInfo?.phone, 
      payments
    );
    
    if (result.success) {
      toast({
        title: "Split payment successful",
        description: `Total: ${formatCurrency(cartTotal)}`,
      });
      onCloseSplitPayment();
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };

  if (showPaymentForm) {
    return (
      <PaymentForm 
        total={calculateTotal()}
        onProcessPayment={handleProcessCashPayment}
        onCancel={onClosePaymentForm}
      />
    );
  }
  
  if (showCardPayment) {
    return (
      <CardPaymentScreen
        total={calculateTotal()}
        onProcessPayment={handleProcessCardPayment}
        onCancel={onCloseCardPayment}
      />
    );
  }
  
  if (showShop2ShopScreen) {
    return (
      <Shop2ShopScreen
        total={calculateTotal()}
        onProcessPayment={handleProcessShop2ShopPayment}
        onCancel={onCloseShop2ShopScreen}
      />
    );
  }
  
  if (showAccountPayment) {
    return (
      <AccountPaymentScreen
        total={calculateTotal()}
        onProcessPayment={handleProcessAccountPayment}
        onCancel={onCloseAccountPayment}
        customerInfo={customerInfo}
      />
    );
  }
  
  if (showSplitPayment) {
    return (
      <SplitPaymentScreen
        total={calculateTotal()}
        onProcessSplitPayment={handleProcessSplitPayment}
        onCancel={onCloseSplitPayment}
        customerInfo={customerInfo}
      />
    );
  }
  
  return null;
};

export default PaymentScreens;
