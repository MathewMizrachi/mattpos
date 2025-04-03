
import React from 'react';
import { Product, SplitPaymentDetails } from '@/types';
import { usePOSScreenState } from './hooks/usePOSScreenState';
import { usePaymentHandlers } from './services/paymentHandlers';
import { useShiftHandlers } from './services/shiftHandlers';
import { useScreenEvents } from './hooks/useScreenEvents';
import { PaymentScreens } from './components/PaymentScreens';
import { EndShiftScreens } from './components/EndShiftScreens';
import { SpecialScreens } from './components/SpecialScreens';
import WithdrawalScreen from './components/WithdrawalScreen';

interface POSScreenManagerProps {
  cart: any[];
  currentShift: any;
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  processRefund: (product: Product, quantity: number, refundMethod: 'shop2shop') => boolean;
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
  const screenState = usePOSScreenState({ 
    cart, 
    currentShift, 
    calculateExpectedCashInDrawer 
  });
  
  // Use payment handlers
  const paymentHandlers = usePaymentHandlers({
    calculateTotal,
    processPayment,
    processRefund,
    setShowCardPayment: screenState.setShowCardPayment,
    setShowShop2Shop: screenState.setShowShop2Shop,
    setShowAccountPayment: screenState.setShowAccountPayment,
    setShowSplitPayment: screenState.setShowSplitPayment,
    setShowCashPayment: screenState.setShowCashPayment,
    setShowRefundScreen,
    setShowPaymentOptions,
    paymentMethod: screenState.paymentMethod,
    customerInfo: screenState.customerInfo,
    setPaymentMethod: screenState.setPaymentMethod,
    setCustomerInfo: screenState.setCustomerInfo
  });

  // Use shift handlers
  const shiftHandlers = useShiftHandlers({
    currentShift,
    endShift,
    endShiftCashAmount: screenState.endShiftCashAmount,
    setCompletedShift: screenState.setCompletedShift,
    setShowEndShiftForm: screenState.setShowEndShiftForm,
    setShowReconciliationReport: screenState.setShowReconciliationReport,
    setEndShiftCashAmount: screenState.setEndShiftCashAmount,
    navigateToDashboard
  });

  // Mount event listener for end shift
  useScreenEvents({
    cart,
    handleEndShift: screenState.handleEndShift
  });

  // Render withdrawal screen
  if (showWithdrawalScreen) {
    return (
      <WithdrawalScreen 
        onCancel={() => setShowWithdrawalScreen(false)}
      />
    );
  }

  // Render special screens (payment options, refund, profit plus)
  if (showPaymentOptions || showRefundScreen || showProfitPlusScreen) {
    return (
      <SpecialScreens
        showPaymentOptions={showPaymentOptions}
        showRefundScreen={showRefundScreen}
        showProfitPlusScreen={showProfitPlusScreen}
        handleSelectPaymentMethod={paymentHandlers.handleSelectPaymentMethod}
        handleProcessRefund={paymentHandlers.handleProcessRefund}
        setShowPaymentOptions={setShowPaymentOptions}
        setShowRefundScreen={setShowRefundScreen}
        setShowProfitPlusScreen={setShowProfitPlusScreen}
      />
    );
  }
  
  // Render payment screens
  if (screenState.showCardPayment || screenState.showShop2Shop || 
      screenState.showAccountPayment || screenState.showSplitPayment || 
      screenState.showCashPayment) {
    return (
      <PaymentScreens
        showCardPayment={screenState.showCardPayment}
        showShop2Shop={screenState.showShop2Shop}
        showAccountPayment={screenState.showAccountPayment}
        showSplitPayment={screenState.showSplitPayment}
        showCashPayment={screenState.showCashPayment}
        calculateTotal={calculateTotal}
        customerInfo={screenState.customerInfo}
        handleNonCashPayment={paymentHandlers.handleNonCashPayment}
        handleCashPayment={paymentHandlers.handleCashPayment}
        handleAccountPayment={paymentHandlers.handleAccountPayment}
        handleSplitPayment={paymentHandlers.handleSplitPayment}
        setShowCardPayment={screenState.setShowCardPayment}
        setShowShop2Shop={screenState.setShowShop2Shop}
        setShowAccountPayment={screenState.setShowAccountPayment}
        setShowSplitPayment={screenState.setShowSplitPayment}
        setShowCashPayment={screenState.setShowCashPayment}
      />
    );
  }
  
  // Render end shift screens
  if (screenState.showEndShiftForm || (screenState.showReconciliationReport && screenState.completedShift)) {
    return (
      <EndShiftScreens
        showEndShiftForm={screenState.showEndShiftForm}
        showReconciliationReport={screenState.showReconciliationReport}
        completedShift={screenState.completedShift}
        endShiftCashAmount={screenState.endShiftCashAmount}
        handleSubmitEndShift={shiftHandlers.handleSubmitEndShift}
        setShowEndShiftForm={screenState.setShowEndShiftForm}
        getShiftPaymentBreakdown={getShiftPaymentBreakdown}
        getShiftRefundBreakdown={getShiftRefundBreakdown}
        getLowStockProducts={getLowStockProducts}
        calculateExpectedCashInDrawer={calculateExpectedCashInDrawer}
        handleCloseReconciliation={shiftHandlers.handleCloseReconciliation}
      />
    );
  }
  
  // No screens to show
  return null;
};

export default POSScreenManager;
