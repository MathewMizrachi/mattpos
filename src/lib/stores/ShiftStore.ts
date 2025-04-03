
import { Shift } from '../types';
import { BaseStore } from './BaseStore';

class ShiftStore extends BaseStore<Shift> {
  private currentId: number = 1;

  add(shift: Omit<Shift, 'id'>): Shift {
    const newShift = {
      ...shift,
      id: this.currentId++,
    };
    this.items.push(newShift);
    return newShift;
  }
  
  update(id: number, updates: Partial<Omit<Shift, 'id'>>): Shift | null {
    const index = this.items.findIndex(shift => shift.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  findById(id: number): Shift | undefined {
    return this.items.find(shift => shift.id === id);
  }

  findActive(): Shift | undefined {
    return this.items.find(shift => !shift.endTime);
  }

  findLastCompleted(): Shift | undefined {
    const completedShifts = this.items.filter(shift => shift.endTime);
    if (completedShifts.length === 0) return undefined;
    
    return completedShifts.sort((a, b) => 
      new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime()
    )[0];
  }
}

// Create a singleton instance
const shiftStore = new ShiftStore();
export default shiftStore;
