
import { Refund } from '../types';
import { BaseStore } from './BaseStore';

class RefundStore extends BaseStore<Refund> {
  private currentId: number = 1;

  add(refund: Omit<Refund, 'id'>): Refund {
    const newRefund = {
      ...refund,
      id: this.currentId++,
    };
    this.items.push(newRefund);
    return newRefund;
  }

  findByShiftId(shiftId: number): Refund[] {
    return this.items.filter(refund => refund.shiftId === shiftId);
  }
}

// Create a singleton instance
const refundStore = new RefundStore();
export default refundStore;
