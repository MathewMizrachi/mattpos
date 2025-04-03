
import { Product } from '../types';
import { BaseStore } from './BaseStore';

class ProductStore extends BaseStore<Product> {
  private currentId: number = 13;

  constructor() {
    super();
    // Initialize with default products
    this.items = [
      { id: 1, name: 'Bread', price: 15, stock: 20 },
      { id: 2, name: 'Milk', price: 22, stock: 15 },
      { id: 3, name: 'Eggs (6)', price: 25, stock: 10 },
      { id: 4, name: 'Rice 1kg', price: 30, stock: 25 },
      { id: 5, name: 'Maize Meal 2kg', price: 35, stock: 18 },
      { id: 6, name: 'Cooking Oil 750ml', price: 45, stock: 12 },
      { id: 7, name: 'Sugar 1kg', price: 28, stock: 20 },
      { id: 8, name: 'Tea Bags (40)', price: 32, stock: 15 },
      { id: 9, name: 'Airtime R10', price: 10, stock: 999 },
      { id: 10, name: 'Airtime R20', price: 20, stock: 999 },
      { id: 11, name: 'Airtime R50', price: 50, stock: 999 },
      { id: 12, name: 'Data 1GB', price: 85, stock: 999 },
    ];
  }

  add(product: Omit<Product, 'id'>): Product {
    const newProduct = {
      ...product,
      id: this.currentId++,
    };
    this.items.push(newProduct);
    return newProduct;
  }
  
  update(id: number, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const index = this.items.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }
  
  delete(id: number): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter(product => product.id !== id);
    return initialLength !== this.items.length;
  }

  findById(id: number): Product | undefined {
    return this.items.find(product => product.id === id);
  }

  getLowStock(threshold: number = 5): Product[] {
    return this.items.filter(p => 
      p.stock !== undefined && 
      p.stock <= threshold && 
      p.stock > 0
    );
  }
}

// Create a singleton instance
const productStore = new ProductStore();
export default productStore;
