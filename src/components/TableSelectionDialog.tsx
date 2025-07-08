
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Utensils, Star, Sparkles } from 'lucide-react';

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
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white via-blue-50/80 to-blue-100/60 border-2 border-[#0A2645] shadow-2xl rounded-2xl overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-[#0A2645] via-[#0A2645]/95 to-[#0A2645]/90 text-white p-8 -m-6 mb-8 rounded-t-2xl shadow-lg">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm shadow-lg">
              <Utensils className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                🍽️ Welcome to Cook2Day
                <Sparkles className="h-6 w-6 text-[#FAA225]" />
              </div>
              <div className="text-sm text-white/80 font-normal mt-1">Let's get your table ready!</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-6 px-2">
          <div className="space-y-4">
            <Label htmlFor="table" className="text-[#0A2645] font-bold text-lg flex items-center gap-2">
              <div className="bg-[#FAA225]/20 p-2 rounded-lg">
                🪑
              </div>
              Select Your Table
            </Label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="bg-gradient-to-r from-white to-blue-50/50 border-2 border-[#0A2645] text-[#0A2645] focus:ring-[#FAA225] focus:border-[#FAA225] h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                <SelectValue placeholder="🏷️ Choose a table number" className="text-[#0A2645]" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#0A2645] rounded-xl shadow-xl">
                {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => (
                  <SelectItem 
                    key={num} 
                    value={num.toString()} 
                    className="text-[#0A2645] hover:bg-[#FAA225]/10 text-base font-semibold py-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      🍽️ Table {num}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="people" className="text-[#0A2645] font-bold text-lg flex items-center gap-2">
              <div className="bg-[#FAA225]/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-[#0A2645]" />
              </div>
              Party Size
            </Label>
            <Input
              id="people"
              type="number"
              min="1"
              max="20"
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              placeholder="👥 How many guests?"
              className="bg-gradient-to-r from-white to-blue-50/50 border-2 border-[#0A2645] text-[#0A2645] placeholder:text-[#0A2645]/60 focus:ring-[#FAA225] focus:border-[#FAA225] h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            />
          </div>

          {selectedTable && peopleCount && (
            <div className="bg-gradient-to-r from-[#FAA225]/10 via-orange-50/50 to-yellow-50/40 p-6 rounded-xl border-2 border-[#FAA225]/30 shadow-lg">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-[#0A2645] font-bold text-lg mb-1">
                  Perfect! Table {selectedTable} for {peopleCount} {parseInt(peopleCount) === 1 ? 'guest' : 'guests'}
                </div>
                <div className="text-[#0A2645]/70 text-sm">
                  Ready to create an amazing dining experience!
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 p-8 -m-6 mt-8 rounded-b-2xl border-t-2 border-white/50 shadow-lg">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-2 border-[#0A2645] text-[#0A2645] hover:bg-[#0A2645] hover:text-white font-bold h-14 text-lg px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            ❌ Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedTable || !peopleCount}
            className="bg-gradient-to-r from-[#FAA225] to-[#FAA225]/90 hover:from-[#FAA225]/90 hover:to-[#FAA225] text-[#0A2645] font-bold h-14 text-lg px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              🍽️ Start Taking Orders
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableSelectionDialog;
