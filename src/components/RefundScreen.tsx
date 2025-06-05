
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
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-16">
      {/* Fixed Header - styled like POS but with red theme */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 flex justify-center items-center z-20">
        <h1 className="text-2xl font-bold">REFUND</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <Label htmlFor="product-search" className="text-red-600 font-semibold">Search Product</Label>
            <Input
              id="product-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for product..."
              className="mb-2 bg-white text-red-600 border-red-600 font-medium focus:border-red-600 focus:ring-red-600"
            />
            
            <div className="max-h-60 overflow-y-auto border border-red-600 rounded-md">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className={`p-3 border-b border-red-200 cursor-pointer hover:bg-red-50 ${selectedProduct?.id === product.id ? 'bg-red-100' : ''}`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="font-medium text-red-700">{product.name}</div>
                    <div className="text-sm text-red-500">{formatCurrency(product.price)}</div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-red-400">No products found</div>
              )}
            </div>
          </div>
          
          {selectedProduct && (
            <>
              <div className="mb-4">
                <Label htmlFor="quantity" className="text-red-600 font-semibold">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="mt-1 bg-white text-red-600 border-red-600 focus:border-red-600 focus:ring-red-600"
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="refund-method" className="text-red-600 font-semibold">Refund Method</Label>
                <Select
                  value={refundMethod}
                  onValueChange={(value) => setRefundMethod(value as 'cash' | 'shop2shop')}
                >
                  <SelectTrigger id="refund-method" className="mt-1 bg-white text-red-600 border-red-600 focus:border-red-600 focus:ring-red-600">
                    <SelectValue placeholder="Select refund method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="shop2shop">Shop2Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <div className="flex justify-between py-1">
                  <span className="text-red-600">Product:</span>
                  <span className="text-red-700 font-medium">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-red-600">Unit Price:</span>
                  <span className="text-red-700 font-medium">{formatCurrency(selectedProduct.price)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-red-600">Quantity:</span>
                  <span className="text-red-700 font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between py-1 font-bold border-t border-red-200 pt-2">
                  <span className="text-red-600">Total Refund:</span>
                  <span className="text-red-700">{formatCurrency(selectedProduct.price * quantity)}</span>
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel} className="text-red-600 bg-white hover:bg-red-50 border-red-600">
              Cancel
            </Button>
            <Button
              onClick={handleRefund}
              disabled={!selectedProduct || quantity <= 0}
              className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-semibold"
            >
              Process Refund
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundScreen;
