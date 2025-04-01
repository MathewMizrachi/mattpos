import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PaymentForm from '@/components/PaymentForm';
import ShiftSummary from '@/components/ShiftSummary';

// Import our components
import POSHeader from '@/components/POS/POSHeader';
import ProductSearch from '@/components/POS/ProductSearch';
import ProductGrid from '@/components/POS/ProductGrid';
import CartPanel from '@/components/POS/CartPanel';
import PaymentFooter from '@/components/POS/PaymentFooter';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showShiftSummary, setShowShiftSummary] = useState(false);
  const [completedShift, setCompletedShift] = useState<any>(null);
  
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
  
  const handlePaymentComplete = (cashReceived: number) => {
    const result = processPayment(cashReceived);
    
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
      
      <div className={`flex-1 ${isMobile ? 'flex-col' : 'flex'} overflow-hidden relative mt-16`}>
        {isMobile && (
          <CartPanel 
            cart={cart}
            onUpdateQuantity={updateCartItem}
            onRemove={removeFromCart}
            isMobile={true}
          />
        )}
        
        <div className={`flex-1 flex flex-col overflow-hidden ${!isMobile ? 'pr-96' : ''}`}>
          <ScrollArea className="flex-1 h-full">
            <div className="px-3 pb-36">
              <ProductGrid 
                products={filteredProducts}
                isMobile={isMobile}
                onAddToCart={addToCart}
              />
            </div>
          </ScrollArea>
        </div>
        
        {!isMobile && (
          <CartPanel 
            cart={cart}
            onUpdateQuantity={updateCartItem}
            onRemove={removeFromCart}
            isMobile={false}
          />
        )}
      </div>
      
      <PaymentFooter 
        total={calculateTotal()}
        cartLength={cart.length}
        onClearCart={clearCart}
        onShowPaymentForm={() => setShowPaymentForm(true)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default POS;
