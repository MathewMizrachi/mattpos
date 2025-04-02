
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isMobile?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isMobile }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className={`${isMobile ? 'pt-2 px-2 pb-2' : 'pt-4'} flex-1 flex flex-col`}>
        <div className="flex-1">
          <h3 className={`font-medium ${isMobile ? 'text-xs' : 'text-base md:text-lg'} mb-1 truncate`}>{product.name}</h3>
          <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold text-primary mb-1`}>
            {formatCurrency(product.price)}
          </p>
          
          {product.stock !== undefined && (
            <p className={`${isMobile ? 'text-xs' : 'text-xs'} ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className={`w-full mt-1 ${isMobile ? 'h-7 py-0 text-xs' : ''}`}
          disabled={product.stock !== undefined && product.stock <= 0}
          size={isMobile ? "sm" : "default"}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
