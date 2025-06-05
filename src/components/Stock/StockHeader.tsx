
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ImportIcon, PlusIcon, PackageIcon, MoreVerticalIcon, ShoppingCartIcon } from 'lucide-react';
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

  const handlePurchaseOrder = () => {
    navigate('/purchase-order');
  };

  return (
    <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b-2 border-[#FAA225] rounded-lg m-4 mb-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="text-[#0A2645] hover:bg-[#0A2645]/10"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A2645]">{title}</h1>
          <p className="text-sm text-[#0A2645]/70">{description}</p>
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
              <DropdownMenuItem onClick={handlePurchaseOrder}>
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Purchase Order
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
              onClick={handlePurchaseOrder} 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Purchase Order
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
