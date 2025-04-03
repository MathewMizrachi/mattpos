
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product, SplitPaymentDetails } from '@/types';

interface UsePaymentHandlersProps {
  paymentStates: ReturnType<typeof import('./usePaymentStates').usePaymentStates>;
  currentShift: any;
  cart: any[];
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  processWithdrawal: (amount: number, reason: string) => boolean;
  endShift: (cashAmount: number) => any;
}

export const usePaymentHandlers = ({
  paymentStates,
  currentShift,
  cart,
  calculateTotal,
  processPayment,
  processRefund,
  processWithdrawal,
  endShift
}: UsePaymentHandlersProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSelectPaymentMethod = (
    method: 'shop2shop' | 'cash' | 'card' | 'account' | 'split',
    customerInfo?: { name: string; phone: string }
  ) => {
    paymentStates.setShowPaymentOptions(false);
    
    if (customerInfo) {
      paymentStates.setCustomerInfo(customerInfo);
    }
    
    switch (method) {
      case 'cash':
        paymentStates.setShowPaymentForm(true);
        break;
      case 'card':
        paymentStates.setShowCardPayment(true);
        break;
      case 'shop2shop':
        paymentStates.setShowShop2ShopScreen(true);
        break;
      case 'account':
        paymentStates.setShowAccountPayment(true);
        break;
      case 'split':
        paymentStates.setShowSplitPayment(true);
        break;
    }
  };
  
  const handleShowPaymentForm = () => {
    paymentStates.setShowPaymentOptions(true);
  };
  
  const handleEndShift = () => {
    if (paymentStates.isAnyScreenActive()) {
      return;
    }
    
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const endShiftEvent = new CustomEvent('endshift');
      screenManager.dispatchEvent(endShiftEvent);
    }
  };
  
  return {
    handleSelectPaymentMethod,
    handleShowPaymentForm,
    handleEndShift
  };
};
