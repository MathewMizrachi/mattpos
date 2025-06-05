
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
  onSendOrder: () => void;
  isMobile: boolean;
  tableInfo?: {
    selectedTable?: number;
    peopleCount?: number;
    isNewOrder?: boolean;
    isAddingToOrder?: boolean;
    existingOrders?: any[];
  } | null;
}

const RestaurantFooter: React.FC<RestaurantFooterProps> = ({
  total,
  cartLength,
  onClearCart,
  onPrintReceipt,
  onPayment,
  onSendOrder,
  isMobile,
  tableInfo
}) => {
  const getButtonText = () => {
    if (tableInfo?.isAddingToOrder) {
      return 'Add to Order';
    }
    return 'Send';
  };

  const getTableDisplay = () => {
    if (tableInfo?.selectedTable) {
      return `Table ${tableInfo.selectedTable}`;
    }
    return 'Order';
  };

  return (
    <div className={`fixed bottom-0 right-0 ${isMobile ? 'w-full' : 'w-96'} px-4 py-3 z-20`} 
      style={{ backgroundColor: '#FAA225' }}
    >
      <div className="space-y-3">
        {/* Table Info and Total */}
        <div className="text-center space-y-1">
          {tableInfo?.selectedTable && (
            <div className="text-sm font-medium text-[#0A2645]">
              {getTableDisplay()} {tableInfo.peopleCount && `(${tableInfo.peopleCount} people)`}
            </div>
          )}
          <div className="text-2xl font-bold text-[#0A2645]">{formatCurrency(total)}</div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          {cartLength > 0 && (
            <Button 
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
            onClick={onSendOrder}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-1" />
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantFooter;
