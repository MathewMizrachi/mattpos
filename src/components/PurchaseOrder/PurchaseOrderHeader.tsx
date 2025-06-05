
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, ChevronDown } from 'lucide-react';

interface PurchaseOrderHeaderProps {
  selectedSupplier: any;
  onChangeSupplier: () => void;
}

const PurchaseOrderHeader: React.FC<PurchaseOrderHeaderProps> = ({
  selectedSupplier,
  onChangeSupplier
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b-2 border-[#FAA225] rounded-lg m-4 mb-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/stock')}
          className="text-[#0A2645] hover:bg-[#0A2645]/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A2645]">Purchase Order</h1>
          <p className="text-sm text-[#0A2645]/70">Create purchase orders for stock replenishment</p>
        </div>
      </div>
      
      {selectedSupplier && (
        <Button
          variant="outline"
          onClick={onChangeSupplier}
          className="bg-white text-[#0A2645] border-[#0A2645] hover:bg-[#0A2645]/10"
        >
          <Building2 className="h-4 w-4 mr-2" />
          {selectedSupplier.name}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      )}
    </header>
  );
};

export default PurchaseOrderHeader;
