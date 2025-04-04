
import { useState } from 'react';

export const usePaymentStates = () => {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showShop2ShopScreen, setShowShop2ShopScreen] = useState(false);
  const [showRefundScreen, setShowRefundScreen] = useState(false);
  const [showProfitPlusScreen, setShowProfitPlusScreen] = useState(false);
  const [showWithdrawalScreen, setShowWithdrawalScreen] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showAccountPayment, setShowAccountPayment] = useState(false);
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | undefined>(undefined);
  
  // Function to check if any payment or service screen is visible
  const isAnyScreenActive = () => {
    return showPaymentOptions || showPaymentForm || showCardPayment || 
           showShop2ShopScreen || showRefundScreen || showProfitPlusScreen || 
           showWithdrawalScreen || showSplitPayment || showAccountPayment ||
           showEndShiftForm;
  };
  
  // Function to reset all screen states
  const resetAllScreens = () => {
    setShowPaymentOptions(false);
    setShowPaymentForm(false);
    setShowCardPayment(false);
    setShowShop2ShopScreen(false);
    setShowRefundScreen(false);
    setShowProfitPlusScreen(false);
    setShowWithdrawalScreen(false);
    setShowSplitPayment(false);
    setShowAccountPayment(false);
    setShowEndShiftForm(false);
    setCustomerInfo(undefined);
  };
  
  return {
    showPaymentOptions,
    setShowPaymentOptions,
    showPaymentForm,
    setShowPaymentForm,
    showCardPayment,
    setShowCardPayment,
    showShop2ShopScreen,
    setShowShop2ShopScreen,
    showRefundScreen,
    setShowRefundScreen,
    showProfitPlusScreen,
    setShowProfitPlusScreen,
    showWithdrawalScreen,
    setShowWithdrawalScreen,
    showSplitPayment,
    setShowSplitPayment,
    showAccountPayment,
    setShowAccountPayment,
    showEndShiftForm,
    setShowEndShiftForm,
    customerInfo,
    setCustomerInfo,
    isAnyScreenActive,
    resetAllScreens
  };
};
