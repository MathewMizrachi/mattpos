
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ImportIcon, PlusIcon, PackageIcon } from 'lucide-react';

interface StockHeaderProps {
  onOpenAddProduct: () => void;
  onOpenImportProduct: () => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({ onOpenAddProduct, onOpenImportProduct }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary">Manage Stock</h1>
          <p className="text-sm text-muted-foreground">Add, edit, and remove products</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="bg-white text-[#0A2645] border-[#0A2645]"
          onClick={() => console.log("Global Stock Master clicked")}
        >
          <PackageIcon className="h-4 w-4 mr-2" />
          Global Stock Master
        </Button>
        <Button 
          onClick={onOpenImportProduct} 
          className="bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645]"
        >
          <ImportIcon className="h-4 w-4 mr-2" />
          Import Products
        </Button>
        <Button onClick={onOpenAddProduct}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
    </header>
  );
};

export default StockHeader;
