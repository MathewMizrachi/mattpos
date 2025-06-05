
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductSearch from '@/components/POS/ProductSearch';
import PurchaseProductGrid from '@/components/PurchaseOrder/PurchaseProductGrid';
import PurchaseCartPanel from '@/components/PurchaseOrder/PurchaseCartPanel';

interface PurchaseOrderContentProps {
  products: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cart: any[];
  onAddToCart: (product: any, quantity: number) => void;
  onUpdateCartItem: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
}

const PurchaseOrderContent: React.FC<PurchaseOrderContentProps> = ({
  products,
  searchTerm,
  onSearchChange,
  cart,
  onAddToCart,
  onUpdateCartItem,
  onRemoveFromCart,
}) => {
  const isMobile = useIsMobile();
  const [cartExpanded, setCartExpanded] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCartExpand = () => {
    setCartExpanded(!cartExpanded);
  };

  return (
    <>
      <div className="fixed top-20 left-0 right-0 p-3 z-10 bg-gray-50">
        <ProductSearch 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      </div>
      
      <div className="flex-1 overflow-hidden relative" style={{ marginTop: '80px' }}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 pb-36">
            <PurchaseProductGrid 
              products={filteredProducts}
              isMobile={isMobile}
              onAddToCart={onAddToCart}
              cartExpanded={cartExpanded}
            />
          </div>
        </div>
        
        <PurchaseCartPanel 
          cart={cart}
          onUpdateQuantity={onUpdateCartItem}
          onRemove={onRemoveFromCart}
          isMobile={isMobile}
          cartExpanded={cartExpanded}
          toggleCartExpand={toggleCartExpand}
        />
      </div>
    </>
  );
};

export default PurchaseOrderContent;
