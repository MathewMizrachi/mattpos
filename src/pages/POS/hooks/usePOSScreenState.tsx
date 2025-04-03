
import { useState } from 'react';
import { Product, SplitPaymentDetails } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface UsePOSScreenStateProps {
  cart: any[];
  currentShift: any;
  calculateExpectedCashInDrawer: (shiftId: number) => number;
}

export const usePOSScreenState = ({ 
  cart, 
  currentShift,
  calculateExpectedCashInDrawer 
}: UsePOSScreenStateProps) => {
  const { toast } = useToast();
  
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showShop2Shop, setShowShop2Shop] = useState(false);
  const [showAccountPayment, setShowAccountPayment] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showCashPayment, setShowCashPayment] = useState(false);
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showReconciliationReport, setShowReconciliationReport] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'shop2shop' | 'account' | 'split' | 'cash'>('card');
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | undefined>(undefined);
  const [endShiftCashAmount, setEndShiftCashAmount] = useState(0);
  
  const handleEndShift = () => {
    if (cart.length > 0) {
      toast({
        title: "Cannot end shift",
        description: "Please complete or clear the current transaction",
        variant: "destructive"
      });
      return;
    }
    
    if (!currentShift) return;
    
    const expectedCash = calculateExpectedCashInDrawer(currentShift.id);
    setEndShiftCashAmount(expectedCash);
    setShowEndShiftForm(true);
  };

  return {
    showCardPayment,
    setShowCardPayment,
    showShop2Shop,
    setShowShop2Shop,
    showAccountPayment,
    setShowAccountPayment,
    showSplitPayment,
    setShowSplitPayment,
    showCashPayment,
    setShowCashPayment,
    showEndShiftForm,
    setShowEndShiftForm,
    showReconciliationReport,
    setShowReconciliationReport,
    completedShift,
    setCompletedShift,
    paymentMethod,
    setPaymentMethod,
    customerInfo,
    setCustomerInfo,
    endShiftCashAmount,
    setEndShiftCashAmount,
    handleEndShift
  };
};
