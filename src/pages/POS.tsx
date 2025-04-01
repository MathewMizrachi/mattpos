import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LogOutIcon, SearchIcon, ShoppingCartIcon, XIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import ProductCard from '@/components/ProductCard';
import CartItem from '@/components/CartItem';
import PaymentForm from '@/components/PaymentForm';
import ShiftSummary from '@/components/ShiftSummary';
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white p-4 shadow-sm z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">MiniPos</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>{currentUser?.name}</span>
            <span>•</span>
            <span>Shift Active</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={handleEndShift}
            style={{ backgroundColor: '#FAA225', color: 'black' }}
          >
            End Shift
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { logout(); navigate('/'); }}>
            <LogOutIcon className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      <div className={`flex flex-1 ${isMobile ? 'flex-col' : ''} overflow-hidden`}>
        {isMobile && (
          <div className="bg-white shadow-lg flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Current Sale</h2>
                <Badge variant="outline" className="font-normal">
                  {cart.length} items
                </Badge>
              </div>
            </div>
            
            <ScrollArea className="flex-1 h-40">
              <div className="p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-4">
                    <ShoppingCartIcon className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                    <p className="text-muted-foreground text-sm">No items in cart</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {cart.map(item => (
                      <CartItem 
                        key={item.product.id}
                        product={item.product}
                        quantity={item.quantity}
                        onUpdateQuantity={updateCartItem}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t bg-secondary">
              <div className="flex justify-between mb-4">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-3xl font-bold">{formatCurrency(calculateTotal())}</span>
              </div>
              
              <div className="flex space-x-2">
                {cart.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={clearCart}
                    style={{ 
                      backgroundColor: 'white', 
                      color: 'black', 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      border: '2px solid #FAA225',
                      height: '4rem'
                    }}
                  >
                    Clear Cart
                  </Button>
                )}
                <Button 
                  className={`${cart.length > 0 ? 'flex-1' : 'w-full'}`}
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={() => setShowPaymentForm(true)}
                  style={{ 
                    height: '4rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <div className="relative mb-4">
              <SearchIcon className="h-8 w-8 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-14 bg-white text-xl font-medium h-14 border-2 border-secondary/20 focus:ring-2 focus:ring-secondary"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                  onClick={() => setSearchTerm('')}
                >
                  <XIcon className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4`}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!isMobile && (
          <div className="w-96 bg-white shadow-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Current Sale</h2>
                <Badge variant="outline" className="font-normal">
                  {cart.length} items
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">No items in cart</p>
                  <p className="text-sm text-muted-foreground">
                    Add products to begin a sale
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {cart.map(item => (
                    <CartItem 
                      key={item.product.id}
                      product={item.product}
                      quantity={item.quantity}
                      onUpdateQuantity={updateCartItem}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-secondary">
              <div className="flex justify-between mb-4">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-3xl font-bold">{formatCurrency(calculateTotal())}</span>
              </div>
              
              <div className="flex space-x-2">
                {cart.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={clearCart}
                    style={{ 
                      backgroundColor: 'white', 
                      color: 'black', 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      border: '2px solid #FAA225',
                      height: '4rem'
                    }}
                  >
                    Clear Cart
                  </Button>
                )}
                <Button 
                  className={`${cart.length > 0 ? 'flex-1' : 'w-full'}`}
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={() => setShowPaymentForm(true)}
                  style={{ 
                    height: '4rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;
