
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: number;
  name: string;
  pin: string;
}

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  endCash?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
  barcode?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  isPaid: boolean;
  createdAt: Date;
  idNumber?: string;
  paymentTermDays?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

interface AppContextType {
  currentUser: User | null;
  currentShift: Shift | null;
  currentMode: 'till' | 'restaurant';
  products: Product[];
  customers: Customer[];
  cart: CartItem[];
  login: (pin: string) => boolean;
  logout: () => void;
  startShift: (userId: number, startFloat: number) => void;
  endShift: (cashAmount?: number) => void;
  toggleMode: () => void;
  addProduct: (product: Omit<Product, 'id'>) => boolean;
  updateProduct: (id: number, updates: Partial<Product>) => boolean;
  deleteProduct: (id: number) => boolean;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => boolean;
  markCustomerAsPaid: (customerId: number) => boolean;
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  processTransaction: (paymentDetails: any[]) => any;
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  getLastShiftEndFloat: () => number | null;
  getShiftPaymentBreakdown: (shiftId: number) => any;
  getShiftRefundBreakdown: (shiftId: number) => any;
  getLowStockProducts: (limit: number) => Product[];
  calculateExpectedCashInDrawer: (shiftId: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

const mockUsers: User[] = [
  { id: 1, name: "John Doe", pin: "55" },
  { id: 2, name: "Jane Smith", pin: "55" },
  { id: 3, name: "Alice Johnson", pin: "55" },
  { id: 4, name: "Bob Williams", pin: "55" },
];

const mockProducts: Product[] = [
  { id: 1, name: "Apple", price: 1.50, stock: 100, barcode: "123456789" },
  { id: 2, name: "Banana", price: 0.80, stock: 50, barcode: "987654321" },
  { id: 3, name: "Orange", price: 2.00, stock: 75, barcode: "456789123" },
];

const mockCustomers: Customer[] = [
  { id: 1, name: "John Customer", phone: "0123456789", isPaid: false, createdAt: new Date(), paymentTermDays: 30 },
  { id: 2, name: "Jane Customer", phone: "0987654321", isPaid: true, createdAt: new Date(), paymentTermDays: 15 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [currentMode, setCurrentMode] = useState<'till' | 'restaurant'>('till');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [cart, setCart] = useState<CartItem[]>([]);

  const login = (pin: string): boolean => {
    const user = mockUsers.find(user => user.pin === pin);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentShift(null);
    setCart([]);
  };

  const startShift = (userId: number, startFloat: number) => {
    const newShift: Shift = {
      id: Date.now(),
      userId: userId,
      startTime: new Date(),
      startFloat: startFloat,
    };
    setCurrentShift(newShift);
  };

  const endShift = (cashAmount?: number) => {
    if (currentShift) {
      setCurrentShift({ ...currentShift, endTime: new Date(), endCash: cashAmount });
    }
    setCurrentShift(null);
    setCart([]);
  };

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'till' ? 'restaurant' : 'till');
  };

  const addProduct = (product: Omit<Product, 'id'>): boolean => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
    return true;
  };

  const updateProduct = (id: number, updates: Partial<Product>): boolean => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    return true;
  };

  const deleteProduct = (id: number): boolean => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt'>): boolean => {
    const newCustomer = { ...customer, id: Date.now(), createdAt: new Date() };
    setCustomers(prev => [...prev, newCustomer]);
    return true;
  };

  const markCustomerAsPaid = (customerId: number): boolean => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, isPaid: true } : c));
    return true;
  };

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart(prev => [...prev, { product, quantity, price: product.price }]);
    }
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processTransaction = (paymentDetails: any[]) => {
    // Mock implementation
    clearCart();
    return { success: true, transactionId: Date.now() };
  };

  const processRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop'): boolean => {
    // Mock implementation
    return true;
  };

  const getLastShiftEndFloat = (): number | null => {
    // Mock implementation
    return 100;
  };

  const getShiftPaymentBreakdown = (shiftId: number) => {
    // Mock implementation
    return {
      cash: 500,
      card: 300,
      shop2shop: 200,
      account: 100
    };
  };

  const getShiftRefundBreakdown = (shiftId: number) => {
    // Mock implementation
    return {
      cash: 50,
      shop2shop: 25
    };
  };

  const getLowStockProducts = (limit: number): Product[] => {
    return products.filter(p => (p.stock || 0) <= 5).slice(0, limit);
  };

  const calculateExpectedCashInDrawer = (shiftId: number): number => {
    // Mock implementation
    return 1000;
  };

  const value: AppContextType = {
    currentUser,
    currentShift,
    currentMode,
    products,
    customers,
    cart,
    login,
    logout,
    startShift,
    endShift,
    toggleMode,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    markCustomerAsPaid,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    processTransaction,
    processRefund,
    getLastShiftEndFloat,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    getLowStockProducts,
    calculateExpectedCashInDrawer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
