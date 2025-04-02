
import React, { useState } from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus } from 'lucide-react';

interface ProductEditModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number, customPrice?: number) => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(product.price);
  const [isPriceCustomized, setIsPriceCustomized] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setPrice(value);
      setIsPriceCustomized(true);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const resetPrice = () => {
    setPrice(product.price);
    setIsPriceCustomized(false);
  };

  const handleSubmit = () => {
    onConfirm(quantity, isPriceCustomized ? price : undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-lg">Quantity</Label>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="rounded-full"
              >
                <Minus className="h-4 w-4 text-white" />
              </Button>
              
              <Input 
                id="quantity"
                type="number" 
                min="1" 
                value={quantity} 
                onChange={handleQuantityChange}
                className="mx-2 text-center text-lg bg-white"
              />
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={incrementQuantity}
                className="rounded-full"
              >
                <Plus className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="price" className="text-lg">Price</Label>
              {isPriceCustomized && (
                <Button 
                  variant="ghost" 
                  onClick={resetPrice} 
                  className="text-sm underline h-auto py-0 px-1"
                >
                  Reset to {formatCurrency(product.price)}
                </Button>
              )}
            </div>
            <Input 
              id="price"
              type="number" 
              step="0.01" 
              min="0" 
              value={price} 
              onChange={handlePriceChange}
              className="text-lg bg-white"
            />
          </div>
          
          <div className="pt-4">
            <p className="text-xl font-bold">
              Total: {formatCurrency(price * quantity)}
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-[#FAA225] text-black hover:bg-[#FAA225]/90"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
