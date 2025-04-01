
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../lib/utils';

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
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.info}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>
            {formatCurrency(product.price)}
          </Text>
          
          {product.stock !== undefined && (
            <Text 
              style={[
                styles.stock, 
                product.stock <= 5 ? styles.lowStock : {}
              ]}
            >
              Stock: {product.stock}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.addButton,
            (product.stock !== undefined && product.stock <= 0) 
              ? styles.disabledButton 
              : {}
          ]}
          onPress={handleAddToCart}
          disabled={product.stock !== undefined && product.stock <= 0}
        >
          <Text style={styles.buttonText}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    height: 160,
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  stock: {
    fontSize: 12,
    color: '#6b7280',
  },
  lowStock: {
    color: '#ef4444',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default ProductCard;
