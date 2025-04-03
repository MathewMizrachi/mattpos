
import { useState } from 'react';
import db from '@/lib/db';
import { Shift } from '@/types';
import { PaymentBreakdown, RefundBreakdown } from '../types';

export function useShift() {
  const [currentShift, setCurrentShift] = useState<Shift | null>(db.getCurrentShift());

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

  const getShiftPaymentBreakdown = (shiftId: number): PaymentBreakdown => {
    return db.getShiftPaymentBreakdown(shiftId);
  };

  const getShiftRefundBreakdown = (shiftId: number): RefundBreakdown => {
    return db.getShiftRefundBreakdown(shiftId);
  };

  const calculateExpectedCashInDrawer = (shiftId: number): number => {
    return db.calculateExpectedCashInDrawer(shiftId);
  };

  return {
    currentShift,
    startShift,
    endShift,
    getLastShiftEndFloat,
    getShiftPaymentBreakdown,
    getShiftRefundBreakdown,
    calculateExpectedCashInDrawer,
    setCurrentShift
  };
}
