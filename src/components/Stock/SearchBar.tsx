
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, XIcon } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative mb-4">
      <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A2645]" />
      <Input
        className="pl-9 max-w-md bg-white text-[#0A2645]"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          onClick={() => setSearchTerm('')}
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
