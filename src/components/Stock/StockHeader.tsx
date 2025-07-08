
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Upload, ShoppingCart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

interface StockHeaderProps {
  title: string;
  description: string;
  onOpenAddProduct: () => void;
  onOpenImportProduct: () => void;
  showPurchaseOrder?: boolean;
}

const StockHeader: React.FC<StockHeaderProps> = ({
  title,
  description,
  onOpenAddProduct,
  onOpenImportProduct,
  showPurchaseOrder = false
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <header 
      className="p-4 shadow-sm flex justify-between items-center border-2 rounded-lg m-4 mb-6"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border
      }}
    >
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          style={{
            color: theme.text,
            backgroundColor: 'transparent'
          }}
          className="hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: theme.text }}
          >
            {title}
          </h1>
          <p 
            className="text-sm"
            style={{ color: theme.textSecondary }}
          >
            {description}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <ThemeToggle />
        {showPurchaseOrder && (
          <Button 
            onClick={() => navigate('/purchase-order')}
            className="border-2"
            style={{
              backgroundColor: theme.button,
              color: theme.buttonText,
              borderColor: theme.accent
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Order
          </Button>
        )}
        <Button 
          onClick={onOpenImportProduct}
          variant="outline"
          className="border-2"
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border,
            color: theme.text
          }}
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button 
          onClick={onOpenAddProduct}
          className="border-2"
          style={{
            backgroundColor: theme.button,
            color: theme.buttonText,
            borderColor: theme.accent
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
    </header>
  );
};

export default StockHeader;
