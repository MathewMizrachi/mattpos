
import { CartItem, Customer, Product, Shift, SplitPaymentDetails, User } from '@/types';

export interface PaymentBreakdown {
  cash: number;
  card: number;
  shop2shop: number;
  account: number;
}

export interface RefundBreakdown {
  total: number;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    amount: number;
  }[];
}

export interface AppContextType {
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
