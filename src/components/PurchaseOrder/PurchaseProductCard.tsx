
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface PurchaseProductCardProps {
  product: any;
  onAddToCart: (product: any, quantity: number) => void;
  isMobile?: boolean;
}

const PurchaseProductCard: React.FC<PurchaseProductCardProps> = ({ 
  product, 
  onAddToCart, 
  isMobile
}) => {
  const handleCardClick = () => {
    onAddToCart(product, 1);
  };
  
  // Use cost price (avgCostIncl) or calculate as 60% of selling price if not available
  const costPrice = product.avgCostIncl || (product.price * 0.6);
  
  // Split product name into first word and rest
  const words = product.name.split(' ');
  const firstWord = words[0];
  const restOfName = words.slice(1).join(' ');
  
  return (
    <Card 
      className="h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className={`${isMobile ? 'pt-2 px-2 pb-2' : 'pt-4'} flex-1 flex flex-col`}>
        <div className="flex-1">
          <div className="mb-1">
            <h3 className={`font-bold ${isMobile ? 'text-sm' : 'text-lg md:text-xl'} leading-tight`}>
              {firstWord}
            </h3>
            {restOfName && (
              <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm md:text-base'} text-muted-foreground leading-tight`}>
                {restOfName}
              </p>
            )}
          </div>
          
          {product.stock !== undefined && (
            <p className={`${isMobile ? 'text-xs' : 'text-xs'} ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <div className="mt-1">
          <div className={`${isMobile ? 'text-sm' : 'text-xl md:text-2xl'} font-bold mb-2 text-green-600`}>
            {formatCurrency(costPrice)}
          </div>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            Cost Price
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseProductCard;
