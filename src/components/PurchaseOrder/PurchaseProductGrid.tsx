
import React from 'react';
import PurchaseProductCard from './PurchaseProductCard';

interface PurchaseProductGridProps {
  products: any[];
  isMobile: boolean;
  onAddToCart: (product: any, quantity: number) => void;
  cartExpanded: boolean;
}

const PurchaseProductGrid: React.FC<PurchaseProductGridProps> = ({
  products,
  isMobile,
  onAddToCart,
  cartExpanded
}) => {
  const gridCols = isMobile 
    ? (cartExpanded ? 'grid-cols-2' : 'grid-cols-3')
    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

  return (
    <div className={`grid ${gridCols} gap-3`}>
      {products.map((product) => (
        <PurchaseProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default PurchaseProductGrid;
