
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import POSLayout from '@/components/POS/POSLayout';
import POSContent from '@/components/POS/POSContent';
import BarcodeScanner from '@/components/POS/BarcodeScanner';
import db from '@/lib/db';

interface RefundPOSProps {
  onProcessRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => void;
  onCancel: () => void;
}

const RefundPOS: React.FC<RefundPOSProps> = ({
  onProcessRefund,
  onCancel
}) => {
  const { currentUser, currentShift } = useApp();
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartExpanded, setCartExpanded] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [refundMethod, setRefundMethod] = useState<'cash' | 'shop2shop'>('cash');
  
  // Load database products for refunds
  const [products, setProducts] = useState<Product[]>([]);
  
  React.useEffect(() => {
    try {
      const dbProducts = db.getAllProducts();
      setProducts(dbProducts);
      console.log('Loaded database products for refunds:', dbProducts.length);
    } catch (error) {
      console.error('Error loading database products for refunds:', error);
    }
  }, []);

  const addToCart = (product: Product, quantity: number = 1, customPrice?: number) => {
    const price = customPrice || product.price;
    const existingItem = cart.find(item => 
      item.product.id === product.id && item.price === price
    );
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id && item.price === price
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity, price }]);
    }
  };

  const updateCartItem = (productId: number, quantity: number, price?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, price);
      return;
    }
    
    setCart(cart.map(item => 
      item.product.id === productId && (price === undefined || item.price === price)
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (productId: number, price?: number) => {
    setCart(cart.filter(item => 
      !(item.product.id === productId && (price === undefined || item.price === price))
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCartExpand = () => {
    setCartExpanded(!cartExpanded);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProcessRefund = () => {
    if (cart.length === 0) return;
    
    // For now, process the first item in cart as a single refund
    // In a real implementation, you might want to handle multiple items
    const firstItem = cart[0];
    onProcessRefund(firstItem.product, firstItem.quantity, refundMethod);
  };

  const handleBarcodeProductFound = (product: Product) => {
    addToCart(product, 1);
    setShowBarcodeScanner(false);
  };

  // Custom header with red theme for refunds
  const RefundHeader = () => (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 flex justify-between items-center z-20">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-2xl font-bold">REFUND - {currentUser?.name}</h2>
          <p className="text-xs text-gray-300">
            Shift: {currentShift?.id} | Float: {formatCurrency(currentShift?.startFloat || 0)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowBarcodeScanner(true)}
          className="px-3 py-1 text-sm border border-white rounded hover:bg-white/20"
        >
          Scan
        </button>
        
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm border border-white rounded hover:bg-white/20"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Custom footer with red theme
  const RefundFooter = () => (
    <div className="fixed bottom-0 right-0 w-full px-6 py-4 flex items-center justify-between z-20 bg-red-600">
      <span className="text-2xl font-bold text-white">{formatCurrency(calculateTotal())}</span>
      
      <div className="flex space-x-3">
        {cart.length > 0 && (
          <button 
            onClick={clearCart}
            className="px-4 py-2 bg-white text-red-600 rounded font-bold hover:bg-gray-100"
          >
            Clear
          </button>
        )}
        
        <select
          value={refundMethod}
          onChange={(e) => setRefundMethod(e.target.value as 'cash' | 'shop2shop')}
          className="px-3 py-2 bg-white text-red-600 rounded font-bold"
        >
          <option value="cash">Cash Refund</option>
          <option value="shop2shop">Shop2Shop</option>
        </select>
        
        <button 
          onClick={handleProcessRefund}
          disabled={cart.length === 0}
          className="px-4 py-2 bg-[#FAA225] text-[#0A2645] rounded font-bold hover:bg-[#FAA225]/90 disabled:opacity-50"
        >
          Process Refund
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-16">
      <RefundHeader />
      
      <POSContent
        products={products}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cart={cart}
        onAddToCart={addToCart}
        onUpdateCartItem={updateCartItem}
        onRemoveFromCart={removeFromCart}
        cartExpanded={cartExpanded}
        toggleCartExpand={toggleCartExpand}
      />

      <RefundFooter />

      {showBarcodeScanner && (
        <BarcodeScanner
          products={products}
          onProductFound={handleBarcodeProductFound}
          onClose={() => setShowBarcodeScanner(false)}
        />
      )}
    </div>
  );
};

export default RefundPOS;
