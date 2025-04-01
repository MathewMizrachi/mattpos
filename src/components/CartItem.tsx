
import React from 'react';
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  product, 
  quantity, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const handleIncrease = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    } else {
      onRemove(product.id);
    }
  };
  
  const subtotal = product.price * quantity;
  
  return (
    <div className="flex items-center py-2 border-b">
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-muted-foreground">{formatCurrency(product.price)} each</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrease}
        >
          <MinusIcon className="h-4 w-4" />
        </Button>
        
        <span className="w-8 text-center">{quantity}</span>
        
        <Button 
          variant="outline"
          size="icon"
          className="h-8 w-8"
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
        onClick={() => onRemove(product.id)}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
