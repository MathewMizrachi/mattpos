
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

interface RefundScreenProps {
  onProcessRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => void;
  onCancel: () => void;
}

const RefundScreen: React.FC<RefundScreenProps> = ({
  onProcessRefund,
  onCancel
}) => {
  const { products } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [refundMethod, setRefundMethod] = useState<'cash' | 'shop2shop'>('cash');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleRefund = () => {
    if (selectedProduct && quantity > 0) {
      onProcessRefund(selectedProduct, quantity, refundMethod);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Process Refund</h2>
        
        <div className="mb-6">
          <Label htmlFor="product-search">Search Product</Label>
          <Input
            id="product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for product..."
            className="mb-2"
          />
          
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectProduct(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{formatCurrency(product.price)}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-muted-foreground">No products found</div>
            )}
          </div>
        </div>
        
        {selectedProduct && (
          <>
            <div className="mb-4">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            
            <div className="mb-6">
              <Label htmlFor="refund-method">Refund Method</Label>
              <Select
                value={refundMethod}
                onValueChange={(value) => setRefundMethod(value as 'cash' | 'shop2shop')}
              >
                <SelectTrigger id="refund-method" className="mt-1">
                  <SelectValue placeholder="Select refund method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="shop2shop">Shop2Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between py-1">
                <span>Product:</span>
                <span>{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Unit Price:</span>
                <span>{formatCurrency(selectedProduct.price)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span>Total Refund:</span>
                <span>{formatCurrency(selectedProduct.price * quantity)}</span>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleRefund}
            disabled={!selectedProduct || quantity <= 0}
          >
            Process Refund
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RefundScreen;
