
import React from 'react';
import { ShoppingCartIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
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
  if (isMobile) {
    return (
      <div 
        className={`fixed top-20 bottom-0 right-0 ${cartExpanded ? 'w-3/5' : 'w-1/7'} z-10 bg-white shadow-lg flex flex-col overflow-hidden transition-all duration-300`}
        onClick={toggleCartExpand}
      >
        <ScrollArea className="flex-1">
          <div className="p-2">
            {cart.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                <p className={`${cartExpanded ? 'block' : 'hidden'} text-muted-foreground`}>No items in cart</p>
              </div>
            ) : (
              <div className="space-y-2">
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
                  <div className="text-center py-2">
                    <ShoppingCartIcon className="h-8 w-8 mx-auto" />
                    <span className="text-sm font-bold">{cart.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
        
        {cartExpanded && (
          <div className="p-2 border-t flex justify-center">
            <button 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                toggleCartExpand();
              }}
            >
              <ChevronsRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-96 fixed top-20 right-0 bottom-0 z-10 bg-white shadow-lg flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {cart.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
              <p className="text-muted-foreground">No items in cart</p>
              <p className="text-sm text-muted-foreground">
                Add products to begin a sale
              </p>
            </div>
          ) : (
            <div className="space-y-2">
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
