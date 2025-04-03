
import { Transaction } from '../types';
import { BaseStore } from './BaseStore';

class TransactionStore extends BaseStore<Transaction> {
  private currentId: number = 1;

  add(transaction: Omit<Transaction, 'id'>): Transaction {
    const newTransaction = {
      ...transaction,
      id: this.currentId++,
    };
    this.items.push(newTransaction);
    return newTransaction;
  }

  findByShiftId(shiftId: number): Transaction[] {
    return this.items.filter(transaction => transaction.shiftId === shiftId);
  }
}

// Create a singleton instance
const transactionStore = new TransactionStore();
export default transactionStore;
