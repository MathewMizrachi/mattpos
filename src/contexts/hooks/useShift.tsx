
import { useState } from 'react';
import db from '@/lib/db';
import { Shift } from '@/types';

export const useShift = () => {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);

  const startShift = (userId: number, startFloat: number) => {
    const shift = db.startShift(userId, startFloat);
    setCurrentShift(shift);
  };

  const endShift = (endFloat: number) => {
    if (!currentShift) return null;
    
    const completedShift = db.endShift(currentShift.id, endFloat);
    setCurrentShift(null);
    return completedShift;
  };

  const getLastShiftEndFloat = (): number | null => {
    return db.getLastShiftEndFloat();
  };

  const getShiftPaymentBreakdown = (shiftId: number) => {
    return db.getShiftPaymentBreakdown(shiftId);
  };

  const getShiftRefundBreakdown = (shiftId: number) => {
    return db.getShiftRefundBreakdown(shiftId);
  };

  const calculateExpectedCashInDrawer = (shiftId: number): number => {
    return db.calculateExpectedCashInDrawer(shiftId);
  };

  // Initialize the current shift on hook creation
  const initializeShift = () => {
    const activeShift = db.getCurrentShift();
    if (activeShift) {
      setCurrentShift(activeShift);
    }
  };

  return {
    currentShift,
    startShift,
    endShift,
    getLastShiftEndFloat,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    calculateExpectedCashInDrawer,
    initializeShift
  };
};
