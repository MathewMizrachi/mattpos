
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import POSHeader from '@/components/POS/POSHeader';
import ActionStrip from '@/components/POS/ActionStrip';
import PaymentFooter from '@/components/POS/PaymentFooter';

interface POSLayoutProps {
  children: React.ReactNode;
  currentUser: any;
  currentShift: any;
  onEndShift: () => void;
  onLogout: () => void;
  cart: any[];
  total: number;
  onClearCart: () => void;
  onShowPaymentForm: () => void;
  onShowRefundScreen: () => void;
  onShowProfitPlusScreen: () => void;
  onShowWithdrawalScreen: () => void;
  onCashPayment: () => void;
  onCardPayment: () => void;
  onShop2ShopPayment: () => void;
}

const POSLayout: React.FC<POSLayoutProps> = ({
  children,
  currentUser,
  currentShift,
  onEndShift,
  onLogout,
  cart,
  total,
  onClearCart,
  onShowPaymentForm,
  onShowRefundScreen,
  onShowProfitPlusScreen,
  onShowWithdrawalScreen,
  onCashPayment,
  onCardPayment,
  onShop2ShopPayment,
}) => {
  const isMobile = useIsMobile();
  
  const handleEndShift = () => {
    const screenManager = document.getElementById('pos-screen-manager');
    if (screenManager) {
      const endShiftEvent = new CustomEvent('endshift');
      screenManager.dispatchEvent(endShiftEvent);
    } else {
      onEndShift();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-16">
      <POSHeader 
        currentUser={currentUser}
        currentShift={currentShift}
        onEndShift={handleEndShift}
        onLogout={onLogout}
        options={[]}
      />
      
      {children}
      
      <ActionStrip 
        onRefund={onShowRefundScreen}
        onProfitPlus={onShowProfitPlusScreen}
        onWithdrawal={onShowWithdrawalScreen}
      />
      
      <PaymentFooter 
        total={total}
        cartLength={cart.length}
        onClearCart={onClearCart}
        onShowPaymentForm={onShowPaymentForm}
        onCashPayment={onCashPayment}
        onCardPayment={onCardPayment}
        onShop2ShopPayment={onShop2ShopPayment}
        isMobile={isMobile}
      />
    </div>
  );
};

export default POSLayout;
