
import React from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItem from '@/components/CartItem';
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
  return (
    <div className={`
      ${isMobile ? '' : 'w-96 fixed top-20 right-0 bottom-0 z-10 pt-3'} 
      bg-white shadow-lg flex flex-col overflow-hidden relative
    `}>
      {isMobile ? (
        <ScrollArea className="flex-1 h-32">
          <div className="p-2">
            {cart.length === 0 ? (
              <div className="text-center py-2">
                <ShoppingCartIcon className="h-6 w-6 mx-auto text-muted-foreground opacity-50 mb-1" />
                <p className="text-muted-foreground text-sm">No items in cart</p>
              </div>
            ) : (
              <div className="space-y-1">
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
      ) : (
        <div className="flex-1 overflow-y-auto pb-32">
          {cart.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground">No items in cart</p>
              <p className="text-sm text-muted-foreground">
                Add products to begin a sale
              </p>
            </div>
          ) : (
            <div className="space-y-1">
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
      )}
    </div>
  );
};

export default CartPanel;
