
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, customPrice?: number) => void;
  isMobile?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  isMobile
}) => {
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [customPrice, setCustomPrice] = useState(product.price.toString());
  
  const handleCardClick = () => {
    // Add item to cart when card is tapped
    onAddToCart(product);
  };
  
  const handlePriceButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowPriceInput(true);
    setCustomPrice(product.price.toString());
  };
  
  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newPrice = parseFloat(customPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onAddToCart({ ...product, price: newPrice }, newPrice);
    }
    setShowPriceInput(false);
  };
  
  const handlePriceCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPriceInput(false);
    setCustomPrice(product.price.toString());
  };
  
  return (
    <Card 
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={handleCardClick}
    >
      {/* Small price button in top right corner */}
      {!showPriceInput && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-2 right-2 z-10 h-6 w-12 text-xs p-1 text-white"
          onClick={handlePriceButtonClick}
        >
          Price
        </Button>
      )}

      <CardContent className={`${isMobile ? 'pt-2 px-2 pb-2' : 'pt-4'} flex-1 flex flex-col`}>
        <div className="flex-1">
          <h3 className={`font-medium ${isMobile ? 'text-xs' : 'text-base md:text-lg'} mb-1 truncate pr-16`}>
            {product.name}
          </h3>
          
          {product.stock !== undefined && (
            <p className={`${isMobile ? 'text-xs' : 'text-xs'} ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <div className="mt-1">
          <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold text-primary mb-2`}>
            {formatCurrency(product.price)}
          </p>
          
          {showPriceInput && (
            <form onSubmit={handlePriceSubmit} className="space-y-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                className="text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-1">
                <Button 
                  type="submit" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  Set
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={handlePriceCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
