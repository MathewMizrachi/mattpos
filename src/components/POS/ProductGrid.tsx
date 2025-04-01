
import React from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  isMobile: boolean;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isMobile,
  onAddToCart
}) => {
  return (
    <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-3`}>
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={onAddToCart}
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
