import React, { createContext, useContext, useState, ReactNode } from 'react';
import db from '@/lib/db';
import { SplitPaymentDetails } from '@/types';

interface User {
  id: number;
  name: string;
  pin: string;
  role: 'manager' | 'staff';
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  salesTotal?: number;
  transactionCount?: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AppContextType {
  currentUser: User | null;
  currentShift: Shift | null;
  cart: CartItem[];
  products: Product[];
  customers: Customer[];
  
  login: (pin: string) => boolean;
  logout: () => void;
  
  startShift: (userId: number, startFloat: number) => void;
  endShift: () => Shift | null;
  
  addToCart: (product: Product, quantity?: number) => void;
  updateCartItem: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  
  processPayment: (cashReceived: number, paymentMethod?: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => {
    success: boolean;
    change: number;
  };
  
  addCustomer: (name: string, phone: string) => Customer;
  getCustomers: () => Customer[];
  
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: number, updates: Partial<Omit<Product, 'id'>>) => Product | null;
  deleteProduct: (id: number) => boolean;
  refreshProducts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(db.getAllProducts());
  const [customers, setCustomers] = useState<Customer[]>([]);

  const login = (pin: string): boolean => {
    const user = db.authenticateUser(pin);
    if (user) {
      setCurrentUser(user);
      const activeShift = db.getCurrentShift();
      if (activeShift) {
        setCurrentShift(activeShift);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentShift(null);
    clearCart();
  };

  const startShift = (userId: number, startFloat: number) => {
    const shift = db.startShift(userId, startFloat);
    setCurrentShift(shift);
  };

  const endShift = () => {
    if (!currentShift) return null;
    
    const completedShift = db.endShift(currentShift.id);
    setCurrentShift(null);
    return completedShift;
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.product.id === product.id && item.product.price === product.price
      );
      
      if (existingItem) {
        return prevCart.map(item => 
          (item.product.id === product.id && item.product.price === product.price)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
  };

  const updateCartItem = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

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
      const customer = addCustomer(customerName, customerPhone);
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
      setCurrentShift(updatedShift);
    }
    
    refreshProducts();
    refreshCustomers();
    
    clearCart();
    
    return { 
      success: true, 
      change: transaction.change
    };
  };

  const addCustomer = (name: string, phone: string): Customer => {
    const customer = db.addCustomer(name, phone);
    refreshCustomers();
    return customer;
  };

  const getCustomers = (): Customer[] => {
    return customers;
  };

  const refreshCustomers = () => {
    setCustomers(db.getAllCustomers());
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = db.addProduct(product);
    refreshProducts();
    return newProduct;
  };

  const updateProduct = (id: number, updates: Partial<Omit<Product, 'id'>>) => {
    const updated = db.updateProduct(id, updates);
    refreshProducts();
    return updated;
  };

  const deleteProduct = (id: number) => {
    const result = db.deleteProduct(id);
    refreshProducts();
    return result;
  };

  const refreshProducts = () => {
    setProducts(db.getAllProducts());
  };

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
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    processPayment,
    addCustomer,
    getCustomers,
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
