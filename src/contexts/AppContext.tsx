
import React, { createContext, useContext, useState, ReactNode } from 'react';
import db from '@/lib/db';
import { SplitPaymentDetails, Shift, Product, CartItem, User, Customer } from '@/types';

interface PaymentBreakdown {
  cash: number;
  card: number;
  shop2shop: number;
  account: number;
}

interface RefundBreakdown {
  total: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    amount: number;
  }[];
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
  endShift: (endFloat: number) => Shift | null;
  getLastShiftEndFloat: () => number | null;
  
  addToCart: (product: Product, quantity?: number, customPrice?: number) => void;
  updateCartItem: (productId: number, quantity: number, price?: number) => void;
  removeFromCart: (productId: number, price?: number) => void;
  clearCart: () => void;
  
  processPayment: (cashReceived: number, paymentMethod?: 'cash' | 'card' | 'shop2shop' | 'account' | 'split', customerName?: string, customerPhone?: string, splitPayments?: SplitPaymentDetails[]) => {
    success: boolean;
    change: number;
  };
  
  processRefund: (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop') => boolean;
  
  getShiftPaymentBreakdown: (shiftId: number) => PaymentBreakdown;
  getShiftRefundBreakdown: (shiftId: number) => RefundBreakdown;
  getLowStockProducts: (threshold?: number) => Product[];
  calculateExpectedCashInDrawer: (shiftId: number) => number;
  
  addCustomer: (name: string, phone: string, idNumber?: string, paymentTermDays?: number) => Customer;
  getCustomers: () => Customer[];
  markCustomerAsPaid: (customerId: number) => boolean;
  
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

  const endShift = (endFloat: number) => {
    if (!currentShift) return null;
    
    const completedShift = db.endShift(currentShift.id, endFloat);
    setCurrentShift(null);
    return completedShift;
  };

  const getLastShiftEndFloat = (): number | null => {
    return db.getLastShiftEndFloat();
  };

  const addToCart = (product: Product, quantity = 1, customPrice?: number) => {
    // If a custom price is provided, use it instead of the product's default price
    const productToAdd = customPrice !== undefined ? { ...product, price: customPrice } : product;
    
    setCart(prevCart => {
      // Check if this product (with same price) is already in the cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === productToAdd.id && 
        item.product.price === productToAdd.price
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        return prevCart.map((item, index) => 
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Check if this product (with different price) is in the cart
        const sameProductDifferentPrice = prevCart.findIndex(item => 
          item.product.id === productToAdd.id && 
          item.product.price !== productToAdd.price
        );
        
        if (sameProductDifferentPrice >= 0) {
          // Remove all instances of this product and add with the new price and combined quantity
          const totalQuantity = prevCart.reduce((sum, item) => 
            item.product.id === productToAdd.id ? sum + item.quantity : sum, 0
          );
          
          const cartWithoutProduct = prevCart.filter(item => item.product.id !== productToAdd.id);
          return [...cartWithoutProduct, { product: productToAdd, quantity: totalQuantity + quantity }];
        } else {
          // Add new item to cart
          return [...prevCart, { product: productToAdd, quantity }];
        }
      }
    });
  };

  const updateCartItem = (productId: number, quantity: number, price?: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, price);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        (item.product.id === productId && 
        (price === undefined || item.product.price === price))
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number, price?: number) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.product.id === productId &&
        (price === undefined || item.product.price === price))
      )
    );
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

  const processRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop'): boolean => {
    if (!currentShift) return false;
    
    const amount = product.price * quantity;
    
    db.createRefund(
      currentShift.id,
      product.id,
      quantity,
      amount,
      refundMethod
    );
    
    const updatedShift = db.getCurrentShift();
    if (updatedShift) {
      setCurrentShift(updatedShift);
    }
    
    refreshProducts();
    
    return true;
  };

  const getShiftPaymentBreakdown = (shiftId: number): PaymentBreakdown => {
    return db.getShiftPaymentBreakdown(shiftId);
  };

  const getShiftRefundBreakdown = (shiftId: number): RefundBreakdown => {
    return db.getShiftRefundBreakdown(shiftId);
  };

  const getLowStockProducts = (threshold?: number): Product[] => {
    return db.getLowStockProducts(threshold);
  };

  const calculateExpectedCashInDrawer = (shiftId: number): number => {
    return db.calculateExpectedCashInDrawer(shiftId);
  };

  const addCustomer = (name: string, phone: string, idNumber?: string, paymentTermDays?: number): Customer => {
    const customer = db.addCustomer(name, phone, idNumber, paymentTermDays);
    refreshCustomers();
    return customer;
  };

  const getCustomers = (): Customer[] => {
    return customers;
  };
  
  const markCustomerAsPaid = (customerId: number): boolean => {
    const success = db.markCustomerAsPaid(customerId);
    if (success) {
      refreshCustomers();
    }
    return success;
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
