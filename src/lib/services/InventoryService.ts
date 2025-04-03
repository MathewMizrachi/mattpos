
import dataStore from './DataStore';
import { Product } from '../types';

class InventoryService {
  getAllProducts(): Product[] {
    return dataStore.getProducts();
  }

  getProduct(id: number): Product | undefined {
    return this.getAllProducts().find(product => product.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    return dataStore.addProduct(product);
  }

  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    return dataStore.updateProduct(id, updates);
  }

  deleteProduct(id: number): boolean {
    return dataStore.deleteProduct(id);
  }

  getLowStockProducts(threshold: number = 5): Product[] {
    return this.getAllProducts().filter(p => 
      p.stock !== undefined && 
      p.stock <= threshold && 
      p.stock > 0
    );
  }
}

// Create a singleton instance
const inventoryService = new InventoryService();
export default inventoryService;
