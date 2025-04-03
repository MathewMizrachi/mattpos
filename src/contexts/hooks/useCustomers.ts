
import { useState } from 'react';
import db from '@/lib/db';
import { Customer } from '@/types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const refreshCustomers = () => {
    setCustomers(db.getAllCustomers());
  };

  const addCustomer = (name: string, phone: string, idNumber?: string, paymentTermDays?: number): Customer => {
    const customer = db.addCustomer(name, phone, idNumber, paymentTermDays);
    refreshCustomers();
    return customer;
  };

  const getCustomers = (): Customer[] => {
    return customers;
  };
  
  const markCustomerAsPaid = (customerId: number): boolean => {
    const success = db.markCustomerAsPaid(customerId);
    if (success) {
      refreshCustomers();
    }
    return success;
  };

  return {
    customers,
    refreshCustomers,
    addCustomer,
    getCustomers,
    markCustomerAsPaid
  };
}
