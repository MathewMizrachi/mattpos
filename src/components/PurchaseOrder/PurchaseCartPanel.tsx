
import React from 'react';
import { ShoppingCartIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PurchaseCartItem from './PurchaseCartItem';
import { Button } from '@/components/ui/button';

interface PurchaseCartPanelProps {
  cart: any[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  isMobile: boolean;
  cartExpanded: boolean;
  toggleCartExpand: () => void;
}

const PurchaseCartPanel: React.FC<PurchaseCartPanelProps> = ({
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
        onClick={() => toggleCartExpand()}
      >
        <ScrollArea className="flex-1">
          <div className="p-2">
            {cart.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingCartIcon className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-2" />
                <p className={`${cartExpanded ? 'block' : 'hidden'} text-muted-foreground`}>No items in order</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cartExpanded && cart.map((item) => (
                  <PurchaseCartItem 
                    key={item.product.id}
                    product={item.product}
                    quantity={item.quantity}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                    isMobile={isMobile}
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
            <Button 
              variant="outline" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                toggleCartExpand();
              }}
              className="bg-white hover:bg-gray-100"
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
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
              <p className="text-muted-foreground">No items in order</p>
              <p className="text-sm text-muted-foreground">
                Add products to begin a purchase order
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <PurchaseCartItem 
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PurchaseCartPanel;
