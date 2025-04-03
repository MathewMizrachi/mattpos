
import db from '@/lib/db';
import { Product, SplitPaymentDetails } from '@/types';

export const useTransactions = (
  currentShiftId: number | null, 
  refreshProducts: () => void,
  refreshCustomers: () => void
) => {
  const processPayment = (
    cashReceived: number, 
    paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split' = 'cash',
    customerName?: string,
    customerPhone?: string,
    splitPayments?: SplitPaymentDetails[]
  ) => {
    if (!currentShiftId) {
      return { success: false, change: 0 };
    }
    
    // Get items from cart in the expected format for db
    const items = [] as { productId: number; quantity: number; unitPrice: number; }[];
    
    // This is just a placeholder since we don't have direct access to cart here
    // The actual implementation will be in the AppContext
    
    let customerId: number | undefined;
    
    if ((paymentMethod === 'account' || (paymentMethod === 'split' && splitPayments?.some(p => p.method === 'account'))) 
        && customerName && customerPhone) {
      const customerIdNumber = splitPayments?.find(p => p.method === 'account')?.customerIdNumber;
      const paymentTermDays = splitPayments?.find(p => p.method === 'account')?.paymentTermDays;
      
      // This is a placeholder - actual customer creation will be handled in AppContext
      customerId = undefined;
    }
    
    const dbSplitPayments = splitPayments?.map(payment => ({
      method: payment.method,
      amount: payment.amount
    }));
    
    // This is a mock to match the expected interface
    // Actual implementation will be in AppContext
    return { success: false, change: 0 };
  };

  const processRefund = (product: Product, quantity: number, refundMethod: 'cash' | 'shop2shop'): boolean => {
    if (!currentShiftId) return false;
    
    const amount = product.price * quantity;
    
    db.createRefund(
      currentShiftId,
      product.id,
      quantity,
      amount,
      refundMethod
    );
    
    refreshProducts();
    
    return true;
  };

  return {
    processPayment,
    processRefund
  };
};
