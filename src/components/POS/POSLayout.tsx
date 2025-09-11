
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import POSHeader from '@/components/POS/POSHeader';
import ActionStrip from '@/components/POS/ActionStrip';
import PaymentFooter from '@/components/POS/PaymentFooter';
import RestaurantFooter from '@/components/POS/RestaurantFooter';

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
  onShowBarcodeScanner: () => void;
  onPrintReceipt?: () => void;
  onSendOrder?: () => void;
  onSimulateGlobalFound?: () => void;
  onSimulateNotFound?: () => void;
  tableInfo?: {
    selectedTable?: number;
    peopleCount?: number;
    isNewOrder?: boolean;
    isAddingToOrder?: boolean;
    existingOrders?: any[];
  } | null;
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
  onShowBarcodeScanner,
  onPrintReceipt = () => {},
  onSendOrder = () => {},
  onSimulateGlobalFound,
  onSimulateNotFound,
  tableInfo,
}) => {
  const isMobile = useIsMobile();
  const { currentMode } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16 sm:pt-20 pb-12 sm:pb-16">
      <POSHeader 
        currentUser={currentUser}
        currentShift={currentShift}
        onEndShift={onEndShift}
        onLogout={onLogout}
        options={[]}
        onSimulateGlobalFound={onSimulateGlobalFound}
        onSimulateNotFound={onSimulateNotFound}
      />
      
      {children}
      
      {/* Only show action strip in till mode */}
      {currentMode === 'till' && (
        <ActionStrip 
          onRefund={onShowRefundScreen}
          onProfitPlus={onShowProfitPlusScreen}
          onWithdrawal={onShowWithdrawalScreen}
        />
      )}
      
      {/* Show different footers based on mode */}
      {currentMode === 'restaurant' ? (
        <RestaurantFooter 
          total={total}
          cartLength={cart.length}
          onClearCart={onClearCart}
          onPrintReceipt={onPrintReceipt}
          onPayment={onShowPaymentForm}
          onSendOrder={onSendOrder}
          isMobile={isMobile}
          tableInfo={tableInfo}
        />
      ) : (
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
      )}
    </div>
  );
};

export default POSLayout;
