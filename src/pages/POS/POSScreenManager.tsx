import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Product, SplitPaymentDetails } from '@/types';
import PaymentForm from '@/components/PaymentForm';
import ShiftSummary from '@/components/ShiftSummary';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';
import RefundScreen from '@/components/RefundScreen';
import EndShiftForm from '@/components/EndShiftForm';
import ReconciliationReport from '@/components/ReconciliationReport';
import ProfitPlusScreen from '@/components/ProfitPlusScreen';
import SplitPaymentScreen from '@/components/SplitPaymentScreen';
import AccountPaymentScreen from '@/components/AccountPaymentScreen';

interface POSScreenManagerProps {
  cart: any[];
  currentShift: any;
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  endShift: (cashAmount: number) => any;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => any[];
  calculateExpectedCashInDrawer: (shiftId: number) => number;
  navigateToDashboard: () => void;
  showPaymentForm?: boolean;
  showCardPayment?: boolean;
  showShop2ShopScreen?: boolean;
  showRefundScreen?: boolean;
  showProfitPlusScreen?: boolean;
  showSplitPayment?: boolean;
  showAccountPayment?: boolean;
  customerInfo?: { name: string; phone: string };
  onClosePaymentForm?: () => void;
  onCloseCardPayment?: () => void;
  onCloseShop2ShopScreen?: () => void;
  onCloseRefundScreen?: () => void;
  onCloseProfitPlusScreen?: () => void;
  onCloseSplitPayment?: () => void;
  onCloseAccountPayment?: () => void;
}

const POSScreenManager: React.FC<POSScreenManagerProps> = ({
  cart,
  currentShift,
  calculateTotal,
  processPayment,
  processRefund,
  endShift,
  getShiftPaymentBreakdown,
  getShiftRefundBreakdown,
  getLowStockProducts,
  calculateExpectedCashInDrawer,
  navigateToDashboard,
  showPaymentForm = false,
  showCardPayment = false,
  showShop2ShopScreen = false,
  showRefundScreen = false,
  showProfitPlusScreen = false,
  showSplitPayment = false,
  showAccountPayment = false,
  customerInfo,
  onClosePaymentForm = () => {},
  onCloseCardPayment = () => {},
  onCloseShop2ShopScreen = () => {},
  onCloseRefundScreen = () => {},
  onCloseProfitPlusScreen = () => {},
  onCloseSplitPayment = () => {},
  onCloseAccountPayment = () => {},
}) => {
  const { toast } = useToast();
  
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showReconciliationReport, setShowReconciliationReport] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  const [endShiftCashAmount, setEndShiftCashAmount] = useState(0);
  
  React.useEffect(() => {
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
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
      
      screenManager.addEventListener('endshift', handleEndShift);
      return () => {
        screenManager.removeEventListener('endshift', handleEndShift);
      };
    }
  }, [cart, currentShift, calculateExpectedCashInDrawer, toast]);

  const handleSubmitEndShift = (cashAmount: number) => {
    if (!currentShift) return;
    
    const shift = endShift(cashAmount);
    if (shift) {
      setCompletedShift(shift);
      setShowEndShiftForm(false);
      
      // Prepare report data
      setEndShiftCashAmount(cashAmount);
      setShowReconciliationReport(true);
    }
  };
  
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

  const handleProcessRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => {
    const success = processRefund(product, quantity, refundMethod);
    
    if (success) {
      toast({
        title: "Refund processed successfully",
        description: `${formatCurrency(product.price * quantity)} refunded via ${refundMethod === 'cash' ? 'cash' : 'Shop2Shop'}`,
      });
      onCloseRefundScreen();
    } else {
      toast({
        title: "Refund failed",
        description: "There was an error processing the refund",
        variant: "destructive"
      });
    }
  };
  
  const handleCloseReconciliation = () => {
    setShowReconciliationReport(false);
    navigateToDashboard();
  };

  // Show different screens based on state
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

  if (showRefundScreen) {
    return (
      <RefundScreen
        onProcessRefund={handleProcessRefund}
        onCancel={onCloseRefundScreen}
      />
    );
  }
  
  if (showProfitPlusScreen) {
    return (
      <ProfitPlusScreen 
        onCancel={onCloseProfitPlusScreen}
      />
    );
  }

  if (showEndShiftForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <EndShiftForm
          onSubmit={handleSubmitEndShift}
          onCancel={() => setShowEndShiftForm(false)}
          expectedAmount={endShiftCashAmount}
        />
      </div>
    );
  }
  
  if (showReconciliationReport && completedShift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <ReconciliationReport 
          shift={completedShift}
          totalSales={completedShift.salesTotal || 0}
          grossProfit={completedShift.salesTotal ? completedShift.salesTotal * 0.25 : 0} // Assuming 25% profit margin
          paymentBreakdown={getShiftPaymentBreakdown(completedShift.id)}
          lowStockProducts={getLowStockProducts(5)}
          refundBreakdown={getShiftRefundBreakdown(completedShift.id)}
          cashExpected={calculateExpectedCashInDrawer(completedShift.id)}
          cashActual={endShiftCashAmount}
          onClose={handleCloseReconciliation}
        />
      </div>
    );
  }
  
  // Return null for the main POS view since it's handled in the parent component
  return null;
};

export default POSScreenManager;
