
import React, { useState } from 'react';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { CartItemProps } from './types';

const CartItemMobile: React.FC<CartItemProps> = ({ 
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
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(product.id);
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
    <div className="py-1 border-b pl-1" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between mb-1">
        <p className="font-medium text-sm truncate max-w-[200px]">{product.name}</p>
        <p className="font-medium text-sm">{formatCurrency(subtotal)}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button 
            variant="outline"
            size="icon"
            className="h-7 w-7"
            style={{ backgroundColor: '#FAA225', color: 'black' }}
            onClick={handleDecrease}
          >
            <MinusIcon className="h-3 w-3" />
          </Button>
          
          {isEditing ? (
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              className="w-10 h-7 text-center px-1 text-sm"
              style={{ backgroundColor: '#FAA225', color: '#0A2645' }}
              autoFocus
            />
          ) : (
            <span 
              className="w-7 text-center text-sm cursor-pointer" 
              onClick={() => setIsEditing(true)}
            >
              {quantity}
            </span>
          )}
          
          <Button 
            variant="outline"
            size="icon"
            className="h-7 w-7"
            style={{ backgroundColor: '#FAA225', color: 'black' }}
            onClick={handleIncrease}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
        
        <Button 
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleRemove}
        >
          <XIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemMobile;
