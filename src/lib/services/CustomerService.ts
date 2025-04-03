
import customerStore from '../stores/CustomerStore';
import { Customer } from '../types';

class CustomerService {
  getAllCustomers(): Customer[] {
    return customerStore.getAll();
  }

  getCustomer(id: number): Customer | undefined {
    return customerStore.findById(id);
  }

  getCustomerByPhone(phone: string): Customer | undefined {
    return customerStore.findByPhone(phone);
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
      
      customerStore.update(existingCustomer.id, updatedCustomer);
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
    
    return customerStore.add(newCustomer);
  }

  markCustomerAsPaid(customerId: number): boolean {
    const customer = this.getCustomer(customerId);
    if (!customer) return false;
    
    const updated = customerStore.update(customerId, {
      isPaid: true,
      updatedAt: new Date()
    });
    
    return !!updated;
  }
}

// Create a singleton instance
const customerService = new CustomerService();
export default customerService;
