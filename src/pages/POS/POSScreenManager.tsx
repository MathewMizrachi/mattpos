
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Product, SplitPaymentDetails } from '@/types';
import PaymentScreens from '@/components/POS/PaymentScreens';
import ServiceScreens from '@/components/POS/ServiceScreens';
import { useShiftManager } from '@/hooks/useShiftManager';

interface POSScreenManagerProps {
  cart: any[];
  currentShift: any;
  calculateTotal: () => number;
  processPayment: (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => any;
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  processWithdrawal: (amount: number, reason: string) => boolean;
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
  showWithdrawalScreen?: boolean;
  showSplitPayment?: boolean;
  showAccountPayment?: boolean;
  customerInfo?: { name: string; phone: string };
  onClosePaymentForm?: () => void;
  onCloseCardPayment?: () => void;
  onCloseShop2ShopScreen?: () => void;
  onCloseRefundScreen?: () => void;
  onCloseProfitPlusScreen?: () => void;
  onCloseWithdrawalScreen?: () => void;
  onCloseSplitPayment?: () => void;
  onCloseAccountPayment?: () => void;
}

const POSScreenManager: React.FC<POSScreenManagerProps> = ({
  cart,
  currentShift,
  calculateTotal,
  processPayment,
  processRefund,
  processWithdrawal,
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
  showWithdrawalScreen = false,
  showSplitPayment = false,
  showAccountPayment = false,
  customerInfo,
  onClosePaymentForm = () => {},
  onCloseCardPayment = () => {},
  onCloseShop2ShopScreen = () => {},
  onCloseRefundScreen = () => {},
  onCloseProfitPlusScreen = () => {},
  onCloseWithdrawalScreen = () => {},
  onCloseSplitPayment = () => {},
  onCloseAccountPayment = () => {},
}) => {
  const { toast } = useToast();
  
  const {
    showEndShiftForm,
    showReconciliationReport,
    showWithdrawalScreen: managerShowWithdrawalScreen,
    completedShift,
    endShiftCashAmount,
    setShowEndShiftForm,
    handleEndShiftRequest,
    handleSubmitEndShift,
    handleCloseReconciliation,
    handleShowWithdrawalScreen,
    handleCloseWithdrawalScreen,
    handleProcessWithdrawal,
  } = useShiftManager({
    calculateExpectedCashInDrawer,
    endShift,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    navigateToDashboard,
    processWithdrawal,
  });
  
  useEffect(() => {
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const handleEndShift = () => {
        const result = handleEndShiftRequest(currentShift, cart);
        if (!result.success && result.message) {
          toast({
            title: "Cannot end shift",
            description: result.message,
            variant: "destructive"
          });
        }
      };
      
      screenManager.addEventListener('endshift', handleEndShift);
      return () => {
        screenManager.removeEventListener('endshift', handleEndShift);
      };
    }
  }, [cart, currentShift, toast, handleEndShiftRequest]);

  // If external withdrawal screen is requested
  useEffect(() => {
    if (showWithdrawalScreen) {
      handleShowWithdrawalScreen();
    }
  }, [showWithdrawalScreen, handleShowWithdrawalScreen]);

  // Show payment screens if any payment option is active
  if (showPaymentForm || showCardPayment || showShop2ShopScreen || 
      showAccountPayment || showSplitPayment) {
    return (
      <PaymentScreens
        showPaymentForm={showPaymentForm}
        showCardPayment={showCardPayment}
        showShop2ShopScreen={showShop2ShopScreen}
        showAccountPayment={showAccountPayment}
        showSplitPayment={showSplitPayment}
        calculateTotal={calculateTotal}
        processPayment={processPayment}
        customerInfo={customerInfo}
        onClosePaymentForm={onClosePaymentForm}
        onCloseCardPayment={onCloseCardPayment}
        onCloseShop2ShopScreen={onCloseShop2ShopScreen}
        onCloseAccountPayment={onCloseAccountPayment}
        onCloseSplitPayment={onCloseSplitPayment}
      />
    );
  }
  
  // Show service screens if any service option is active
  if (showRefundScreen || showProfitPlusScreen || managerShowWithdrawalScreen || 
      showEndShiftForm || showReconciliationReport) {
    return (
      <ServiceScreens
        showRefundScreen={showRefundScreen}
        showProfitPlusScreen={showProfitPlusScreen}
        showWithdrawalScreen={managerShowWithdrawalScreen}
        showEndShiftForm={showEndShiftForm}
        showReconciliationReport={showReconciliationReport}
        currentShift={currentShift}
        completedShift={completedShift}
        endShiftCashAmount={endShiftCashAmount}
        processRefund={processRefund}
        processWithdrawal={handleProcessWithdrawal}
        onCloseRefundScreen={onCloseRefundScreen}
        onCloseProfitPlusScreen={onCloseProfitPlusScreen}
        onCloseWithdrawalScreen={handleCloseWithdrawalScreen}
        setShowEndShiftForm={setShowEndShiftForm}
        handleSubmitEndShift={handleSubmitEndShift}
        handleCloseReconciliation={handleCloseReconciliation}
        getShiftPaymentBreakdown={getShiftPaymentBreakdown}
        getShiftRefundBreakdown={getShiftRefundBreakdown}
        getLowStockProducts={getLowStockProducts}
        calculateExpectedCashInDrawer={calculateExpectedCashInDrawer}
      />
    );
  }
  
  return null;
};

export default POSScreenManager;
