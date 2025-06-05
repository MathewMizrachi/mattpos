
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
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
          className="h-12 text-sm font-medium"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default MenuCategorySelector;
