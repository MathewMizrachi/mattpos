
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const handleClick = () => {
    onAddToCart(product);
  };
  
  return (
    <Card 
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow" 
      onClick={handleClick}
    >
      <CardContent className={`${isMobile ? 'pt-2 px-2 pb-2' : 'pt-4'} flex-1 flex flex-col`}>
        <div className="flex-1">
          <h3 className={`font-medium ${isMobile ? 'text-xs' : 'text-base md:text-lg'} mb-1 truncate`}>{product.name}</h3>
          
          {product.stock !== undefined && (
            <p className={`${isMobile ? 'text-xs' : 'text-xs'} ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <div className="mt-1">
          <p className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold text-primary`}>
            {formatCurrency(product.price)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
