
import { 
  User, 
  Product, 
  Shift, 
  Transaction, 
  Customer, 
  Refund, 
  SplitPaymentDetail,
  TransactionItem 
} from '../types';

/**
 * DataStore manages all in-memory data for the application
 */
class DataStore {
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
  private refunds: Refund[] = [];

  // Counters for generating IDs
  private currentId = {
    shift: 1,
    transaction: 1,
    product: 13,
    customer: 1,
    refund: 1,
  };

  // Getters for all data types
  getUsers(): User[] {
    return [...this.users];
  }

  getProducts(): Product[] {
    return [...this.products];
  }
  
  getCustomers(): Customer[] {
    return [...this.customers];
  }
  
  getShifts(): Shift[] {
    return [...this.shifts];
  }
  
  getTransactions(): Transaction[] {
    return [...this.transactions];
  }
  
  getRefunds(): Refund[] {
    return [...this.refunds];
  }

  // Methods to update data
  
  // Users
  addUser(user: Omit<User, 'id'>): User {
    const newUser = {
      ...user,
      id: this.users.length + 1
    };
    this.users.push(newUser);
    return newUser;
  }
  
  // Products
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
  
  // Customers
  addCustomer(customer: Omit<Customer, 'id'>): Customer {
    const newCustomer = {
      ...customer,
      id: this.currentId.customer++,
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }
  
  updateCustomer(id: number, updates: Partial<Omit<Customer, 'id'>>): Customer | null {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index === -1) return null;
    
    this.customers[index] = { ...this.customers[index], ...updates };
    return this.customers[index];
  }
  
  // Shifts
  addShift(shift: Omit<Shift, 'id'>): Shift {
    const newShift = {
      ...shift,
      id: this.currentId.shift++,
    };
    this.shifts.push(newShift);
    return newShift;
  }
  
  updateShift(id: number, updates: Partial<Omit<Shift, 'id'>>): Shift | null {
    const index = this.shifts.findIndex(shift => shift.id === id);
    if (index === -1) return null;
    
    this.shifts[index] = { ...this.shifts[index], ...updates };
    return this.shifts[index];
  }
  
  // Transactions
  addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction = {
      ...transaction,
      id: this.currentId.transaction++,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }
  
  // Refunds
  addRefund(refund: Omit<Refund, 'id'>): Refund {
    const newRefund = {
      ...refund,
      id: this.currentId.refund++,
    };
    this.refunds.push(newRefund);
    return newRefund;
  }
}

// Create a singleton instance
const dataStore = new DataStore();
export default dataStore;
