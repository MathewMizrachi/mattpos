
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
  const [lastTapTime, setLastTapTime] = useState(0);
  
  const handleClick = () => {
    const now = new Date().getTime();
    
    // If product is already selected, just add to cart with current price
    if (isSelected) {
      if (customPrice !== null) {
        onAddToCart(product, customPrice);
      } else {
        onAddToCart(product);
      }
      return;
    }
    
    // First tap selects the product
    onSelect(product.id);
    
    // On mobile, if it's a quick double tap (within 300ms), add to cart immediately
    if (isMobile && (now - lastTapTime < 300)) {
      onAddToCart(product);
    }
    
    setLastTapTime(now);
    
    // On mobile, focus invisible input to bring up keyboard for price entry
    if (isMobile && isSelected) {
      const priceInputEl = document.getElementById(`price-input-${product.id}`);
      if (priceInputEl) {
        priceInputEl.focus();
      }
    }
  };
  
  // Reset price input when card is deselected
  useEffect(() => {
    if (!isSelected) {
      setPriceInput('');
      setCustomPrice(null);
    } else if (isMobile) {
      // When selected on mobile, focus the input to show keyboard
      setTimeout(() => {
        const priceInputEl = document.getElementById(`price-input-${product.id}`);
        if (priceInputEl) {
          priceInputEl.focus();
        }
      }, 100);
    }
  }, [isSelected, product.id, isMobile]);
  
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

  // Handle mobile input change
  const handleMobileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceInput(value);
    
    if (value) {
      const parsedPrice = parseFloat(value);
      if (!isNaN(parsedPrice)) {
        setCustomPrice(parsedPrice);
      }
    } else {
      setCustomPrice(null);
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
        
        <div className="mt-1">
          <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold ${isSelected ? 'text-blue-500' : 'text-primary'}`}>
            {isSelected && priceInput 
              ? `R ${priceInput}` 
              : formatCurrency(Number(displayPrice))}
          </p>
          
          {isSelected && (
            <>
              {isMobile ? (
                <input
                  id={`price-input-${product.id}`}
                  type="number"
                  inputMode="decimal"
                  value={priceInput}
                  onChange={handleMobileInputChange}
                  className="opacity-0 absolute h-1 w-1"
                  autoFocus
                />
              ) : (
                <p className="text-xs text-muted-foreground">Enter price and press Enter</p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
