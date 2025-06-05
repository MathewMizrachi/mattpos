
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MenuCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MenuCategorySelector: React.FC<MenuCategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'soft-drinks', label: 'Soft Drinks' },
    { id: 'food', label: 'Food' },
    { id: 'sides', label: 'Sides' }
  ];

  const selectedCategoryLabel = categories.find(cat => cat.id === selectedCategory)?.label || 'All Items';

  return (
    <div className="mb-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full h-12 bg-[#0A2645] text-[#FAA225] border-[#0A2645] hover:bg-[#0A2645]/90">
          <SelectValue placeholder="Select category">
            {selectedCategoryLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-[#0A2645]">
          {categories.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.id}
              className="hover:bg-[#FAA225]/20 focus:bg-[#FAA225]/20"
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MenuCategorySelector;
