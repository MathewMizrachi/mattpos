
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
    <div className="relative mb-2">
      <SearchIcon className="h-6 w-6 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-12 bg-white text-lg font-medium h-12 border-2 border-secondary/20 focus:ring-2 focus:ring-secondary"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          onClick={() => onSearchChange('')}
        >
          <XIcon className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ProductSearch;
