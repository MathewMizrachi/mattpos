
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useToast, showLowStockAlert } from '@/hooks/use-toast';
import POSScreenManager from './POS/POSScreenManager';
import POSMain from './POS/POSMain';
import { usePOSState } from './POS/usePOSState';
import { usePaymentStates } from './POS/usePaymentStates';
import { usePaymentHandlers } from './POS/usePaymentHandlers';
import PaymentOptions from '@/components/PaymentOptions';

const POS = () => {
  const { 
    currentUser, 
    currentShift, 
    products,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    processTransaction,
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

  const paymentStates = usePaymentStates();
  
  const processWithdrawal = (amount: number, reason: string): boolean => {
    if (!currentShift) {
      toast({
        title: "Error",
        description: "No active shift to withdraw from",
        variant: "destructive"
      });
      return false;
    }
    
    toast({
      title: "Withdrawal successful",
      description: `${amount.toFixed(2)} withdrawn from register for: ${reason}`,
    });
    return true;
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };
  
  // Create a wrapper function that matches the expected signature
  const handleProcessPayment = (amount: number, method: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: any[]) => {
    if (method === 'split' && splitPayments) {
      return processTransaction(splitPayments);
    }
    // For other payment methods, create a simple payment details array
    const paymentDetails = [{
      method,
      amount,
      customerName,
      customerPhone
    }];
    return processTransaction(paymentDetails);
  };
  
  const paymentHandlers = usePaymentHandlers({
    paymentStates,
    currentShift,
    cart,
    calculateTotal,
    processPayment: handleProcessPayment,
    processRefund,
    processWithdrawal,
    endShift
  });
  
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
  
  // Sort products by most sold (This would typically come from a sales analytics function)
  const sortedProducts = [...products].sort((a, b) => {
    // This is a placeholder - in a real app, you'd track sales per product
    // For now we'll just sort based on ID as an example
    return a.id - b.id;
  });
  
  const handleAddToCart = (product: any, quantity: number, customPrice?: number) => {
    // Use the standard addToCart method which only accepts product and quantity
    addToCart(product, quantity);
    
    // Check if stock is low after adding to cart
    if (product.stock !== undefined && product.stock <= 5) {
      // Show low stock alert
      showLowStockAlert(product.name, product.stock);
    }
  };
  
  if (paymentStates.showPaymentOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645]">
        <PaymentOptions 
          onSelectPaymentMethod={paymentHandlers.handleSelectPaymentMethod}
          onCancel={() => paymentStates.setShowPaymentOptions(false)}
        />
      </div>
    );
  }
  
  if (paymentStates.isAnyScreenActive()) {
    return (
      <div id="pos-screen-manager">
        <POSScreenManager
          cart={cart}
          currentShift={currentShift}
          calculateTotal={calculateTotal}
          processPayment={handleProcessPayment}
          processRefund={processRefund}
          processWithdrawal={processWithdrawal}
          endShift={endShift}
          getShiftPaymentBreakdown={getShiftPaymentBreakdown}
          getShiftRefundBreakdown={getShiftRefundBreakdown}
          getLowStockProducts={getLowStockProducts}
          calculateExpectedCashInDrawer={calculateExpectedCashInDrawer}
          navigateToDashboard={navigateToDashboard}
          showPaymentForm={paymentStates.showPaymentForm}
          showCardPayment={paymentStates.showCardPayment}
          showShop2ShopScreen={paymentStates.showShop2ShopScreen}
          showRefundScreen={paymentStates.showRefundScreen}
          showProfitPlusScreen={paymentStates.showProfitPlusScreen}
          showWithdrawalScreen={paymentStates.showWithdrawalScreen}
          showSplitPayment={paymentStates.showSplitPayment}
          showAccountPayment={paymentStates.showAccountPayment}
          showEndShiftForm={paymentStates.showEndShiftForm}
          customerInfo={paymentStates.customerInfo}
          onClosePaymentForm={() => paymentStates.setShowPaymentForm(false)}
          onCloseCardPayment={() => paymentStates.setShowCardPayment(false)}
          onCloseShop2ShopScreen={() => paymentStates.setShowShop2ShopScreen(false)}
          onCloseRefundScreen={() => paymentStates.setShowRefundScreen(false)}
          onCloseProfitPlusScreen={() => {
            paymentStates.setShowProfitPlusScreen(false);
          }}
          onCloseWithdrawalScreen={() => paymentStates.setShowWithdrawalScreen(false)}
          onCloseSplitPayment={() => paymentStates.setShowSplitPayment(false)}
          onCloseAccountPayment={() => paymentStates.setShowAccountPayment(false)}
          onCloseEndShiftForm={() => {
            paymentStates.setShowEndShiftForm(false);
          }}
        />
      </div>
    );
  }
  
  return (
    <POSMain
      currentUser={currentUser}
      currentShift={currentShift}
      products={sortedProducts}
      cart={cart}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      onAddToCart={handleAddToCart}
      onUpdateCartItem={updateCartQuantity}
      onRemoveFromCart={removeFromCart}
      onClearCart={clearCart}
      cartExpanded={cartExpanded}
      toggleCartExpand={toggleCartExpand}
      calculateTotal={calculateTotal}
      onEndShift={paymentHandlers.handleEndShift}
      onLogout={logout}
      onShowPaymentForm={paymentHandlers.handleShowPaymentForm}
      onShowRefundScreen={() => paymentStates.setShowRefundScreen(true)}
      onShowProfitPlusScreen={() => paymentStates.setShowProfitPlusScreen(true)}
      onShowWithdrawalScreen={() => paymentStates.setShowWithdrawalScreen(true)}
      onCashPayment={() => paymentStates.setShowPaymentForm(true)}
      onCardPayment={() => paymentStates.setShowCardPayment(true)}
      onShop2ShopPayment={() => paymentStates.setShowShop2ShopScreen(true)}
    />
  );
};

export default POS;
