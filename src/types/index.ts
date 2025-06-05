
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
  barcode?: string;
  stockCode?: string;
  linkCode?: string;
  avgCostIncl?: number;
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
  endFloat?: number;
  salesTotal?: number;
  transactionCount?: number;
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

export interface SplitPaymentDetails {
  method: 'cash' | 'card' | 'shop2shop' | 'account';
  amount: number;
  customerName?: string;
  customerPhone?: string;
  customerIdNumber?: string;
  paymentTermDays?: number;
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

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Array<{
    id: number;
    name: string;
    quantity: number;
    unit: string;
    costPerUnit: number;
  }>;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  totalCost?: number;
  costPerServing?: number;
  isManualCost?: boolean;
}
