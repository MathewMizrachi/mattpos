
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PaymentForm from '@/components/PaymentForm';
import ShiftSummary from '@/components/ShiftSummary';
import PaymentOptions from '@/components/PaymentOptions';
import CardPaymentScreen from '@/components/CardPaymentScreen';
import Shop2ShopScreen from '@/components/Shop2ShopScreen';
import { Product } from '@/types';

import POSHeader from '@/components/POS/POSHeader';
import ProductSearch from '@/components/POS/ProductSearch';
import ProductGrid from '@/components/POS/ProductGrid';
import CartPanel from '@/components/POS/CartPanel';
import PaymentFooter from '@/components/POS/PaymentFooter';

const POS = () => {
  const { 
    currentUser, 
    currentShift, 
    products,
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    processPayment,
    endShift,
    logout
  } = useApp();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showShop2Shop, setShowShop2Shop] = useState(false);
  const [showShiftSummary, setShowShiftSummary] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'shop2shop'>('cash');
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  useEffect(() => {
    if (!currentShift) {
      navigate('/dashboard');
    }
  }, [currentShift, navigate]);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEndShift = () => {
    if (cart.length > 0) {
      toast({
        title: "Cannot end shift",
        description: "Please complete or clear the current transaction",
        variant: "destructive"
      });
      return;
    }
    
    const shift = endShift();
    if (shift) {
      setCompletedShift(shift);
      setShowShiftSummary(true);
    }
  };
  
  const handleSelectPaymentMethod = (method: 'shop2shop' | 'cash' | 'card') => {
    setPaymentMethod(method);
    setShowPaymentOptions(false);
    
    switch (method) {
      case 'cash':
        setShowPaymentForm(true);
        break;
      case 'card':
        setShowCardPayment(true);
        break;
      case 'shop2shop':
        setShowShop2Shop(true);
        break;
    }
  };
  
  const handleNonCashPayment = () => {
    const result = processPayment(calculateTotal(), paymentMethod);
    
    if (result.success) {
      toast({
        title: `${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)} payment successful`,
        description: '',
      });
      setShowCardPayment(false);
      setShowShop2Shop(false);
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };
  
  const handlePaymentComplete = (cashReceived: number) => {
    const result = processPayment(cashReceived, 'cash');
    
    if (result.success) {
      toast({
        title: "Payment successful",
        description: `Change: ${formatCurrency(result.change)}`,
      });
      setShowPaymentForm(false);
    } else {
      toast({
        title: "Payment failed",
        description: "There was an error processing the payment",
        variant: "destructive"
      });
    }
  };
  
  const handleCloseSummary = () => {
    setShowShiftSummary(false);
    navigate('/dashboard');
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };
  
  const handleAddToCart = (product: Product, quantity: number, customPrice?: number) => {
    if (customPrice !== undefined && customPrice !== product.price) {
      const modifiedProduct = {
        ...product,
        price: customPrice
      };
      addToCart(modifiedProduct, quantity);
    } else {
      addToCart(product, quantity);
    }
  };
  
  // Render different payment screens based on state
  if (showPaymentOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <div className="w-full max-w-md p-8 bg-[#0A2645] rounded-lg shadow-lg border border-gray-700">
          <PaymentOptions 
            onSelectPaymentMethod={handleSelectPaymentMethod}
            onCancel={() => setShowPaymentOptions(false)}
          />
        </div>
      </div>
    );
  }
  
  if (showCardPayment) {
    return (
      <CardPaymentScreen
        total={calculateTotal()}
        onProcessPayment={handleNonCashPayment}
        onCancel={() => setShowCardPayment(false)}
      />
    );
  }
  
  if (showShop2Shop) {
    return (
      <Shop2ShopScreen
        total={calculateTotal()}
        onProcessPayment={handleNonCashPayment}
        onCancel={() => setShowShop2Shop(false)}
      />
    );
  }
  
  if (showPaymentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <PaymentForm 
            total={calculateTotal()}
            onProcessPayment={handlePaymentComplete}
            onCancel={() => setShowPaymentForm(false)}
          />
        </div>
      </div>
    );
  }
  
  if (showShiftSummary && completedShift) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <ShiftSummary 
            shift={completedShift}
            onClose={handleCloseSummary}
          />
        </div>
      </div>
    );
  }
  
  // Main POS screen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 pb-32">
      <POSHeader 
        currentUser={currentUser}
        currentShift={currentShift}
        onEndShift={handleEndShift}
        onLogout={logout}
      />
      
      <div className="fixed top-20 left-0 right-0 p-3 z-10 bg-gray-50">
        <ProductSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>
      
      <div className="flex-1 overflow-hidden relative mt-16">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 pb-36">
            <ProductGrid 
              products={filteredProducts}
              isMobile={isMobile}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
        
        <CartPanel 
          cart={cart}
          onUpdateQuantity={updateCartItem}
          onRemove={removeFromCart}
          isMobile={isMobile}
        />
      </div>
      
      <PaymentFooter 
        total={calculateTotal()}
        cartLength={cart.length}
        onClearCart={clearCart}
        onShowPaymentForm={() => setShowPaymentOptions(true)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default POS;
