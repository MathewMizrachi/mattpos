
import { useToast } from "@/hooks/use-toast";
import { SplitPaymentDetails, Product } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface PaymentHandlersProps {
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  processRefund: (product: Product, quantity: number, refundMethod: 'shop2shop') => boolean;
  setShowCardPayment: (show: boolean) => void;
  setShowShop2Shop: (show: boolean) => void;
  setShowAccountPayment: (show: boolean) => void;
  setShowSplitPayment: (show: boolean) => void;
  setShowRefundScreen: (show: boolean) => void;
  setShowPaymentOptions: (show: boolean) => void;
  paymentMethod: 'card' | 'shop2shop' | 'account' | 'split';
  customerInfo?: { name: string; phone: string };
  setPaymentMethod: (method: 'card' | 'shop2shop' | 'account' | 'split') => void;
  setCustomerInfo: (info?: { name: string; phone: string }) => void;
}

export const usePaymentHandlers = ({
  calculateTotal,
  processPayment,
  processRefund,
  setShowCardPayment,
  setShowShop2Shop,
  setShowAccountPayment,
  setShowSplitPayment,
  setShowRefundScreen,
  setShowPaymentOptions,
  paymentMethod,
  customerInfo,
  setPaymentMethod,
  setCustomerInfo
}: PaymentHandlersProps) => {
  const { toast } = useToast();
  
  const handleSelectPaymentMethod = (
    method: 'shop2shop' | 'card' | 'account' | 'split',
    customerInfo?: { name: string; phone: string }
  ) => {
    setPaymentMethod(method);
    setShowPaymentOptions(false);
    setCustomerInfo(customerInfo);
    
    switch (method) {
      case 'card':
        setShowCardPayment(true);
        break;
      case 'shop2shop':
        setShowShop2Shop(true);
        break;
      case 'account':
        setShowAccountPayment(true);
        break;
      case 'split':
        setShowSplitPayment(true);
        break;
    }
  };
  
  const handleNonCashPayment = () => {
    const result = processPayment(
      calculateTotal(), 
      paymentMethod,
      customerInfo?.name,
      customerInfo?.phone
    );
    
    if (result.success) {
      toast({
        title: `${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} payment successful`,
        description: '',
      });
      setShowCardPayment(false);
      setShowShop2Shop(false);
      setShowAccountPayment(false);
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };
  
  const handleAccountPayment = (customerName: string, customerPhone: string) => {
    const result = processPayment(
      calculateTotal(), 
      'account',
      customerName,
      customerPhone
    );
    
    if (result.success) {
      toast({
        title: "Account payment successful",
        description: '',
      });
      setShowAccountPayment(false);
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };
  
  const handleSplitPayment = (splitPayments: SplitPaymentDetails[]) => {
    const totalAmount = splitPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const accountPayment = splitPayments.find(p => p.method === 'account');
    const customerName = accountPayment?.customerName || customerInfo?.name;
    const customerPhone = accountPayment?.customerPhone || customerInfo?.phone;
    
    const result = processPayment(
      totalAmount, 
      'split',
      customerName,
      customerPhone,
      splitPayments
    );
    
    if (result.success) {
      toast({
        title: "Split payment successful",
        description: '',
      });
      setShowSplitPayment(false);
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };

  const handleProcessRefund = (product: Product, quantity: number, refundMethod: 'shop2shop') => {
    const success = processRefund(product, quantity, refundMethod);
    
    if (success) {
      toast({
        title: "Refund processed successfully",
        description: `${formatCurrency(product.price * quantity)} refunded via ${refundMethod === 'shop2shop' ? 'Shop2Shop' : 'Shop2Shop'}`,
      });
      setShowRefundScreen(false);
    } else {
      toast({
        title: "Refund failed",
        description: "There was an error processing the refund",
        variant: "destructive"
      });
    }
  };
  
  return {
    handleSelectPaymentMethod,
    handleNonCashPayment,
    handleAccountPayment,
    handleSplitPayment,
    handleProcessRefund
  };
};
