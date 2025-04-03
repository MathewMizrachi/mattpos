
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Product, SplitPaymentDetails } from '@/types';
import POSScreenManager from './POS/POSScreenManager';
import POSMain from './POS/POSMain';
import { usePOSState } from './POS/usePOSState';
import PaymentOptions from '@/components/PaymentOptions';
import { useToast } from '@/hooks/use-toast';

const POS = () => {
  const { 
    currentUser, 
    currentShift, 
    products,
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    processPayment,
    processRefund,
    endShift,
    logout,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    calculateExpectedCashInDrawer
  } = useApp();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    searchTerm,
    setSearchTerm,
    cartExpanded,
    toggleCartExpand,
    calculateTotal,
  } = usePOSState({ cart });

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showShop2ShopScreen, setShowShop2ShopScreen] = useState(false);
  const [showRefundScreen, setShowRefundScreen] = useState(false);
  const [showProfitPlusScreen, setShowProfitPlusScreen] = useState(false);
  const [showWithdrawalScreen, setShowWithdrawalScreen] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showAccountPayment, setShowAccountPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<{ name: string; phone: string } | undefined>(undefined);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  useEffect(() => {
    if (!currentShift) {
      navigate('/dashboard');
    }
  }, [currentShift, navigate]);
  
  const handleAddToCart = (product: Product, quantity: number, customPrice?: number) => {
    if (customPrice !== undefined && customPrice !== product.price) {
      addToCart(product, quantity, customPrice);
    } else {
      addToCart(product, quantity);
    }
  };

  const handleEndShift = () => {
    if (showPaymentOptions || showPaymentForm || showRefundScreen || showProfitPlusScreen || showWithdrawalScreen) {
      return;
    }
    
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const endShiftEvent = new CustomEvent('endshift');
      screenManager.dispatchEvent(endShiftEvent);
    }
  };

  const processWithdrawal = (amount: number, reason: string): boolean => {
    if (!currentShift) {
      toast({
        title: "Error",
        description: "No active shift to withdraw from",
        variant: "destructive"
      });
      return false;
    }
    
    // In a real app, you would call the backend to record the withdrawal
    // For this demo, we'll just show a success message
    
    toast({
      title: "Withdrawal successful",
      description: `${amount.toFixed(2)} withdrawn from register for: ${reason}`,
    });
    return true;
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleSelectPaymentMethod = (
    method: 'shop2shop' | 'cash' | 'card' | 'account' | 'split',
    customerInfo?: { name: string; phone: string }
  ) => {
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
        setShowShop2ShopScreen(true);
        break;
      case 'account':
        setShowAccountPayment(true);
        break;
      case 'split':
        setShowSplitPayment(true);
        break;
    }
  };
  
  const handleShowPaymentForm = () => {
    setShowPaymentOptions(true);
  };
  
  if (showPaymentOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645]">
        <PaymentOptions 
          onSelectPaymentMethod={handleSelectPaymentMethod}
          onCancel={() => setShowPaymentOptions(false)}
        />
      </div>
    );
  }
  
  if (showPaymentForm || showCardPayment || showShop2ShopScreen || showRefundScreen || 
      showProfitPlusScreen || showWithdrawalScreen || showSplitPayment || showAccountPayment) {
    return (
      <div id="pos-screen-manager">
        <POSScreenManager
          cart={cart}
          currentShift={currentShift}
          calculateTotal={calculateTotal}
          processPayment={processPayment}
          processRefund={processRefund}
          processWithdrawal={processWithdrawal}
          endShift={endShift}
          getShiftPaymentBreakdown={getShiftPaymentBreakdown}
          getShiftRefundBreakdown={getShiftRefundBreakdown}
          getLowStockProducts={getLowStockProducts}
          calculateExpectedCashInDrawer={calculateExpectedCashInDrawer}
          navigateToDashboard={navigateToDashboard}
          showPaymentForm={showPaymentForm}
          showCardPayment={showCardPayment}
          showShop2ShopScreen={showShop2ShopScreen}
          showRefundScreen={showRefundScreen}
          showProfitPlusScreen={showProfitPlusScreen}
          showWithdrawalScreen={showWithdrawalScreen}
          showSplitPayment={showSplitPayment}
          showAccountPayment={showAccountPayment}
          customerInfo={customerInfo}
          onClosePaymentForm={() => setShowPaymentForm(false)}
          onCloseCardPayment={() => setShowCardPayment(false)}
          onCloseShop2ShopScreen={() => setShowShop2ShopScreen(false)}
          onCloseRefundScreen={() => setShowRefundScreen(false)}
          onCloseProfitPlusScreen={() => setShowProfitPlusScreen(false)}
          onCloseWithdrawalScreen={() => setShowWithdrawalScreen(false)}
          onCloseSplitPayment={() => setShowSplitPayment(false)}
          onCloseAccountPayment={() => setShowAccountPayment(false)}
        />
      </div>
    );
  }
  
  return (
    <>
      <POSMain
        currentUser={currentUser}
        currentShift={currentShift}
        products={products}
        cart={cart}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddToCart={handleAddToCart}
        onUpdateCartItem={updateCartItem}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        cartExpanded={cartExpanded}
        toggleCartExpand={toggleCartExpand}
        calculateTotal={calculateTotal}
        onEndShift={handleEndShift}
        onLogout={logout}
        onShowPaymentForm={handleShowPaymentForm}
        onShowRefundScreen={() => setShowRefundScreen(true)}
        onShowProfitPlusScreen={() => setShowProfitPlusScreen(true)}
        onShowWithdrawalScreen={() => setShowWithdrawalScreen(true)}
        onCashPayment={() => setShowPaymentForm(true)}
        onCardPayment={() => setShowCardPayment(true)}
        onShop2ShopPayment={() => setShowShop2ShopScreen(true)}
      />
    </>
  );
};

export default POS;
