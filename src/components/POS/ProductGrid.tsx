
import React from 'react';
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
  const handleProductClick = (product: Product, customPrice?: number) => {
    // Pass the custom price if provided, otherwise use the product's default price
    onAddToCart(product, 1, customPrice);
  };

  return (
    <div className={`grid ${isMobile ? 
      (cartExpanded ? 'grid-cols-1 gap-2 px-2' : 'grid-cols-2 gap-2 px-2') : 
      'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 pr-96'} gap-2 sm:gap-3 pt-2 sm:pt-4`}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={(product, customPrice) => handleProductClick(product, customPrice)}
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
