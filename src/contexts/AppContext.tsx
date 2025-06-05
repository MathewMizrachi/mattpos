import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Customer, CartItem, Shift, SplitPaymentDetails, Refund, PaymentBreakdown, RefundBreakdown } from '@/types';
import { getStoredUsers, getStoredProducts, getStoredCustomers } from '@/lib/db';

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
  
  // Transaction management
  processTransaction: (paymentDetails: SplitPaymentDetails[]) => boolean;
  
  // Refund management
  refunds: Refund[];
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  
  // Reports
  getPaymentBreakdown: (shiftId?: number) => PaymentBreakdown;
  getRefundBreakdown: (shiftId?: number) => RefundBreakdown;
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
    const storedUsers = getStoredUsers();
    if (storedUsers) {
      setUsers(storedUsers);
    }
    
    const storedProducts = getStoredProducts();
    if (storedProducts) {
      setProducts(storedProducts);
    }
    
    const storedCustomers = getStoredCustomers();
    if (storedCustomers) {
      setCustomers(storedCustomers);
    }
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
      const newProduct: Product = {
        id: Date.now(), // Simple ID generation
        ...product,
      };
      setProducts(prev => [...prev, newProduct]);
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };
  
  const updateProduct = (id: number, product: Omit<Product, 'id'>): boolean => {
    try {
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...product } : p))
      );
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };
  
  const deleteProduct = (id: number): boolean => {
    try {
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
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
      const newCustomer: Customer = {
        id: Date.now(), // Simple ID generation
        name: customerData.name,
        phone: customerData.phone,
        idNumber: customerData.idNumber || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        paymentTermDays: customerData.paymentTermDays || 30,
        isPaid: false,
      };
      
      setCustomers(prev => [...prev, newCustomer]);
      return true;
    } catch (error) {
      console.error('Error adding customer:', error);
      return false;
    }
  };

  const markCustomerAsPaid = (customerId: number): boolean => {
    try {
      setCustomers(prev =>
        prev.map(customer =>
          customer.id === customerId ? { ...customer, isPaid: true } : customer
        )
      );
      return true;
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
      const newShift: Shift = {
        id: Date.now(), // Simple ID generation
        userId: userId,
        startTime: new Date(),
        startFloat: startFloat,
      };
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
      const updatedShift: Shift = {
        ...currentShift,
        endTime: new Date(),
        endFloat: endFloat,
      };
      setCurrentShift(null);
      setShifts(prev =>
        prev.map(shift => (shift.id === updatedShift.id ? updatedShift : shift))
      );
      return true;
    } catch (error) {
      console.error('Error ending shift:', error);
      return false;
    }
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
    // Mock implementation
    return {
      cash: 100,
      card: 50,
      shop2shop: 25,
      account: 10,
    };
  };
  
  const getRefundBreakdown = (shiftId?: number): RefundBreakdown => {
    // Mock implementation
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
    
    // Transaction management
    processTransaction,
    
    // Refund management
    refunds,
    processRefund,
    
    // Reports
    getPaymentBreakdown,
    getRefundBreakdown,
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
