
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import POSScreenManager from './POS/POSScreenManager';
import POSMain from './POS/POSMain';
import { usePOSState } from './POS/usePOSState';

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
  
  const {
    searchTerm,
    setSearchTerm,
    cartExpanded,
    toggleCartExpand,
    calculateTotal,
  } = usePOSState({ cart });

  const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);
  const [showPaymentForm, setShowPaymentForm] = React.useState(false);
  const [showCardPayment, setShowCardPayment] = React.useState(false);
  const [showShop2ShopScreen, setShowShop2ShopScreen] = React.useState(false);
  const [showRefundScreen, setShowRefundScreen] = React.useState(false);
  const [showProfitPlusScreen, setShowProfitPlusScreen] = React.useState(false);
  const [showWithdrawalScreen, setShowWithdrawalScreen] = React.useState(false);
  
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
    if (showPaymentOptions || showRefundScreen || showProfitPlusScreen || showWithdrawalScreen) {
      return;
    }
    
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const endShiftEvent = new CustomEvent('endshift');
      screenManager.dispatchEvent(endShiftEvent);
    }
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleCashPayment = () => {
    setShowPaymentForm(true);
  };
  
  const handleCardPayment = () => {
    setShowCardPayment(true);
  };
  
  const handleShop2ShopPayment = () => {
    setShowShop2ShopScreen(true);
  };
  
  if (showPaymentForm || showCardPayment || showShop2ShopScreen || showRefundScreen || showProfitPlusScreen || showWithdrawalScreen) {
    return (
      <div id="pos-screen-manager">
        <POSScreenManager
          cart={cart}
          currentShift={currentShift}
          calculateTotal={calculateTotal}
          processPayment={processPayment}
          processRefund={processRefund}
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
          onClosePaymentForm={() => setShowPaymentForm(false)}
          onCloseCardPayment={() => setShowCardPayment(false)}
          onCloseShop2ShopScreen={() => setShowShop2ShopScreen(false)}
          onCloseRefundScreen={() => setShowRefundScreen(false)}
          onCloseProfitPlusScreen={() => setShowProfitPlusScreen(false)}
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
        onShowPaymentOptions={() => setShowPaymentOptions(true)}
        onShowRefundScreen={() => setShowRefundScreen(true)}
        onShowProfitPlusScreen={() => setShowProfitPlusScreen(true)}
        onShowWithdrawalScreen={() => setShowWithdrawalScreen(true)}
        onCashPayment={handleCashPayment}
        onCardPayment={handleCardPayment}
        onShop2ShopPayment={handleShop2ShopPayment}
      />
    </>
  );
};

export default POS;
