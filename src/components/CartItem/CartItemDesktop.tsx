
import React, { useState } from 'react';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { CartItemProps } from './types';

const CartItemDesktop: React.FC<CartItemProps> = ({ 
  product, 
  quantity, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());
  
  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    } else {
      onRemove(product.id);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setInputValue(value);
    }
  };
  
  const handleInputBlur = () => {
    let newQuantity = parseInt(inputValue, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }
    onUpdateQuantity(product.id, newQuantity);
    setInputValue(newQuantity.toString());
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setInputValue(quantity.toString());
      setIsEditing(false);
    }
  };
  
  const subtotal = product.price * quantity;
  
  return (
    <div className="flex items-center py-2 border-b pl-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)} each</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8"
          style={{ backgroundColor: '#FAA225', color: 'black' }}
          onClick={handleDecrease}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        
        {isEditing ? (
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-12 h-8 text-center px-1"
            style={{ backgroundColor: '#FAA225', color: '#0A2645' }}
            autoFocus
          />
        ) : (
          <span 
            className="w-8 text-center cursor-pointer" 
            onClick={() => setIsEditing(true)}
          >
            {quantity}
          </span>
        )}
        
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8"
          style={{ backgroundColor: '#FAA225', color: 'black' }}
          onClick={handleIncrease}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="w-24 text-right">
        <p className="font-medium">{formatCurrency(subtotal)}</p>
      </div>
      
      <Button 
        variant="ghost"
        size="icon"
        className="ml-2 h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(product.id);
        }}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItemDesktop;
