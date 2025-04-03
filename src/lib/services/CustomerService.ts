
import dataStore from './DataStore';
import { Customer } from '../types';

class CustomerService {
  getAllCustomers(): Customer[] {
    return dataStore.getCustomers();
  }

  getCustomer(id: number): Customer | undefined {
    return this.getAllCustomers().find(customer => customer.id === id);
  }

  getCustomerByPhone(phone: string): Customer | undefined {
    return this.getAllCustomers().find(customer => customer.phone === phone);
  }

  addCustomer(name: string, phone: string, idNumber?: string, paymentTermDays?: number): Customer {
    // Check if customer already exists
    const existingCustomer = this.getCustomerByPhone(phone);
    if (existingCustomer) {
      // Update the customer info if it changed
      const updatedCustomer = {
        ...existingCustomer,
        name,
        idNumber: idNumber || existingCustomer.idNumber,
        paymentTermDays: paymentTermDays || existingCustomer.paymentTermDays,
        updatedAt: new Date()
      };
      
      dataStore.updateCustomer(existingCustomer.id, updatedCustomer);
      return updatedCustomer;
    }

    // Create new customer
    const newCustomer: Omit<Customer, 'id'> = {
      name,
      phone,
      idNumber,
      paymentTermDays,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPaid: false
    };
    
    return dataStore.addCustomer(newCustomer);
  }

  markCustomerAsPaid(customerId: number): boolean {
    const customer = this.getCustomer(customerId);
    if (!customer) return false;
    
    const updated = dataStore.updateCustomer(customerId, {
      isPaid: true,
      updatedAt: new Date()
    });
    
    return !!updated;
  }
}

// Create a singleton instance
const customerService = new CustomerService();
export default customerService;
