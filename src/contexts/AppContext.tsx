
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { AppContextType } from './types';
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { useShift } from './hooks/useShift';
import { useInventory } from './hooks/useInventory';
import { useCustomers } from './hooks/useCustomers';
import { useTransactions } from './hooks/useTransactions';
import db from '@/lib/db';
import { SplitPaymentDetails } from '@/types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize hooks
  const { currentUser, login, logout } = useAuth();
  const { cart, addToCart, updateCartItem, removeFromCart, clearCart } = useCart();
  const { 
    currentShift, 
    startShift, 
    endShift, 
    getLastShiftEndFloat,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    calculateExpectedCashInDrawer,
    initializeShift
  } = useShift();
  const {
    products,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts
  } = useInventory();
  const {
    customers,
    refreshCustomers,
    addCustomer,
    getCustomers,
    markCustomerAsPaid
  } = useCustomers();

  // Initialize shift if user is logged in
  useEffect(() => {
    if (currentUser) {
      initializeShift();
      refreshCustomers();
    }
  }, [currentUser]);

  // Implement processPayment with access to cart
  const processPayment = (
    cashReceived: number, 
    paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split' = 'cash',
    customerName?: string,
    customerPhone?: string,
    splitPayments?: SplitPaymentDetails[]
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
    
    const updatedShift = db.getCurrentShift();
    if (updatedShift) {
      initializeShift();
    }
    
    refreshProducts();
    refreshCustomers();
    
    clearCart();
    
    return { 
      success: true, 
      change: transaction.change
    };
  };

  // Implement transactions with access to functions from other hooks
  const { processRefund } = useTransactions(
    currentShift?.id || null,
    refreshProducts,
    refreshCustomers
  );

  const value: AppContextType = {
    currentUser,
    currentShift,
    cart,
    products,
    customers,
    login,
    logout,
    startShift,
    endShift,
    getLastShiftEndFloat,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    processPayment,
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
