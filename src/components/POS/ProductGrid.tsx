
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isMobile: boolean;
  onAddToCart: (product: Product, quantity: number, customPrice?: number) => void;
  cartExpanded: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isMobile,
  onAddToCart,
  cartExpanded
}) => {
  const [selectedProductId, setSelectedProductId] = useState<number>(-1);

  const handleProductClick = (product: Product, customPrice?: number) => {
    // Pass the custom price if provided, otherwise use the product's default price
    onAddToCart(product, 1, customPrice);
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
  };

  return (
    <div className={`grid ${isMobile ? 
      (cartExpanded ? 'grid-cols-1 w-full px-0' : 'grid-cols-2 w-full px-0') : 
      'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 pr-96'} gap-3 pt-4`}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={(product, customPrice) => handleProductClick(product, customPrice)}
          isSelected={selectedProductId === product.id}
          onSelect={handleProductSelect}
          isMobile={isMobile}
        />
      ))}
      
      {products.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
