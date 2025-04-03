
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PaymentFooterProps {
  total: number;
  cartLength: number;
  onClearCart: () => void;
  onShowPaymentForm: () => void;
  isMobile: boolean;
}

const PaymentFooter: React.FC<PaymentFooterProps> = ({
  total,
  cartLength,
  onClearCart,
  onShowPaymentForm,
  isMobile
}) => {
  return (
    <div className={`${isMobile 
      ? 'fixed bottom-0 right-0 w-full px-6 py-2 flex flex-col items-center justify-center' 
      : 'fixed bottom-0 right-0 w-96 px-6 py-2'} 
      z-20`} 
      style={{ backgroundColor: '#FAA225' }}
    >
      <div className="flex justify-between w-full mb-1">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold">{formatCurrency(total)}</span>
      </div>
      
      <div className="flex space-x-4 w-full mb-2">
        {cartLength > 0 && (
          <Button 
            variant="outline" 
            className="flex-1 max-w-[48%]"
            onClick={onClearCart}
            style={{ 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '0.875rem', 
              fontWeight: 'bold',
              border: '2px solid #FAA225',
              height: '2.5rem'
            }}
          >
            Clear Cart
          </Button>
        )}
        <Button 
          className={`flex-1 max-w-[48%] ${cartLength > 0 ? '' : 'w-full'}`}
          size="lg"
          disabled={cartLength === 0}
          onClick={onShowPaymentForm}
          style={{ 
            height: '2.5rem',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
};

export default PaymentFooter;
