
import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import POSLayout from '@/components/POS/POSLayout';
import POSContent from '@/components/POS/POSContent';
import BarcodeScanner from '@/components/POS/BarcodeScanner';

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
  onPrintReceipt?: () => void;
  onSendOrder?: (tableNumber: number, peopleCount: number) => void;
  tableInfo?: {
    selectedTable?: number;
    peopleCount?: number;
    isNewOrder?: boolean;
    isAddingToOrder?: boolean;
    existingOrders?: any[];
  } | null;
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
  onPrintReceipt,
  onSendOrder,
  tableInfo,
}) => {
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const handleBarcodeProductFound = (product: Product) => {
    onAddToCart(product, 1);
    setShowBarcodeScanner(false);
  };

  const handleAddNewProduct = (product: Omit<Product, 'id'>) => {
    // In a real app, this would call an API to add the product
    console.log('Adding new product:', product);
    setShowBarcodeScanner(false);
  };

  // Enhanced send order handler to use table info
  const handleSendOrder = () => {
    if (tableInfo?.selectedTable && tableInfo?.peopleCount !== undefined) {
      onSendOrder?.(tableInfo.selectedTable, tableInfo.peopleCount);
    } else {
      // Fallback to default values
      onSendOrder?.(1, 1);
    }
  };

  return (
    <>
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
        onShowBarcodeScanner={() => setShowBarcodeScanner(true)}
        onPrintReceipt={onPrintReceipt}
        onSendOrder={handleSendOrder}
        tableInfo={tableInfo}
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
          onShowBarcodeScanner={() => setShowBarcodeScanner(true)}
          tableInfo={tableInfo}
        />
      </POSLayout>

      {showBarcodeScanner && (
        <BarcodeScanner
          products={products}
          onProductFound={handleBarcodeProductFound}
          onAddNewProduct={handleAddNewProduct}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}
    </>
  );
};

export default POSMain;
