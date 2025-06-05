
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import ProductSearch from '@/components/POS/ProductSearch';
import ProductGrid from '@/components/POS/ProductGrid';
import CartPanel from '@/components/POS/CartPanel';
import MenuCategorySelector from '@/components/POS/MenuCategorySelector';

interface POSContentProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cart: any[];
  onAddToCart: (product: Product, quantity: number, customPrice?: number) => void;
  onUpdateCartItem: (productId: number, quantity: number, price?: number) => void;
  onRemoveFromCart: (productId: number, price?: number) => void;
  cartExpanded: boolean;
  toggleCartExpand: () => void;
  tableInfo?: {
    selectedTable?: number;
    peopleCount?: number;
    isNewOrder?: boolean;
    isAddingToOrder?: boolean;
    existingOrders?: any[];
  } | null;
}

const POSContent: React.FC<POSContentProps> = ({
  products,
  searchTerm,
  onSearchChange,
  cart,
  onAddToCart,
  onUpdateCartItem,
  onRemoveFromCart,
  cartExpanded,
  toggleCartExpand,
  tableInfo,
}) => {
  const isMobile = useIsMobile();
  const { currentMode } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const getCategoryForProduct = (product: Product) => {
    const productName = product.name.toLowerCase();
    
    // Soft drinks
    if (productName.includes('coca cola') || productName.includes('sprite') || 
        productName.includes('fanta') || productName.includes('coke')) {
      return 'soft-drinks';
    }
    
    // Sides
    if (productName.includes('french fries') || productName.includes('fries')) {
      return 'sides';
    }
    
    // Food (everything else)
    return 'food';
  };
  
  const filterProductsByCategory = (products: Product[]) => {
    if (selectedCategory === 'all') {
      return products;
    }
    
    return products.filter(product => getCategoryForProduct(product) === selectedCategory);
  };
  
  const filteredBySearch = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredProducts = filterProductsByCategory(filteredBySearch);
  
  return (
    <>
      <div className="fixed top-20 left-0 right-0 p-3 z-10 bg-gray-50">
        <ProductSearch 
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        
        {/* Only show category selector in restaurant mode */}
        {currentMode === 'restaurant' && (
          <MenuCategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        )}
      </div>
      
      <div className="flex-1 overflow-hidden relative" style={{ marginTop: currentMode === 'restaurant' ? '140px' : '80px' }}>
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
    </>
  );
};

export default POSContent;
