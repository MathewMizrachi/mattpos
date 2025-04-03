
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
        onProfitPlus={onShowProfitPlusScreen}
      />
      
      <PaymentFooter 
        total={total}
        cartLength={cart.length}
        onClearCart={onClearCart}
        onShowPaymentForm={onShowPaymentForm}
        isMobile={isMobile}
      />
    </div>
  );
};

export default POSLayout;
