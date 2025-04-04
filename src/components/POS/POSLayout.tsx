
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
  onShowWithdrawalScreen,
  onCashPayment,
  onCardPayment,
  onShop2ShopPayment,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-16">
      <POSHeader 
        currentUser={currentUser}
        currentShift={currentShift}
        onEndShift={onEndShift}
        onLogout={onLogout}
        options={[]}
      />
      
      {children}
      
      <ActionStrip 
        onRefund={onShowRefundScreen}
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
