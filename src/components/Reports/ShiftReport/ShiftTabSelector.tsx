
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShiftTabSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasRefunds: boolean;
  hasLowStock: boolean;
}

const ShiftTabSelector: React.FC<ShiftTabSelectorProps> = ({ 
  activeTab, 
  setActiveTab,
  hasRefunds,
  hasLowStock
}) => {
  return (
    <div className="mb-6">
      <Select value={activeTab} onValueChange={setActiveTab}>
        <SelectTrigger className="bg-white text-[#0A2645] border-[#0A2645]">
          <SelectValue placeholder="Select Report Section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="payment">Payment Methods</SelectItem>
          {hasRefunds && (
            <SelectItem value="refunds">Refunds</SelectItem>
          )}
          {hasLowStock && (
            <SelectItem value="inventory">Low Stock</SelectItem>
          )}
          <SelectItem value="profitplus">Profit+</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShiftTabSelector;
