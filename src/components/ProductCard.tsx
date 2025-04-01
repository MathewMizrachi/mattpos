
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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(product);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
          <p className="text-2xl font-bold text-primary mb-2">
            {formatCurrency(product.price)}
          </p>
          
          {product.stock !== undefined && (
            <p className={`text-sm ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
              Stock: {product.stock}
            </p>
          )}
        </div>
        
        <Button 
          onClick={handleAddToCart}
          className="w-full mt-4"
          disabled={product.stock !== undefined && product.stock <= 0}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
