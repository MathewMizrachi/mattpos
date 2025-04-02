
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import ProductEditModal from '@/components/ProductEditModal';

interface ProductGridProps {
  products: Product[];
  isMobile: boolean;
  onAddToCart: (product: Product, quantity: number, customPrice?: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isMobile,
  onAddToCart
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmAdd = (quantity: number, customPrice?: number) => {
    if (selectedProduct) {
      onAddToCart(selectedProduct, quantity, customPrice);
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 w-full px-0' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 pr-96'} gap-3 pt-4`}>
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

      {selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAdd}
        />
      )}
    </div>
  );
};

export default ProductGrid;
