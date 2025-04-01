
import React from 'react';
import { ShoppingCartIcon, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItem from '@/components/CartItem';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';

interface CartPanelProps {
  cart: CartItemType[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  isMobile: boolean;
}

const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  onUpdateQuantity,
  onRemove,
  isMobile
}) => {
  if (isMobile) {
    // For mobile displays, show cart panel fixed on the right side
    return (
      <div className="fixed top-20 bottom-0 right-0 w-2/3 z-10 bg-white shadow-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Shopping Cart</h2>
          <span className="text-sm text-muted-foreground">{cart.length} items</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            {cart.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                <p className="text-muted-foreground">No items in cart</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <CartItem 
                    key={item.product.id}
                    product={item.product}
                    quantity={item.quantity}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-96 fixed top-20 right-0 bottom-0 z-10 bg-white shadow-lg flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-0">
        {cart.length === 0 ? (
          <div className="text-center py-6">
            <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No items in cart</p>
            <p className="text-sm text-muted-foreground">
              Add products to begin a sale
            </p>
          </div>
        ) : (
          <div className="space-y-1 px-2 pt-0">
            {cart.map(item => (
              <CartItem 
                key={item.product.id}
                product={item.product}
                quantity={item.quantity}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPanel;
