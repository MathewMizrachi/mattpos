import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Product } from '@/types';
import POSHeader from '@/components/POS/POSHeader';
import ProductSearch from '@/components/POS/ProductSearch';
import ProductGrid from '@/components/POS/ProductGrid';
import CartPanel from '@/components/POS/CartPanel';
import PaymentFooter from '@/components/POS/PaymentFooter';
import ActionStrip from '@/components/POS/ActionStrip';

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
  onShowPaymentOptions: () => void;
  onShowRefundScreen: () => void;
  onShowProfitPlusScreen: () => void;
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
  onShowPaymentOptions,
  onShowRefundScreen,
  onShowProfitPlusScreen,
}) => {
  const isMobile = useIsMobile();
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-32">
      <POSHeader 
        currentUser={currentUser}
        currentShift={currentShift}
        onEndShift={onEndShift}
        onLogout={onLogout}
        options={[]}
      />
      
      <div className="fixed top-20 left-0 right-0 p-3 z-10 bg-gray-50">
        <ProductSearch 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
      
      <div className="flex-1 overflow-hidden relative mt-16">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 pb-36">
            <ProductGrid 
              products={filteredProducts}
              isMobile={isMobile}
              onAddToCart={onAddToCart}
              cartExpanded={cartExpanded}
            />
          </div>
        </div>
        
        <CartPanel 
          cart={cart}
          onUpdateQuantity={onUpdateCartItem}
          onRemove={onRemoveFromCart}
          isMobile={isMobile}
          cartExpanded={cartExpanded}
          toggleCartExpand={toggleCartExpand}
        />
      </div>
      
      <ActionStrip 
        onRefund={onShowRefundScreen}
        onProfitPlus={onShowProfitPlusScreen}
      />
      
      <PaymentFooter 
        total={calculateTotal()}
        cartLength={cart.length}
        onClearCart={onClearCart}
        onShowPaymentForm={onShowPaymentOptions}
        isMobile={isMobile}
      />
    </div>
  );
};

export default POSMain;
