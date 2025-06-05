
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface PaymentFooterProps {
  total: number;
  cartLength: number;
  onClearCart: () => void;
  onShowPaymentForm: () => void;
  onCashPayment: () => void;
  onCardPayment: () => void;
  onShop2ShopPayment: () => void;
  isMobile: boolean;
}

const PaymentFooter: React.FC<PaymentFooterProps> = ({
  total,
  cartLength,
  onClearCart,
  onShowPaymentForm,
  onCashPayment,
  onCardPayment,
  onShop2ShopPayment,
  isMobile
}) => {
  return (
    <div className={`fixed bottom-0 right-0 ${isMobile ? 'w-full' : 'w-96'} px-6 py-4 z-20`} 
      style={{ backgroundColor: '#FAA225' }}
    >
      <div className="space-y-3">
        {/* Total */}
        <div className="text-center">
          <span className="text-2xl font-bold">{formatCurrency(total)}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          {cartLength > 0 && (
            <Button 
              variant="outline" 
              onClick={onClearCart}
              style={{ 
                backgroundColor: 'white', 
                color: 'black', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                border: '2px solid #FAA225',
                height: '2.75rem',
                padding: '0 1rem'
              }}
            >
              Clear
            </Button>
          )}
          <Button 
            size="lg"
            disabled={cartLength === 0}
            onClick={onShowPaymentForm}
            style={{ 
              height: '2.75rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              padding: '0 1rem'
            }}
          >
            Pay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFooter;
