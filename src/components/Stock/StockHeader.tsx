
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ImportIcon, PlusIcon, PackageIcon, MoreVerticalIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StockHeaderProps {
  title?: string;
  description?: string;
  onOpenAddProduct: () => void;
  onOpenImportProduct: () => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({ 
  title = "Manage Stock",
  description = "Add, edit, and remove products",
  onOpenAddProduct, 
  onOpenImportProduct 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        {isMobile ? (
          // Mobile view - show dropdown menu with white button
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white text-[#0A2645] border-[#0A2645]">
                <MoreVerticalIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Global Stock Master clicked")}>
                <PackageIcon className="h-4 w-4 mr-2" />
                Global Stock Master
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenImportProduct}>
                <ImportIcon className="h-4 w-4 mr-2" />
                Import Products
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenAddProduct}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Desktop view - show all buttons
          <>
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
          </>
        )}
      </div>
    </header>
  );
};

export default StockHeader;
