
import { User, Product, Shift, Transaction, Customer, Refund } from '../types';

export interface StoreData {
  users: User[];
  products: Product[];
  customers: Customer[];
  shifts: Shift[];
  transactions: Transaction[];
  refunds: Refund[];
}

export interface IdCounter {
  shift: number;
  transaction: number;
  product: number;
  customer: number;
  refund: number;
}

// Abstract base store class that other stores will extend
export abstract class BaseStore<T> {
  protected items: T[] = [];

  getAll(): T[] {
    return [...this.items];
  }

  // Additional methods can be added here as needed
}
