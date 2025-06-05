
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Building2, Phone } from 'lucide-react';

interface SupplierSelectionDialogProps {
  isOpen: boolean;
  suppliers: any[];
  onSelect: (supplier: any) => void;
  onClose: () => void;
}

const SupplierSelectionDialog: React.FC<SupplierSelectionDialogProps> = ({
  isOpen,
  suppliers,
  onSelect,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Select Supplier
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {suppliers.map((supplier) => (
            <Button
              key={supplier.id}
              variant="outline"
              className="w-full h-auto p-4 flex flex-col items-start hover:bg-[#0A2645]/10"
              onClick={() => onSelect(supplier)}
            >
              <div className="font-medium text-left">{supplier.name}</div>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Phone className="h-3 w-3 mr-1" />
                {supplier.contact}
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierSelectionDialog;
