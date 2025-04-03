
import React from 'react';
import { formatCurrency } from '@/lib/utils';

interface TotalDisplayProps {
  total: number;
}

export const TotalDisplay: React.FC<TotalDisplayProps> = ({ total }) => {
  return (
    <div className="text-center mb-4">
      <h2 className="text-3xl font-bold">Total to Pay</h2>
      <p className="text-5xl mt-2 font-extrabold">{formatCurrency(total)}</p>
    </div>
  );
};
