
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className="relative mb-1">
      <SearchIcon className="h-4 w-4 md:h-5 md:w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10 md:pl-10 bg-white text-sm md:text-base font-medium h-8 md:h-10 border-2 border-secondary/20 focus:ring-2 focus:ring-secondary"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 md:h-7 md:w-7"
          onClick={() => onSearchChange('')}
        >
          <XIcon className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProductSearch;
