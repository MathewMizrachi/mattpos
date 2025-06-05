
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
              ? 'bg-orange-500 text-blue-600 border-orange-500 hover:bg-orange-600' 
              : 'bg-blue-600 text-orange-500 border-blue-600 hover:bg-blue-700'
          }`}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default MenuCategorySelector;
