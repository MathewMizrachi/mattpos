
import { Customer } from '../types';
import { BaseStore } from './BaseStore';

class CustomerStore extends BaseStore<Customer> {
  private currentId: number = 1;

  add(customer: Omit<Customer, 'id'>): Customer {
    const newCustomer = {
      ...customer,
      id: this.currentId++,
    };
    this.items.push(newCustomer);
    return newCustomer;
  }
  
  update(id: number, updates: Partial<Omit<Customer, 'id'>>): Customer | null {
    const index = this.items.findIndex(customer => customer.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  findById(id: number): Customer | undefined {
    return this.items.find(customer => customer.id === id);
  }

  findByPhone(phone: string): Customer | undefined {
    return this.items.find(customer => customer.phone === phone);
  }
}

// Create a singleton instance
const customerStore = new CustomerStore();
export default customerStore;
