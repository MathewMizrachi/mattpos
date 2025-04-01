
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
      ? 'fixed bottom-0 left-0 right-0' 
      : 'fixed bottom-0 right-0 w-96'} 
      p-4 border-t shadow-lg z-20`} 
      style={{ backgroundColor: '#FAA225' }}>
      <div className="flex justify-between mb-4">
        <span className="text-xl font-semibold">Total</span>
        <span className="text-3xl font-bold">{formatCurrency(total)}</span>
      </div>
      
      <div className="flex space-x-2">
        {cartLength > 0 && (
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClearCart}
            style={{ 
              backgroundColor: 'white', 
              color: 'black', 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              border: '2px solid #FAA225',
              height: '4rem'
            }}
          >
            Clear Cart
          </Button>
        )}
        <Button 
          className={`${cartLength > 0 ? 'flex-1' : 'w-full'}`}
          size="lg"
          disabled={cartLength === 0}
          onClick={onShowPaymentForm}
          style={{ 
            height: '4rem',
            fontSize: '1.5rem',
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
