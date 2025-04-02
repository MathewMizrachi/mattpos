
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
    <div className="relative mb-2 px-0">
      <SearchIcon className="h-8 w-8 md:h-10 md:w-10 absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-12 md:pl-16 bg-white text-lg md:text-xl font-semibold h-12 md:h-14 border-2 border-secondary/20 focus:ring-2 focus:ring-secondary"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 md:h-10 md:w-10"
          onClick={() => onSearchChange('')}
        >
          <XIcon className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      )}
    </div>
  );
};

export default ProductSearch;
