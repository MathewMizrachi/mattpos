
import React, { useEffect, useState } from 'react';
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
  
  const handleClick = () => {
    // First, select this product card
    onSelect(product.id);
    
    // If not already selected, just select it (don't add to cart yet)
    if (!isSelected) {
      return;
    } else {
      // If already selected and we have a custom price, add with custom price
      if (customPrice !== null) {
        onAddToCart(product, customPrice);
      } else {
        // Otherwise add with original price
        onAddToCart(product);
      }
    }
  };
  
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
            onAddToCart({...product, price: newPrice}, newPrice);
            onSelect(-1); // Deselect after adding to cart with custom price
          }
        } else {
          // If no price was entered, just add with original price
          onAddToCart(product);
          onSelect(-1); // Deselect after adding to cart
        }
      } else if (/^\d$/.test(e.key) || e.key === '.' || e.key === ',') {
        // Only allow numbers and decimal point for price input
        const nextChar = e.key === ',' ? '.' : e.key;
        // Prevent multiple decimal points
        if (nextChar === '.' && priceInput.includes('.')) return;
        
        // Update the price input
        setPriceInput(prev => {
          const newInput = prev + nextChar;
          const parsedPrice = parseFloat(newInput);
          if (!isNaN(parsedPrice)) {
            setCustomPrice(parsedPrice);
          }
          return newInput;
        });
      } else if (e.key === 'Backspace') {
        // Handle backspace for price input
        setPriceInput(prev => {
          const newInput = prev.slice(0, -1);
          if (newInput) {
            const parsedPrice = parseFloat(newInput);
            if (!isNaN(parsedPrice)) {
              setCustomPrice(parsedPrice);
            }
          } else {
            setCustomPrice(null);
          }
          return newInput;
        });
      }
    };
    
    // Add global event listener when we're in price input mode
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, priceInput, product, onAddToCart, onSelect]);
  
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
        
        <div className="mt-1">
          <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold ${isSelected ? 'text-blue-500' : 'text-primary'}`}>
            {isSelected && priceInput 
              ? `R ${priceInput}` 
              : formatCurrency(Number(displayPrice))}
          </p>
          {isSelected && 
            <p className="text-xs text-muted-foreground">Enter price and press Enter</p>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
