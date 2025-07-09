
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
  showPurchaseOrder?: boolean;
}

const StockHeader: React.FC<StockHeaderProps> = ({ 
  title = "Manage Stock",
  description = "Add, edit, and remove products",
  onOpenAddProduct, 
  onOpenImportProduct,
  showPurchaseOrder = false
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handlePurchaseOrder = () => {
    navigate('/purchase-order');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAA225]/20 via-[#FAA225]/10 to-transparent opacity-50"></div>
      <header className="relative bg-white/95 backdrop-blur-sm p-6 shadow-2xl border-b-4 border-[#FAA225] rounded-xl m-6 mb-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-[#0A2645] hover:bg-[#0A2645]/10 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#FAA225] to-[#e8940f] rounded-lg shadow-lg">
                <PackageIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#0A2645] bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] bg-clip-text">
                  {title}
                </h1>
                <p className="text-sm text-[#0A2645]/70 mt-1">{description}</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {isMobile ? (
              // Mobile view - show dropdown menu with enhanced styling
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-gradient-to-r from-white to-gray-50 text-[#0A2645] border-[#0A2645] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    <MoreVerticalIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl">
                  <DropdownMenuItem onClick={() => console.log("Global Stock Master clicked")} className="hover:bg-[#FAA225]/10">
                    <PackageIcon className="h-4 w-4 mr-2" />
                    Global Stock Master
                  </DropdownMenuItem>
                  {showPurchaseOrder && (
                    <DropdownMenuItem onClick={handlePurchaseOrder} className="hover:bg-[#FAA225]/10">
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Purchase Order
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onOpenImportProduct} className="hover:bg-[#FAA225]/10">
                    <ImportIcon className="h-4 w-4 mr-2" />
                    Import Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onOpenAddProduct} className="hover:bg-[#FAA225]/10">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Desktop view - show all buttons with enhanced styling
              <>
                <Button 
                  variant="outline" 
                  className="bg-gradient-to-r from-white to-gray-50 text-[#0A2645] border-[#0A2645] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={() => console.log("Global Stock Master clicked")}
                >
                  <PackageIcon className="h-4 w-4 mr-2" />
                  Global Stock Master
                </Button>
                {showPurchaseOrder && (
                  <Button 
                    onClick={handlePurchaseOrder} 
                    className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] hover:from-[#1a3a5f] hover:to-[#0A2645] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Purchase Order
                  </Button>
                )}
                <Button 
                  onClick={onOpenImportProduct} 
                  className="bg-gradient-to-r from-[#FAA225] to-[#e8940f] hover:from-[#e8940f] hover:to-[#FAA225] text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <ImportIcon className="h-4 w-4 mr-2" />
                  Import Products
                </Button>
                <Button 
                  onClick={onOpenAddProduct}
                  className="bg-gradient-to-r from-[#0A2645] to-[#1a3a5f] hover:from-[#1a3a5f] hover:to-[#0A2645] text-[#FAA225] font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default StockHeader;
