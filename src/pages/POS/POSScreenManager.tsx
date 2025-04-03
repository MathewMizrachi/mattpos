
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, SplitPaymentDetails } from '@/types';
import { usePOSScreenState } from './hooks/usePOSScreenState';
import { usePaymentHandlers } from './services/paymentHandlers';
import { useShiftHandlers } from './services/shiftHandlers';
import { PaymentScreens } from './components/PaymentScreens';
import { EndShiftScreens } from './components/EndShiftScreens';
import { SpecialScreens } from './components/SpecialScreens';

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
  showPaymentOptions: boolean;
  showRefundScreen: boolean;
  showProfitPlusScreen: boolean;
  showWithdrawalScreen: boolean;
  setShowPaymentOptions: (show: boolean) => void;
  setShowRefundScreen: (show: boolean) => void;
  setShowProfitPlusScreen: (show: boolean) => void;
  setShowWithdrawalScreen: (show: boolean) => void;
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
  showPaymentOptions,
  showRefundScreen,
  showProfitPlusScreen,
  showWithdrawalScreen,
  setShowPaymentOptions,
  setShowRefundScreen,
  setShowProfitPlusScreen,
  setShowWithdrawalScreen,
}) => {
  // Use screen state hook
  const {
    showPaymentForm,
    setShowPaymentForm,
    showCardPayment,
    setShowCardPayment,
    showShop2Shop,
    setShowShop2Shop,
    showAccountPayment,
    setShowAccountPayment,
    showSplitPayment,
    setShowSplitPayment,
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
  } = usePOSScreenState({ 
    cart, 
    currentShift, 
    calculateExpectedCashInDrawer 
  });

  // Use payment handlers
  const {
    handleSelectPaymentMethod,
    handleNonCashPayment,
    handleAccountPayment,
    handleSplitPayment,
    handlePaymentComplete,
    handleProcessRefund
  } = usePaymentHandlers({
    calculateTotal,
    processPayment,
    processRefund,
    setShowPaymentForm,
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
  });

  // Use shift handlers
  const {
    handleSubmitEndShift,
    handleCloseReconciliation
  } = useShiftHandlers({
    currentShift,
    endShift,
    endShiftCashAmount,
    setCompletedShift,
    setShowEndShiftForm,
    setShowReconciliationReport,
    setEndShiftCashAmount,
    navigateToDashboard
  });

  // Mount event listener for end shift
  React.useEffect(() => {
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const onEndShift = () => handleEndShift();
      screenManager.addEventListener('endshift', onEndShift);
      return () => screenManager.removeEventListener('endshift', onEndShift);
    }
  }, [cart, currentShift]);

  // Render special screens (payment options, refund, profit plus)
  if (showPaymentOptions || showRefundScreen || showProfitPlusScreen) {
    return (
      <SpecialScreens
        showPaymentOptions={showPaymentOptions}
        showRefundScreen={showRefundScreen}
        showProfitPlusScreen={showProfitPlusScreen}
        handleSelectPaymentMethod={handleSelectPaymentMethod}
        handleProcessRefund={handleProcessRefund}
        setShowPaymentOptions={setShowPaymentOptions}
        setShowRefundScreen={setShowRefundScreen}
        setShowProfitPlusScreen={setShowProfitPlusScreen}
      />
    );
  }
  
  // Render payment screens
  if (showPaymentForm || showCardPayment || showShop2Shop || 
      showAccountPayment || showSplitPayment) {
    return (
      <PaymentScreens
        showPaymentForm={showPaymentForm}
        showCardPayment={showCardPayment}
        showShop2Shop={showShop2Shop}
        showAccountPayment={showAccountPayment}
        showSplitPayment={showSplitPayment}
        calculateTotal={calculateTotal}
        customerInfo={customerInfo}
        handlePaymentComplete={handlePaymentComplete}
        handleNonCashPayment={handleNonCashPayment}
        handleAccountPayment={handleAccountPayment}
        handleSplitPayment={handleSplitPayment}
        setShowPaymentForm={setShowPaymentForm}
        setShowCardPayment={setShowCardPayment}
        setShowShop2Shop={setShowShop2Shop}
        setShowAccountPayment={setShowAccountPayment}
        setShowSplitPayment={setShowSplitPayment}
      />
    );
  }
  
  // Render end shift screens
  if (showEndShiftForm || (showReconciliationReport && completedShift)) {
    return (
      <EndShiftScreens
        showEndShiftForm={showEndShiftForm}
        showReconciliationReport={showReconciliationReport}
        completedShift={completedShift}
        endShiftCashAmount={endShiftCashAmount}
        handleSubmitEndShift={handleSubmitEndShift}
        setShowEndShiftForm={setShowEndShiftForm}
        getShiftPaymentBreakdown={getShiftPaymentBreakdown}
        getShiftRefundBreakdown={getShiftRefundBreakdown}
        getLowStockProducts={getLowStockProducts}
        calculateExpectedCashInDrawer={calculateExpectedCashInDrawer}
        handleCloseReconciliation={handleCloseReconciliation}
      />
    );
  }
  
  // No screens to show
  return null;
};

export default POSScreenManager;
