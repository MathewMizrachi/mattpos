
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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isMobile }) => {
  const [isListeningForPrice, setIsListeningForPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  
  const handleClick = () => {
    if (isListeningForPrice) {
      // If we're already listening for price input, add the product with the custom price
      const productToAdd = {
        ...product,
        price: customPrice !== null ? customPrice : product.price
      };
      onAddToCart(productToAdd, customPrice !== null ? customPrice : undefined);
    } else {
      // Start listening for price input
      setIsListeningForPrice(true);
      setPriceInput('');
    }
  };
  
  useEffect(() => {
    if (!isListeningForPrice) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Cancel price input mode
        setIsListeningForPrice(false);
        setPriceInput('');
        setCustomPrice(null);
      } else if (e.key === 'Enter') {
        // Confirm price and add to cart
        if (priceInput) {
          const newPrice = parseFloat(priceInput);
          if (!isNaN(newPrice) && newPrice > 0) {
            const productToAdd = { ...product, price: newPrice };
            setCustomPrice(newPrice);
            onAddToCart(productToAdd, newPrice);
            setIsListeningForPrice(false);
          }
        } else {
          // If no price was entered, just add with original price
          onAddToCart(product);
          setIsListeningForPrice(false);
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
  }, [isListeningForPrice, priceInput, product, onAddToCart]);
  
  // Determine which price to display
  const displayPrice = isListeningForPrice && priceInput 
    ? priceInput 
    : customPrice !== null 
      ? customPrice 
      : product.price;
  
  return (
    <Card 
      className={`h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow ${isListeningForPrice ? 'ring-2 ring-primary' : ''}`}
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
          <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold ${isListeningForPrice ? 'text-blue-500' : 'text-primary'}`}>
            {isListeningForPrice && priceInput 
              ? `R ${priceInput}` 
              : formatCurrency(Number(displayPrice))}
          </p>
          {isListeningForPrice && 
            <p className="text-xs text-muted-foreground">Enter price and press Enter</p>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
