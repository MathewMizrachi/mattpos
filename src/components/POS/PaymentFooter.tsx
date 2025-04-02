
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
      ? 'fixed bottom-0 right-0 w-full px-6 py-4 flex flex-col items-center justify-center' 
      : 'fixed bottom-0 right-0 w-96 px-6 py-4'} 
      border-t shadow-lg z-20`} 
      style={{ backgroundColor: '#FAA225' }}>
      <div className="flex justify-between w-full mb-4">
        <span className="text-xl font-semibold">Total</span>
        <span className="text-3xl font-bold">{formatCurrency(total)}</span>
      </div>
      
      <div className="flex space-x-4 w-full">
        {cartLength > 0 && (
          <Button 
            variant="outline" 
            className="flex-1 max-w-[48%]"
            onClick={onClearCart}
            style={{ 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              border: '2px solid #FAA225',
              height: '3rem'
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
            height: '3rem',
            fontSize: '1rem',
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
