
import db from '@/lib/db';
import { Product, SplitPaymentDetails } from '@/types';

export function useTransaction(
  getCurrentShiftId: () => number | null,
  refreshProducts: () => void,
  refreshCustomers: () => void,
  clearCart: () => void,
  addCustomer: (name: string, phone: string, idNumber?: string, paymentTermDays?: number) => any,
  updateShift: () => void
) {
  const processPayment = (
    cashReceived: number, 
    paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split' = 'cash',
    customerName?: string,
    customerPhone?: string,
    splitPayments?: SplitPaymentDetails[]
  ) => {
    const shiftId = getCurrentShiftId();
    if (!shiftId) {
      return { success: false, change: 0 };
    }
    
    const items = [];
    // Cart is passed in processPayment call from the context
    // This hook doesn't have direct cart access for separation of concerns
    
    let customerId: number | undefined;
    
    if ((paymentMethod === 'account' || (paymentMethod === 'split' && splitPayments?.some(p => p.method === 'account'))) 
        && customerName && customerPhone) {
      const customerIdNumber = splitPayments?.find(p => p.method === 'account')?.customerIdNumber;
      const paymentTermDays = splitPayments?.find(p => p.method === 'account')?.paymentTermDays;
      const customer = addCustomer(customerName, customerPhone, customerIdNumber, paymentTermDays);
      customerId = customer.id;
    }
    
    const dbSplitPayments = splitPayments?.map(payment => ({
      method: payment.method,
      amount: payment.amount
    }));
    
    const transaction = db.createTransaction(
      shiftId, 
      items, 
      cashReceived, 
      paymentMethod, 
      customerId,
      dbSplitPayments
    );
    
    updateShift();
    refreshProducts();
    refreshCustomers();
    clearCart();
    
    return { 
      success: true, 
      change: transaction.change
    };
  };

  const processRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop'): boolean => {
    const shiftId = getCurrentShiftId();
    if (!shiftId) return false;
    
    const amount = product.price * quantity;
    
    db.createRefund(
      shiftId,
      product.id,
      quantity,
      amount,
      refundMethod
    );
    
    updateShift();
    refreshProducts();
    
    return true;
  };

  return {
    processPayment,
    processRefund
  };
}
