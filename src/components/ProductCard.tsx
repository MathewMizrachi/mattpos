
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editablePrice, setEditablePrice] = useState(product.price.toString());
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const priceRef = useRef<HTMLDivElement>(null);
  
  const handleCardClick = () => {
    if (!isEditingPrice) {
      onAddToCart(product, currentPrice);
    }
  };
  
  const handlePriceButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingPrice(true);
    setEditablePrice(currentPrice.toString());
    
    // Focus the price element
    setTimeout(() => {
      if (priceRef.current) {
        priceRef.current.focus();
      }
    }, 0);
  };
  
  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const newPrice = parseFloat(editablePrice);
      if (!isNaN(newPrice) && newPrice > 0) {
        setCurrentPrice(newPrice);
        onAddToCart({ ...product, price: newPrice }, newPrice);
      }
      setIsEditingPrice(false);
    } else if (e.key === 'Escape') {
      setIsEditingPrice(false);
      setEditablePrice(currentPrice.toString());
    }
  };
  
  const handlePriceChange = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.textContent || '';
    setEditablePrice(value);
  };
  
  const handlePriceBlur = () => {
    const newPrice = parseFloat(editablePrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      setCurrentPrice(newPrice);
      onAddToCart({ ...product, price: newPrice }, newPrice);
    }
    setIsEditingPrice(false);
  };
  
  useEffect(() => {
    if (isEditingPrice && priceRef.current) {
      // Select all text when entering edit mode
      const range = document.createRange();
      range.selectNodeContents(priceRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditingPrice]);
  
  return (
    <Card 
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={handleCardClick}
    >
      {/* Small price button in top right corner */}
      {!isEditingPrice && (
        <Button 
          variant="outline" 
          size="sm" 
          className="absolute top-2 right-2 z-10 h-6 w-12 text-xs p-1 bg-[#0A2645] text-[#FAA225] border-[#0A2645] hover:bg-[#0A2645]/90 font-bold uppercase"
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
          <div 
            ref={priceRef}
            className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold mb-2 ${
              isEditingPrice ? 'text-[#FAA225] outline-none' : 'text-primary'
            } ${isEditingPrice ? 'cursor-text' : 'cursor-pointer'}`}
            contentEditable={isEditingPrice}
            suppressContentEditableWarning={true}
            onKeyDown={handlePriceKeyDown}
            onInput={handlePriceChange}
            onBlur={handlePriceBlur}
            onClick={(e) => isEditingPrice && e.stopPropagation()}
          >
            {isEditingPrice ? editablePrice : formatCurrency(currentPrice)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
