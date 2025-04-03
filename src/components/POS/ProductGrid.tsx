
import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');
  const [lastCustomizedProducts, setLastCustomizedProducts] = useState<Map<number, number>>(new Map());

  const handleProductClick = (product: Product) => {
    const existingCustomPrice = lastCustomizedProducts.get(product.id);
    
    if (selectedProduct && selectedProduct.id === product.id) {
      // Add another unit with the custom price if already selected
      onAddToCart(product, 1, parseFloat(customPrice) || existingCustomPrice);
    } else {
      // Select this product and prepare for price customization
      setSelectedProduct(product);
      setCustomPrice(existingCustomPrice ? existingCustomPrice.toString() : product.price.toString());
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomPrice(value);
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, product: Product) => {
    if (e.key === 'Enter') {
      const priceValue = parseFloat(customPrice);
      if (!isNaN(priceValue)) {
        // Save this custom price for future clicks
        setLastCustomizedProducts(new Map(lastCustomizedProducts.set(product.id, priceValue)));
        // Add to cart with custom price
        onAddToCart(product, 1, priceValue);
        // Reset the selected state
        setSelectedProduct(null);
      }
    } else if (e.key === 'Escape') {
      setSelectedProduct(null);
    }
  };

  // Clear price input when clicking outside
  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedProduct && !(e.target as HTMLElement).closest('.product-card')) {
      setSelectedProduct(null);
    }
  };

  return (
    <div 
      className={`grid ${isMobile ? 
        (cartExpanded ? 'grid-cols-1 w-full px-0' : 'grid-cols-2 w-full px-0') : 
        'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 pr-96'} gap-3 pt-4`}
      onClick={handleGridClick}
    >
      {products.map(product => (
        <div key={product.id} className="product-card relative">
          <ProductCard 
            product={{
              ...product,
              price: lastCustomizedProducts.get(product.id) || product.price
            }}
            onAddToCart={() => handleProductClick(product)}
            isMobile={isMobile}
          />
          
          {selectedProduct && selectedProduct.id === product.id && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <div className="w-full p-2">
                <div className="text-center mb-2">
                  <span className="text-sm font-medium">Set Price:</span>
                </div>
                <Input
                  type="text"
                  value={customPrice}
                  onChange={handlePriceChange}
                  onKeyDown={(e) => handlePriceKeyDown(e, product)}
                  className="text-center"
                  autoFocus
                />
                <div className="text-center mt-2">
                  <span className="text-xs text-muted-foreground">Press Enter to confirm</span>
                </div>
              </div>
            </div>
          )}
        </div>
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
