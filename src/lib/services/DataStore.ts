
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

import userStore from '../stores/UserStore';
import productStore from '../stores/ProductStore';
import customerStore from '../stores/CustomerStore';
import shiftStore from '../stores/ShiftStore';
import transactionStore from '../stores/TransactionStore';
import refundStore from '../stores/RefundStore';

/**
 * DataStore manages all in-memory data for the application
 * This is now a facade that delegates to the specialized stores
 */
class DataStore {
  // Getters for all data types
  getUsers(): User[] {
    return userStore.getAll();
  }

  getProducts(): Product[] {
    return productStore.getAll();
  }
  
  getCustomers(): Customer[] {
    return customerStore.getAll();
  }
  
  getShifts(): Shift[] {
    return shiftStore.getAll();
  }
  
  getTransactions(): Transaction[] {
    return transactionStore.getAll();
  }
  
  getRefunds(): Refund[] {
    return refundStore.getAll();
  }

  // Methods to update data
  
  // Users
  addUser(user: Omit<User, 'id'>): User {
    return userStore.add(user);
  }
  
  // Products
  addProduct(product: Omit<Product, 'id'>): Product {
    return productStore.add(product);
  }
  
  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    return productStore.update(id, updates);
  }
  
  deleteProduct(id: number): boolean {
    return productStore.delete(id);
  }
  
  // Customers
  addCustomer(customer: Omit<Customer, 'id'>): Customer {
    return customerStore.add(customer);
  }
  
  updateCustomer(id: number, updates: Partial<Omit<Customer, 'id'>>): Customer | null {
    return customerStore.update(id, updates);
  }
  
  // Shifts
  addShift(shift: Omit<Shift, 'id'>): Shift {
    return shiftStore.add(shift);
  }
  
  updateShift(id: number, updates: Partial<Omit<Shift, 'id'>>): Shift | null {
    return shiftStore.update(id, updates);
  }
  
  // Transactions
  addTransaction(transaction: Omit<Transaction, 'id'>): Transaction {
    return transactionStore.add(transaction);
  }
  
  // Refunds
  addRefund(refund: Omit<Refund, 'id'>): Refund {
    return refundStore.add(refund);
  }
}

// Create a singleton instance
const dataStore = new DataStore();
export default dataStore;
