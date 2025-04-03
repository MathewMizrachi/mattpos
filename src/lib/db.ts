
// Simple in-memory database for demonstration purposes
// In a real application, this would use IndexedDB or SQLite

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

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  salesTotal?: number;
  transactionCount?: number;
}

interface Transaction {
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
}

interface SplitPaymentDetail {
  method: 'cash' | 'card' | 'shop2shop' | 'account';
  amount: number;
}

interface TransactionItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  idNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  paymentTermDays?: number;
  isPaid?: boolean;
}

class Database {
  private users: User[] = [
    { id: 1, name: 'Owner', pin: '1234', role: 'manager' },
    { id: 2, name: 'Staff 1', pin: '5678', role: 'staff' },
  ];

  private products: Product[] = [
    { id: 1, name: 'Bread', price: 15, stock: 20 },
    { id: 2, name: 'Milk', price: 22, stock: 15 },
    { id: 3, name: 'Eggs (6)', price: 25, stock: 10 },
    { id: 4, name: 'Rice 1kg', price: 30, stock: 25 },
    { id: 5, name: 'Maize Meal 2kg', price: 35, stock: 18 },
    { id: 6, name: 'Cooking Oil 750ml', price: 45, stock: 12 },
    { id: 7, name: 'Sugar 1kg', price: 28, stock: 20 },
    { id: 8, name: 'Tea Bags (40)', price: 32, stock: 15 },
    { id: 9, name: 'Airtime R10', price: 10, stock: 999 },
    { id: 10, name: 'Airtime R20', price: 20, stock: 999 },
    { id: 11, name: 'Airtime R50', price: 50, stock: 999 },
    { id: 12, name: 'Data 1GB', price: 85, stock: 999 },
  ];

  private customers: Customer[] = [];
  private shifts: Shift[] = [];
  private transactions: Transaction[] = [];
  private currentId = {
    shift: 1,
    transaction: 1,
    product: 13,
    customer: 1,
  };

  // User methods
  authenticateUser(pin: string): User | null {
    return this.users.find(user => user.pin === pin) || null;
  }

  // Product methods
  getAllProducts(): Product[] {
    return [...this.products];
  }

  getProduct(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    const newProduct = {
      ...product,
      id: this.currentId.product++,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    return initialLength !== this.products.length;
  }

  // Customer methods
  getAllCustomers(): Customer[] {
    return [...this.customers];
  }

  getCustomer(id: number): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  getCustomerByPhone(phone: string): Customer | undefined {
    return this.customers.find(customer => customer.phone === phone);
  }

  addCustomer(name: string, phone: string, idNumber?: string, paymentTermDays?: number): Customer {
    // Check if customer already exists
    const existingCustomer = this.getCustomerByPhone(phone);
    if (existingCustomer) {
      // Update the customer info if it changed
      existingCustomer.name = name;
      if (idNumber) existingCustomer.idNumber = idNumber;
      if (paymentTermDays) existingCustomer.paymentTermDays = paymentTermDays;
      existingCustomer.updatedAt = new Date();
      return existingCustomer;
    }

    // Create new customer
    const newCustomer: Customer = {
      id: this.currentId.customer++,
      name,
      phone,
      idNumber,
      paymentTermDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPaid: false
    };
    
    this.customers.push(newCustomer);
    return newCustomer;
  }

  markCustomerAsPaid(customerId: number): boolean {
    const customerIndex = this.customers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) return false;
    
    this.customers[customerIndex] = {
      ...this.customers[customerIndex],
      isPaid: true,
      updatedAt: new Date()
    };
    
    return true;
  }

  // Shift methods
  startShift(userId: number, startFloat: number): Shift {
    const newShift = {
      id: this.currentId.shift++,
      userId,
      startTime: new Date(),
      startFloat,
      salesTotal: 0,
      transactionCount: 0,
    };
    this.shifts.push(newShift);
    return newShift;
  }

  getCurrentShift(): Shift | null {
    return this.shifts.find(shift => !shift.endTime) || null;
  }

  endShift(shiftId: number): Shift | null {
    const index = this.shifts.findIndex(shift => shift.id === shiftId);
    if (index === -1) return null;
    
    // Calculate shift totals
    const shiftTransactions = this.transactions.filter(t => t.shiftId === shiftId);
    const salesTotal = shiftTransactions.reduce((sum, t) => sum + t.total, 0);
    const transactionCount = shiftTransactions.length;
    
    this.shifts[index] = { 
      ...this.shifts[index], 
      endTime: new Date(),
      salesTotal,
      transactionCount,
    };
    
    return this.shifts[index];
  }

  // Transaction methods
  createTransaction(shiftId: number, items: TransactionItem[], cashReceived: number, paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split' = 'cash', customerId?: number, splitPayments?: SplitPaymentDetail[]): Transaction {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const change = paymentMethod === 'cash' ? cashReceived - total : 0;
    
    const newTransaction = {
      id: this.currentId.transaction++,
      shiftId,
      timestamp: new Date(),
      total,
      items,
      cashReceived,
      change,
      paymentMethod,
      customerId,
      splitPayments
    };
    
    this.transactions.push(newTransaction);
    
    // Update shift totals
    const shiftIndex = this.shifts.findIndex(shift => shift.id === shiftId);
    if (shiftIndex !== -1) {
      const currentTotal = this.shifts[shiftIndex].salesTotal || 0;
      const currentCount = this.shifts[shiftIndex].transactionCount || 0;
      
      this.shifts[shiftIndex] = {
        ...this.shifts[shiftIndex],
        salesTotal: currentTotal + total,
        transactionCount: currentCount + 1,
      };
    }
    
    // Update product stock
    items.forEach(item => {
      const productIndex = this.products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1 && this.products[productIndex].stock !== undefined) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          stock: (this.products[productIndex].stock || 0) - item.quantity,
        };
      }
    });
    
    return newTransaction;
  }

  getShiftTransactions(shiftId: number): Transaction[] {
    return this.transactions.filter(t => t.shiftId === shiftId);
  }
}

// Create a singleton instance
const db = new Database();
export default db;
