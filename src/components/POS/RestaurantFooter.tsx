
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Printer, CreditCard, Send } from 'lucide-react';

interface RestaurantFooterProps {
  total: number;
  cartLength: number;
  onClearCart: () => void;
  onPrintReceipt: () => void;
  onPayment: () => void;
  onSendOrder: (tableNumber: number, peopleCount: number) => void;
  isMobile: boolean;
}

const RestaurantFooter: React.FC<RestaurantFooterProps> = ({
  total,
  cartLength,
  onClearCart,
  onPrintReceipt,
  onPayment,
  onSendOrder,
  isMobile
}) => {
  const handleSendOrder = () => {
    // For now, we'll use default values since table selection happens in the popup
    // This could be enhanced to store the selected table info in context
    onSendOrder(1, 1);
  };

  return (
    <div className={`fixed bottom-0 right-0 ${isMobile ? 'w-full' : 'w-96'} px-4 py-3 z-20`} 
      style={{ backgroundColor: '#FAA225' }}
    >
      <div className="space-y-3">
        {/* Total and Actions */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#0A2645]">{formatCurrency(total)}</span>
          
          <div className="flex space-x-2">
            {cartLength > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearCart}
                className="bg-white text-[#0A2645] border-[#0A2645] hover:bg-gray-100"
              >
                Clear
              </Button>
            )}
            
            <Button 
              size="sm"
              disabled={cartLength === 0}
              onClick={onPrintReceipt}
              className="bg-[#0A2645] text-white hover:bg-[#0A2645]/90"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            
            <Button 
              size="sm"
              disabled={cartLength === 0}
              onClick={onPayment}
              className="bg-[#0A2645] text-white hover:bg-[#0A2645]/90"
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Pay
            </Button>
            
            <Button 
              size="sm"
              disabled={cartLength === 0}
              onClick={handleSendOrder}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-1" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFooter;
