
import dataStore from './DataStore';
import { Shift, Transaction, Refund } from '../types';
import transactionService from './TransactionService';
import inventoryService from './InventoryService';

class ShiftService {
  startShift(userId: number, startFloat: number): Shift {
    const newShift = {
      userId,
      startTime: new Date(),
      startFloat,
      salesTotal: 0,
      transactionCount: 0,
    };
    
    return dataStore.addShift(newShift);
  }

  getCurrentShift(): Shift | null {
    const shifts = dataStore.getShifts();
    return shifts.find(shift => !shift.endTime) || null;
  }

  getLastShift(): Shift | null {
    const shifts = dataStore.getShifts();
    if (shifts.length <= 1) return null;
    
    const completedShifts = shifts.filter(shift => shift.endTime);
    if (completedShifts.length === 0) return null;
    
    return completedShifts.sort((a, b) => 
      new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime()
    )[0];
  }

  getLastShiftEndFloat(): number | null {
    const lastShift = this.getLastShift();
    return lastShift?.endFloat !== undefined ? lastShift.endFloat : null;
  }

  endShift(shiftId: number, endFloat: number): Shift | null {
    const shift = dataStore.getShifts().find(s => s.id === shiftId);
    if (!shift) return null;
    
    // Calculate shift totals
    const shiftTransactions = transactionService.getShiftTransactions(shiftId);
    const sales = shiftTransactions.filter(t => !t.isRefund).reduce((sum, t) => sum + t.total, 0);
    const refundsTotal = shiftTransactions.filter(t => t.isRefund).reduce((sum, t) => sum + t.total, 0);
    const salesTotal = sales - refundsTotal;
    const transactionCount = shiftTransactions.length;
    
    // Update the shift
    const updatedShift = {
      ...shift,
      endTime: new Date(),
      endFloat,
      salesTotal,
      transactionCount,
    };
    
    return dataStore.updateShift(shiftId, updatedShift);
  }

  getShiftPaymentBreakdown(shiftId: number) {
    const transactions = transactionService.getShiftTransactions(shiftId);
    
    const breakdown = {
      cash: 0,
      card: 0,
      shop2shop: 0,
      account: 0
    };
    
    transactions.forEach(t => {
      if (t.isRefund) {
        // For refunds, subtract from the appropriate payment method
        if (t.paymentMethod === 'cash') breakdown.cash -= t.total;
        if (t.paymentMethod === 'card') breakdown.card -= t.total;
        if (t.paymentMethod === 'shop2shop') breakdown.shop2shop -= t.total;
        if (t.paymentMethod === 'account') breakdown.account -= t.total;
      } else if (t.paymentMethod === 'split' && t.splitPayments) {
        // For split payments, add to each method
        t.splitPayments.forEach(sp => {
          if (sp.method === 'cash') breakdown.cash += sp.amount;
          if (sp.method === 'card') breakdown.card += sp.amount;
          if (sp.method === 'shop2shop') breakdown.shop2shop += sp.amount;
          if (sp.method === 'account') breakdown.account += sp.amount;
        });
      } else {
        // For regular payments
        if (t.paymentMethod === 'cash') breakdown.cash += t.total;
        if (t.paymentMethod === 'card') breakdown.card += t.total;
        if (t.paymentMethod === 'shop2shop') breakdown.shop2shop += t.total;
        if (t.paymentMethod === 'account') breakdown.account += t.total;
      }
    });
    
    return breakdown;
  }

  getShiftRefundBreakdown(shiftId: number) {
    const refunds = transactionService.getShiftRefunds(shiftId);
    
    const items = refunds.map(refund => {
      const product = inventoryService.getProduct(refund.productId);
      return {
        productId: refund.productId,
        productName: product ? product.name : `Product #${refund.productId}`,
        quantity: refund.quantity,
        amount: refund.amount
      };
    });
    
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    
    return { total, items };
  }

  calculateExpectedCashInDrawer(shiftId: number): number {
    const shift = dataStore.getShifts().find(s => s.id === shiftId);
    if (!shift) return 0;
    
    const paymentBreakdown = this.getShiftPaymentBreakdown(shiftId);
    
    // Cash in drawer should be: starting float + cash payments - cash refunds - change given
    const cashTransactions = transactionService.getShiftTransactions(shiftId).filter(
      t => t.shiftId === shiftId && (t.paymentMethod === 'cash' || (t.paymentMethod === 'split' && t.splitPayments?.some(sp => sp.method === 'cash')))
    );
    
    const changeGiven = cashTransactions
      .filter(t => !t.isRefund)
      .reduce((sum, t) => sum + t.change, 0);
    
    return shift.startFloat + paymentBreakdown.cash - changeGiven;
  }
}

// Create a singleton instance
const shiftService = new ShiftService();
export default shiftService;
