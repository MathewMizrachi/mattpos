
import React from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CartItem from '@/components/CartItem';
import { CartItem as CartItemType } from '@/types';

interface CartPanelProps {
  cart: CartItemType[];
  onUpdateQuantity: (productId: number, quantity: number, price?: number) => void;
  onRemove: (productId: number, price?: number) => void;
  isMobile: boolean;
  cartExpanded: boolean;
  toggleCartExpand: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  onUpdateQuantity,
  onRemove,
  isMobile,
  cartExpanded,
  toggleCartExpand
}) => {
  // Handle clicks on the panel itself but prevent propagation from buttons
  const handlePanelClick = (e: React.MouseEvent) => {
    // Only toggle if clicking the panel background, not buttons or inputs
    if (e.target === e.currentTarget || 
        (e.target as HTMLElement).classList.contains('cart-panel-background')) {
      toggleCartExpand();
    }
  };

  if (isMobile) {
    return (
      <div 
        className={`fixed top-20 bottom-0 right-0 ${cartExpanded ? 'w-3/5' : 'w-1/7'} z-10 bg-white shadow-lg flex flex-col overflow-hidden transition-all duration-300 cart-panel-background`}
        onClick={handlePanelClick}
      >
        <ScrollArea className="flex-1 cart-panel-background">
          <div className="p-2 cart-panel-background">
            {cart.length === 0 ? (
              <div className="text-center py-6 cart-panel-background">
                <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                <p className={`${cartExpanded ? 'block' : 'hidden'} text-muted-foreground cart-panel-background`}>No items in cart</p>
              </div>
            ) : (
              <div className="space-y-2 cart-panel-background">
                {cartExpanded && cart.map((item) => (
                  <CartItem 
                    key={`${item.product.id}-${item.product.price}`}
                    product={item.product}
                    quantity={item.quantity}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))}
                {!cartExpanded && (
                  <div className="text-center py-2 cart-panel-background">
                    <ShoppingCartIcon className="h-8 w-8 mx-auto" />
                    <span className="text-sm font-bold cart-panel-background">{cart.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="w-96 fixed top-20 right-0 bottom-0 z-10 bg-white shadow-lg flex flex-col overflow-hidden cart-panel-background">
      <ScrollArea className="flex-1 cart-panel-background">
        <div className="p-4 cart-panel-background">
          {cart.length === 0 ? (
            <div className="text-center py-6 cart-panel-background">
              <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground cart-panel-background">No items in cart</p>
              <p className="text-sm text-muted-foreground cart-panel-background">
                Add products to begin a sale
              </p>
            </div>
          ) : (
            <div className="space-y-2 cart-panel-background">
              {cart.map((item) => (
                <CartItem 
                  key={`${item.product.id}-${item.product.price}`}
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
};

export default CartPanel;
