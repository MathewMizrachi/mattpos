
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  salesTotal?: number;
  transactionCount?: number;
}

interface ShiftSummaryProps {
  shift: Shift;
  onClose: () => void;
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({ shift, onClose }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };
  
  const calculateShiftDuration = () => {
    const start = new Date(shift.startTime);
    const end = shift.endTime ? new Date(shift.endTime) : new Date();
    
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  const expectedCash = (shift.startFloat || 0) + (shift.salesTotal || 0);
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Shift Summary</h2>
      </div>
      
      <div className="bg-secondary p-4 rounded-md mb-6 space-y-2">
        <div className="flex justify-between">
          <span>Start Time:</span>
          <span>{formatDate(shift.startTime)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>End Time:</span>
          <span>{shift.endTime ? formatDate(shift.endTime) : 'Active'}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Duration:</span>
          <span>{calculateShiftDuration()}</span>
        </div>
        
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between">
            <span>Starting Float:</span>
            <span>{formatCurrency(shift.startFloat)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Total Sales:</span>
            <span>{formatCurrency(shift.salesTotal || 0)}</span>
          </div>
          
          <div className="flex justify-between font-bold">
            <span>Expected Cash in Drawer:</span>
            <span>{formatCurrency(expectedCash)}</span>
          </div>
        </div>
        
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between">
            <span>Transaction Count:</span>
            <span>{shift.transactionCount || 0}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ShiftSummary;
