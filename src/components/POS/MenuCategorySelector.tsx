
import React from 'react';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          onClick={() => onCategoryChange(category.id)}
          className={`h-12 text-sm font-medium border-2 transition-colors ${
            selectedCategory === category.id 
              ? 'bg-[#FAA225] text-[#0A2645] border-[#FAA225] hover:bg-[#FAA225]/90' 
              : 'bg-[#0A2645] text-[#FAA225] border-[#0A2645] hover:bg-[#0A2645]/90'
          }`}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default MenuCategorySelector;
