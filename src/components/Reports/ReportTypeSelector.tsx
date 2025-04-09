
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportTypeSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="mb-6">
      <Select value={activeTab} onValueChange={setActiveTab}>
        <SelectTrigger className="bg-white text-[#0A2645] border-[#0A2645]">
          <SelectValue placeholder="Select Report Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sales">Sales Report</SelectItem>
          <SelectItem value="inventory">Inventory Status</SelectItem>
          <SelectItem value="payment">Payment Methods</SelectItem>
          <SelectItem value="profitplus">Profit+</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
