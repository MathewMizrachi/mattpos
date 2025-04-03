
export interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

export interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}
