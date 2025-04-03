
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  salesTotal?: number;
  transactionCount?: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SplitPaymentDetails {
  method: 'cash' | 'card' | 'shop2shop' | 'account';
  amount: number;
  customerName?: string;
  customerPhone?: string;
}
