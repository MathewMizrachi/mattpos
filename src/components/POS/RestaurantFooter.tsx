
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<string>('');

  const handleSendOrder = () => {
    if (selectedTable && peopleCount) {
      onSendOrder(parseInt(selectedTable), parseInt(peopleCount));
    }
  };

  return (
    <div className={`fixed bottom-0 right-0 ${isMobile ? 'w-full' : 'w-96'} px-4 py-3 z-20`} 
      style={{ backgroundColor: '#FAA225' }}
    >
      <div className="space-y-3">
        {/* Table and People Selection */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label className="text-sm font-semibold text-[#0A2645]">Table</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="h-8 bg-white">
                <SelectValue placeholder="Select table" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Table {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="text-sm font-semibold text-[#0A2645]">People</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="h-8 bg-white"
              placeholder="0"
            />
          </div>
        </div>

        {/* Total and Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#0A2645]">{formatCurrency(total)}</span>
          
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
              disabled={cartLength === 0 || !selectedTable || !peopleCount}
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
