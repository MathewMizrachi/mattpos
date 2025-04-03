
import dataStore from './DataStore';
import { 
  Transaction, 
  Refund, 
  TransactionItem, 
  SplitPaymentDetail 
} from '../types';
import inventoryService from './InventoryService';

class TransactionService {
  getShiftTransactions(shiftId: number): Transaction[] {
    return dataStore.getTransactions().filter(t => t.shiftId === shiftId);
  }

  getShiftRefunds(shiftId: number): Refund[] {
    return dataStore.getRefunds().filter(r => r.shiftId === shiftId);
  }

  createTransaction(
    shiftId: number, 
    items: TransactionItem[], 
    cashReceived: number, 
    paymentMethod: 'cash' | 'card' | 'shop2shop' | 'account' | 'split' = 'cash', 
    customerId?: number, 
    splitPayments?: SplitPaymentDetail[], 
    isRefund: boolean = false
  ): Transaction {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const change = paymentMethod === 'cash' ? cashReceived - total : 0;
    
    const newTransaction: Omit<Transaction, 'id'> = {
      shiftId,
      timestamp: new Date(),
      total,
      items,
      cashReceived,
      change,
      paymentMethod,
      customerId,
      splitPayments,
      isRefund
    };
    
    const transaction = dataStore.addTransaction(newTransaction);
    
    // Update product stock
    items.forEach(item => {
      const product = inventoryService.getProduct(item.productId);
      if (product && product.stock !== undefined) {
        inventoryService.updateProduct(
          item.productId, 
          { stock: (product.stock || 0) + (isRefund ? item.quantity : -item.quantity) }
        );
      }
    });
    
    return transaction;
  }

  createRefund(
    shiftId: number, 
    productId: number, 
    quantity: number, 
    amount: number, 
    method: 'cash' | 'shop2shop'
  ): Refund {
    const newRefund: Omit<Refund, 'id'> = {
      shiftId,
      timestamp: new Date(),
      productId,
      quantity,
      amount,
      method
    };
    
    const refund = dataStore.addRefund(newRefund);
    
    // Create a transaction for this refund
    const product = inventoryService.getProduct(productId);
    if (product) {
      this.createTransaction(
        shiftId,
        [{ productId, quantity, unitPrice: product.price }],
        amount,
        method,
        undefined,
        undefined,
        true
      );
    }
    
    return refund;
  }
}

// Create a singleton instance
const transactionService = new TransactionService();
export default transactionService;
