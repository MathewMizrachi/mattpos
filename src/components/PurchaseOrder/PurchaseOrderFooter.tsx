
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PurchaseOrderFooterProps {
  cart: any[];
  total: number;
  onClearCart: () => void;
  onPlaceOrder: () => void;
  supplierSelected: boolean;
}

const PurchaseOrderFooter: React.FC<PurchaseOrderFooterProps> = ({
  cart,
  total,
  onClearCart,
  onPlaceOrder,
  supplierSelected
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#FAA225] p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="text-left">
            <p className="text-sm text-muted-foreground">
              {cart.length} item{cart.length !== 1 ? 's' : ''} • Cost Total
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onClearCart}
            disabled={cart.length === 0}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          
          <Button
            onClick={onPlaceOrder}
            disabled={cart.length === 0 || !supplierSelected}
            className="bg-green-600 hover:bg-green-700 text-white min-w-32"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderFooter;
