
import React from 'react';
import { Product } from '@/types';
import POSLayout from '@/components/POS/POSLayout';
import POSContent from '@/components/POS/POSContent';

interface POSMainProps {
  currentUser: any;
  currentShift: any;
  products: Product[];
  cart: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddToCart: (product: Product, quantity: number, customPrice?: number) => void;
  onUpdateCartItem: (productId: number, quantity: number, price?: number) => void;
  onRemoveFromCart: (productId: number, price?: number) => void;
  onClearCart: () => void;
  cartExpanded: boolean;
  toggleCartExpand: () => void;
  calculateTotal: () => number;
  onEndShift: () => void;
  onLogout: () => void;
  onShowPaymentForm: () => void;
  onShowRefundScreen: () => void;
  onShowProfitPlusScreen: () => void;
  onShowWithdrawalScreen: () => void;
  onCashPayment: () => void;
  onCardPayment: () => void;
  onShop2ShopPayment: () => void;
}

const POSMain: React.FC<POSMainProps> = ({
  currentUser,
  currentShift,
  products,
  cart,
  searchTerm,
  onSearchChange,
  onAddToCart,
  onUpdateCartItem,
  onRemoveFromCart,
  onClearCart,
  cartExpanded,
  toggleCartExpand,
  calculateTotal,
  onEndShift,
  onLogout,
  onShowPaymentForm,
  onShowRefundScreen,
  onShowProfitPlusScreen,
  onShowWithdrawalScreen,
  onCashPayment,
  onCardPayment,
  onShop2ShopPayment,
}) => {
  return (
    <POSLayout
      currentUser={currentUser}
      currentShift={currentShift}
      onEndShift={onEndShift}
      onLogout={onLogout}
      cart={cart}
      total={calculateTotal()}
      onClearCart={onClearCart}
      onShowPaymentForm={onShowPaymentForm}
      onShowRefundScreen={onShowRefundScreen}
      onShowProfitPlusScreen={onShowProfitPlusScreen}
      onShowWithdrawalScreen={onShowWithdrawalScreen}
      onCashPayment={onCashPayment}
      onCardPayment={onCardPayment}
      onShop2ShopPayment={onShop2ShopPayment}
    >
      <POSContent
        products={products}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        cart={cart}
        onAddToCart={onAddToCart}
        onUpdateCartItem={onUpdateCartItem}
        onRemoveFromCart={onRemoveFromCart}
        cartExpanded={cartExpanded}
        toggleCartExpand={toggleCartExpand}
      />
    </POSLayout>
  );
};

export default POSMain;
