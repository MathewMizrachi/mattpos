
import { useState } from 'react';
import db from '@/lib/db';
import { Product } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(db.getAllProducts());

  const refreshProducts = () => {
    setProducts(db.getAllProducts());
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = db.addProduct(product);
    refreshProducts();
    return newProduct;
  };

  const updateProduct = (id: number, updates: Partial<Omit<Product, 'id'>>) => {
    const updated = db.updateProduct(id, updates);
    refreshProducts();
    return updated;
  };

  const deleteProduct = (id: number) => {
    const result = db.deleteProduct(id);
    refreshProducts();
    return result;
  };

  const getLowStockProducts = (threshold?: number): Product[] => {
    return db.getLowStockProducts(threshold);
  };

  return {
    products,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts
  };
}
