
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
    <div className="relative mb-2 w-full">
      <SearchIcon className="h-5 w-5 md:h-6 md:w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-10 md:pl-12 bg-white text-base md:text-lg font-medium h-10 md:h-12 border-2 border-secondary/20 focus:ring-2 focus:ring-secondary w-full"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 md:h-8 md:w-8"
          onClick={() => onSearchChange('')}
        >
          <XIcon className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      )}
    </div>
  );
};

export default ProductSearch;
