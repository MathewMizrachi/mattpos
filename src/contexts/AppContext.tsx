
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Customer, CartItem, Shift, SplitPaymentDetails, Refund, PaymentBreakdown, RefundBreakdown } from '@/types';
import db from '@/lib/db';

interface AppContextType {
  // User management
  currentUser: User | null;
  users: User[];
  login: (pin: string) => User | null;
  logout: () => void;
  
  // Product management
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => boolean;
  updateProduct: (id: number, product: Omit<Product, 'id'>) => boolean;
  deleteProduct: (id: number) => boolean;
  
  // Customer management
  customers: Customer[];
  addCustomer: (customerData: {
    name: string;
    phone: string;
    idNumber?: string;
    paymentTermDays?: number;
  }) => boolean;
  markCustomerAsPaid: (customerId: number) => boolean;
  
  // Cart management
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  
  // Shift management
  currentShift: Shift | null;
  shifts: Shift[];
  startShift: (userId: number, startFloat: number) => boolean;
  endShift: (endFloat: number) => boolean;
  getLastShiftEndFloat: () => number | null;
  
  // Transaction management
  processTransaction: (paymentDetails: SplitPaymentDetails[]) => boolean;
  
  // Refund management
  refunds: Refund[];
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  
  // Reports
  getPaymentBreakdown: (shiftId?: number) => PaymentBreakdown;
  getRefundBreakdown: (shiftId?: number) => RefundBreakdown;
  getShiftPaymentBreakdown: (shiftId: number) => PaymentBreakdown;
  getShiftRefundBreakdown: (shiftId: number) => RefundBreakdown;
  getLowStockProducts: (threshold?: number) => Product[];
  calculateExpectedCashInDrawer: (shiftId: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  
  useEffect(() => {
    // Initialize data from the database
    setUsers([
      { id: 1, name: 'Owner', pin: '55', role: 'manager' },
      { id: 2, name: 'Staff 1', pin: '55', role: 'staff' },
    ]);
    
    setProducts(db.getAllProducts());
    setCustomers(db.getAllCustomers());
  }, []);
  
  useEffect(() => {
    // Calculate cart total whenever the cart changes
    const newCartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    setCartTotal(newCartTotal);
  }, [cart]);
  
  const login = (pin: string): User | null => {
    const user = users.find(user => user.pin === pin);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };
  
  const logout = () => {
    setCurrentUser(null);
  };
  
  const addProduct = (product: Omit<Product, 'id'>): boolean => {
    try {
      const newProduct = db.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };
  
  const updateProduct = (id: number, product: Omit<Product, 'id'>): boolean => {
    try {
      const updatedProduct = db.updateProduct(id, product);
      if (updatedProduct) {
        setProducts(prev =>
          prev.map(p => (p.id === id ? updatedProduct : p))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };
  
  const deleteProduct = (id: number): boolean => {
    try {
      const success = db.deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(product => product.id !== id));
      }
      return success;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };
  
  const addCustomer = (customerData: {
    name: string;
    phone: string;
    idNumber?: string;
    paymentTermDays?: number;
  }) => {
    try {
      const newCustomer = db.addCustomer(
        customerData.name,
        customerData.phone,
        customerData.idNumber,
        customerData.paymentTermDays
      );
      
      setCustomers(prev => [...prev, newCustomer]);
      return true;
    } catch (error) {
      console.error('Error adding customer:', error);
      return false;
    }
  };

  const markCustomerAsPaid = (customerId: number): boolean => {
    try {
      const success = db.markCustomerAsPaid(customerId);
      if (success) {
        setCustomers(prev =>
          prev.map(customer =>
            customer.id === customerId ? { ...customer, isPaid: true } : customer
          )
        );
      }
      return success;
    } catch (error) {
      console.error('Error marking customer as paid:', error);
      return false;
    }
  };
  
  const [cartTotal, setCartTotal] = useState<number>(0);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };
  
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };
  
  const updateCartQuantity = (productId: number, quantity: number) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const startShift = (userId: number, startFloat: number): boolean => {
    try {
      const newShift = db.startShift(userId, startFloat);
      setCurrentShift(newShift);
      setShifts(prev => [...prev, newShift]);
      return true;
    } catch (error) {
      console.error('Error starting shift:', error);
      return false;
    }
  };
  
  const endShift = (endFloat: number): boolean => {
    if (!currentShift) return false;
    try {
      const updatedShift = db.endShift(currentShift.id, endFloat);
      if (updatedShift) {
        setCurrentShift(null);
        setShifts(prev =>
          prev.map(shift => (shift.id === updatedShift.id ? updatedShift : shift))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error ending shift:', error);
      return false;
    }
  };
  
  const getLastShiftEndFloat = (): number | null => {
    return db.getLastShiftEndFloat();
  };
  
  const processTransaction = (paymentDetails: SplitPaymentDetails[]): boolean => {
    try {
      // Implement transaction processing logic here
      clearCart();
      return true;
    } catch (error) {
      console.error('Error processing transaction:', error);
      return false;
    }
  };
  
  const processRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop'): boolean => {
    if (!currentShift) return false;
    try {
      const refundAmount = product.price * quantity;
      
      const newRefund: Refund = {
        id: Date.now(),
        shiftId: currentShift.id,
        timestamp: new Date(),
        productId: product.id,
        quantity: quantity,
        amount: refundAmount,
        method: refundMethod,
      };
      
      setRefunds(prev => [...prev, newRefund]);
      removeFromCart(product.id);
      return true;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  };
  
  const getPaymentBreakdown = (shiftId?: number): PaymentBreakdown => {
    if (shiftId) {
      return db.getShiftPaymentBreakdown(shiftId);
    }
    // Mock implementation for current shift
    return {
      cash: 100,
      card: 50,
      shop2shop: 25,
      account: 10,
    };
  };
  
  const getRefundBreakdown = (shiftId?: number): RefundBreakdown => {
    if (shiftId) {
      return db.getShiftRefundBreakdown(shiftId);
    }
    // Mock implementation for current shift
    return {
      total: 50,
      items: [
        {
          productId: 1,
          productName: 'Example Product',
          quantity: 1,
          amount: 50,
        },
      ],
    };
  };

  const getShiftPaymentBreakdown = (shiftId: number): PaymentBreakdown => {
    return db.getShiftPaymentBreakdown(shiftId);
  };

  const getShiftRefundBreakdown = (shiftId: number): RefundBreakdown => {
    return db.getShiftRefundBreakdown(shiftId);
  };

  const getLowStockProducts = (threshold: number = 5): Product[] => {
    return db.getLowStockProducts(threshold);
  };

  const calculateExpectedCashInDrawer = (shiftId: number): number => {
    return db.calculateExpectedCashInDrawer(shiftId);
  };

  const value: AppContextType = {
    // User management
    currentUser,
    users,
    login,
    logout,
    
    // Product management
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Customer management
    customers,
    addCustomer,
    markCustomerAsPaid,
    
    // Cart management
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    
    // Shift management
    currentShift,
    shifts,
    startShift,
    endShift,
    getLastShiftEndFloat,
    
    // Transaction management
    processTransaction,
    
    // Refund management
    refunds,
    processRefund,
    
    // Reports
    getPaymentBreakdown,
    getRefundBreakdown,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    calculateExpectedCashInDrawer,
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
