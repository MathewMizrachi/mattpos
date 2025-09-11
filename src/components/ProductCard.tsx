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
  
  // Split product name into first word and rest
  const words = product.name.split(' ');
  const firstWord = words[0];
  const restOfName = words.slice(1).join(' ');
  
  return (
    <Card 
      className={`h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow relative ${
        isMobile ? 'min-h-[100px]' : 'min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]'
      }`}
      onClick={handleCardClick}
    >
      {/* Responsive price button */}
      {!isEditingPrice && (
        <Button 
          variant="outline" 
          size="sm" 
          className={`absolute top-1 right-1 sm:top-2 sm:right-2 z-10 ${
            isMobile ? 'h-5 w-10 text-[10px]' : 'h-6 w-12 text-xs'
          } p-1 bg-primary text-secondary border-primary hover:bg-primary/90 font-bold uppercase`}
          onClick={handlePriceButtonClick}
        >
          {isMobile ? 'PRIC' : 'PRICE'}
        </Button>
      )}

      <CardContent className={`${isMobile ? 'p-1.5' : 'p-2 sm:p-3 lg:p-4'} flex-1 flex flex-col`}>
        <div className="flex-1">
          <div className={`mb-1 ${isMobile ? 'pr-12' : 'pr-14 sm:pr-16'}`}>
            <h3 className={`font-bold ${
              isMobile 
                ? 'text-xs leading-tight' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl leading-tight'
            }`}>
              {firstWord}
            </h3>
            {restOfName && (
              <p className={`font-medium ${
                isMobile 
                  ? 'text-[10px] leading-tight' 
                  : 'text-xs sm:text-sm md:text-base leading-tight'
              } text-muted-foreground`}>
                {restOfName}
              </p>
            )}
          </div>
          
          {product.stock !== undefined && (
            <p className={`${
              isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'
            } ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <div className={isMobile ? 'mt-0.5' : 'mt-1'}>
          <div 
            ref={priceRef}
            className={`${
              isMobile 
                ? 'text-xs' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl'
            } font-bold ${
              isEditingPrice ? 'text-secondary outline-none' : 'text-primary'
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
