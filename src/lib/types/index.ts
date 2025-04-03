
export interface User {
  id: number;
  name: string;
  pin: string;
  role: 'manager' | 'staff';
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

export interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  endFloat?: number;
  salesTotal?: number;
  transactionCount?: number;
}

export interface Transaction {
  id: number;
  shiftId: number;
  timestamp: Date;
  total: number;
  items: TransactionItem[];
  cashReceived: number;
  change: number;
  paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split';
  customerId?: number;
  splitPayments?: SplitPaymentDetail[];
  isRefund?: boolean;
}

export interface SplitPaymentDetail {
  method: 'cash' | 'card' | 'shop2shop' | 'account';
  amount: number;
}

export interface TransactionItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Refund {
  id: number;
  shiftId: number;
  timestamp: Date;
  productId: number;
  quantity: number;
  amount: number;
  method: 'cash' | 'shop2shop';
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  idNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentTermDays?: number;
  isPaid?: boolean;
}

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
