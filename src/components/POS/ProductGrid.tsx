
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
  const handleProductClick = (product: Product) => {
    onAddToCart(product, 1);
  };

  return (
    <div className={`grid ${isMobile ? 
      (cartExpanded ? 'grid-cols-1 w-full px-0' : 'grid-cols-2 w-full px-0') : 
      'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 pr-96'} gap-3 pt-4`}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={() => handleProductClick(product)}
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
