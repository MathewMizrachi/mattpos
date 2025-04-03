
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Product, SplitPaymentDetails } from '@/types';
import PaymentForm from '@/components/PaymentForm';
import ShiftSummary from '@/components/ShiftSummary';
import PaymentOptions from '@/components/PaymentOptions';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';
import AccountPaymentScreen from '@/components/AccountPaymentScreen';
import SplitPaymentScreen from '@/components/SplitPaymentScreen';
import RefundScreen from '@/components/RefundScreen';
import EndShiftForm from '@/components/EndShiftForm';
import ReconciliationReport from '@/components/ReconciliationReport';
import ProfitPlusScreen from '@/components/ProfitPlusScreen';

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
}) => {
  const { toast } = useToast();
  
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showShop2Shop, setShowShop2Shop] = useState(false);
  const [showAccountPayment, setShowAccountPayment] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showRefundScreen, setShowRefundScreen] = useState(false);
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [showReconciliationReport, setShowReconciliationReport] = useState(false);
  const [showProfitPlusScreen, setShowProfitPlusScreen] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'shop2shop' | 'account' | 'split'>('cash');
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
  
  const handleSelectPaymentMethod = (
    method: 'shop2shop' | 'cash' | 'card' | 'account' | 'split',
    customerInfo?: { name: string; phone: string }
  ) => {
    setPaymentMethod(method);
    setShowPaymentOptions(false);
    setCustomerInfo(customerInfo);
    
    switch (method) {
      case 'cash':
        setShowPaymentForm(true);
        break;
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
  
  const handlePaymentComplete = (cashReceived: number) => {
    const result = processPayment(cashReceived, 'cash');
    
    if (result.success) {
      toast({
        title: "Payment successful",
        description: `Change: ${formatCurrency(result.change)}`,
      });
      setShowPaymentForm(false);
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
      setShowRefundScreen(false);
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

  if (showRefundScreen) {
    return (
      <RefundScreen
        onProcessRefund={handleProcessRefund}
        onCancel={() => setShowRefundScreen(false)}
      />
    );
  }
  
  if (showPaymentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <PaymentForm 
            total={calculateTotal()}
            onProcessPayment={handlePaymentComplete}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      </div>
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
  
  if (showProfitPlusScreen) {
    return (
      <ProfitPlusScreen 
        onCancel={() => setShowProfitPlusScreen(false)}
      />
    );
  }
  
  // Return null for the main POS view since it's handled in the parent component
  return null;
};

export default POSScreenManager;
