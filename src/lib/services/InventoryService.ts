
import productStore from '../stores/ProductStore';
import { Product } from '../types';

class InventoryService {
  getAllProducts(): Product[] {
    return productStore.getAll();
  }

  getProduct(id: number): Product | undefined {
    return productStore.findById(id);
  }

  addProduct(product: Omit<Product, 'id'>): Product {
    return productStore.add(product);
  }

  updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    return productStore.update(id, updates);
  }

  deleteProduct(id: number): boolean {
    return productStore.delete(id);
  }

  getLowStockProducts(threshold: number = 5): Product[] {
    return productStore.getLowStock(threshold);
  }
}

// Create a singleton instance
const inventoryService = new InventoryService();
export default inventoryService;
