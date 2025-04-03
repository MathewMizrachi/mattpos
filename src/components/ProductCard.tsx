
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  isSelected: boolean;
  onSelect: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  isMobile, 
  isSelected,
  onSelect
}) => {
  const [priceInput, setPriceInput] = useState('');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    // First, select this product card
    onSelect(product.id);
    
    // If not already selected, add to cart with default price
    if (!isSelected) {
      onAddToCart(product);
    }
    
    // Focus input field for price entry when selected
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };
  
  // Apply the custom price when moving to another product
  useEffect(() => {
    // When card becomes deselected and we have a custom price
    if (!isSelected && customPrice !== null && priceInput !== '') {
      onAddToCart(product, customPrice);
      // Reset after adding with custom price
      setPriceInput('');
      setCustomPrice(null);
    }
  }, [isSelected, customPrice, priceInput, product, onAddToCart]);
  
  // Auto-focus input when selected
  useEffect(() => {
    if (isSelected && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected]);
  
  // Reset price input when card is deselected
  useEffect(() => {
    if (!isSelected) {
      setPriceInput('');
      setCustomPrice(null);
    }
  }, [isSelected]);
  
  useEffect(() => {
    if (!isSelected) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Cancel price input mode
        onSelect(-1); // Deselect
        setPriceInput('');
        setCustomPrice(null);
      } else if (e.key === 'Enter') {
        // Confirm price and add to cart
        if (priceInput) {
          const newPrice = parseFloat(priceInput);
          if (!isNaN(newPrice) && newPrice > 0) {
            setCustomPrice(newPrice);
            onAddToCart(product, newPrice);
            // Reset after adding with custom price
            setPriceInput('');
            setCustomPrice(null);
            onSelect(-1); // Deselect after adding
          }
        } else {
          // If no price was entered, just add with original price
          onAddToCart(product);
          onSelect(-1); // Deselect after adding
        }
      }
    };
    
    // Add global event listener when we're in price input mode
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, priceInput, product, onAddToCart, onSelect]);
  
  // Handle price input changes
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and one decimal point
    if (/^-?\d*\.?\d*$/.test(value)) {
      setPriceInput(value);
      
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        setCustomPrice(parsedValue);
      } else {
        setCustomPrice(null);
      }
    }
  };
  
  // Determine which price to display
  const displayPrice = isSelected && priceInput 
    ? priceInput 
    : customPrice !== null 
      ? customPrice 
      : product.price;
  
  return (
    <Card 
      className={`h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={handleClick}
    >
      <CardContent className={`${isMobile ? 'pt-2 px-2 pb-2' : 'pt-4'} flex-1 flex flex-col`}>
        <div className="flex-1">
          <h3 className={`font-medium ${isMobile ? 'text-xs' : 'text-base md:text-lg'} mb-1 truncate`}>{product.name}</h3>
          
          {product.stock !== undefined && (
            <p className={`${isMobile ? 'text-xs' : 'text-xs'} ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <div className="mt-1 relative">
          {isSelected ? (
            <input
              ref={inputRef}
              type="text"
              value={priceInput}
              onChange={handlePriceChange}
              className="w-full p-1 text-blue-500 font-bold text-lg bg-transparent border-b border-blue-500 focus:outline-none"
              placeholder={formatCurrency(Number(product.price)).replace('R', '')}
              autoFocus
            />
          ) : (
            <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold ${isSelected ? 'text-blue-500' : 'text-primary'}`}>
              {formatCurrency(Number(displayPrice))}
            </p>
          )}
          {isSelected && 
            <p className="text-xs text-muted-foreground">Enter price and press Enter</p>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
