
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TableSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (tableNumber: number, peopleCount: number) => void;
}

const TableSelectionDialog: React.FC<TableSelectionDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<string>('');

  const handleConfirm = () => {
    if (selectedTable && peopleCount) {
      onConfirm(parseInt(selectedTable), parseInt(peopleCount));
      setSelectedTable('');
      setPeopleCount('');
    }
  };

  const handleCancel = () => {
    setSelectedTable('');
    setPeopleCount('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-[#0A2645] border-2">
        <DialogHeader className="bg-[#0A2645] text-white p-4 -m-6 mb-4 rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Select Table and Party Size</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="table" className="text-[#0A2645] font-semibold text-base">Table Number</Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="bg-white border-[#0A2645] border-2 text-[#0A2645] focus:ring-[#FAA225] focus:border-[#FAA225] h-12">
                <SelectValue placeholder="Select table" className="text-[#0A2645]" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#0A2645]">
                {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-[#0A2645] hover:bg-[#FAA225]/10">
                    Table {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="people" className="text-[#0A2645] font-semibold text-base">Number of People</Label>
            <Input
              id="people"
              type="number"
              min="1"
              max="20"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              placeholder="Enter number of people"
              className="bg-white border-[#0A2645] border-2 text-[#0A2645] placeholder:text-[#0A2645]/60 focus:ring-[#FAA225] focus:border-[#FAA225] h-12"
            />
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 p-4 -m-6 mt-4 rounded-b-lg border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedTable || !peopleCount}
            className="bg-[#FAA225] text-[#0A2645] hover:bg-[#FAA225]/90 font-semibold"
          >
            Start Taking Orders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableSelectionDialog;
