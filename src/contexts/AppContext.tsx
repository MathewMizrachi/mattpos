
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { AppContextType } from './types';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useCustomers } from './hooks/useCustomers';
import { useShift } from './hooks/useShift';
import { useTransaction } from './hooks/useTransaction';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, login, logout } = useAuth();
  const { cart, addToCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { 
    products, 
    refreshProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    getLowStockProducts 
  } = useProducts();
  const { 
    customers, 
    refreshCustomers, 
    addCustomer, 
    getCustomers, 
    markCustomerAsPaid 
  } = useCustomers();
  const { 
    currentShift, 
    startShift, 
    endShift, 
    getLastShiftEndFloat,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    calculateExpectedCashInDrawer,
    setCurrentShift
  } = useShift();
  
  // Update shift reference whenever user changes (for initial login)
  useEffect(() => {
    if (currentUser) {
      // This will set the current shift if there's an active one
      const activeShift = db.getCurrentShift();
      if (activeShift) {
        setCurrentShift(activeShift);
      }
    }
  }, [currentUser, setCurrentShift]);
  
  // Initialize customers when mounted
  useEffect(() => {
    refreshCustomers();
  }, []);
  
  const getCurrentShiftId = () => currentShift?.id || null;
  const updateShift = () => {
    const updatedShift = db.getCurrentShift();
    if (updatedShift) {
      setCurrentShift(updatedShift);
    }
  };
  
  const { processPayment, processRefund } = useTransaction(
    getCurrentShiftId,
    refreshProducts,
    refreshCustomers,
    clearCart,
    addCustomer,
    updateShift
  );
  
  // Override processPayment to include cart items
  const processPaymentWithCart = (
    cashReceived: number,
    paymentMethod = 'cash',
    customerName?: string,
    customerPhone?: string,
    splitPayments?: any[]
  ) => {
    if (!currentShift || cart.length === 0) {
      return { success: false, change: 0 };
    }
    
    const items = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.price
    }));
    
    let customerId: number | undefined;
    
    if ((paymentMethod === 'account' || (paymentMethod === 'split' && splitPayments?.some(p => p.method === 'account'))) 
        && customerName && customerPhone) {
      const customerIdNumber = splitPayments?.find(p => p.method === 'account')?.customerIdNumber;
      const paymentTermDays = splitPayments?.find(p => p.method === 'account')?.paymentTermDays;
      const customer = addCustomer(customerName, customerPhone, customerIdNumber, paymentTermDays);
      customerId = customer.id;
    }
    
    const dbSplitPayments = splitPayments?.map(payment => ({
      method: payment.method,
      amount: payment.amount
    }));
    
    const transaction = db.createTransaction(
      currentShift.id, 
      items, 
      cashReceived, 
      paymentMethod, 
      customerId,
      dbSplitPayments
    );
    
    updateShift();
    refreshProducts();
    refreshCustomers();
    
    clearCart();
    
    return { 
      success: true, 
      change: transaction.change
    };
  };
  
  // Clean logout - clear cart as well
  const handleLogout = () => {
    logout();
    clearCart();
  };

  const value: AppContextType = {
    currentUser,
    currentShift,
    cart,
    products,
    customers,
    login,
    logout: handleLogout,
    startShift,
    endShift,
    getLastShiftEndFloat,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    processPayment: processPaymentWithCart,
    processRefund,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    calculateExpectedCashInDrawer,
    addCustomer,
    getCustomers,
    markCustomerAsPaid,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Import db here to avoid circular dependencies
import db from '@/lib/db';
