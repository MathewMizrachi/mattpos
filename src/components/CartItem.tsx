
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../lib/utils';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  product, 
  quantity, 
  onUpdateQuantity, 
  onRemove 
}) => {
  const handleIncrease = () => {
    onUpdateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    } else {
      onRemove(product.id);
    }
  };
  
  const subtotal = product.price * quantity;
  
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)} each</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleDecrease}
        >
          <Text style={styles.controlButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{quantity}</Text>
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={handleIncrease}
        >
          <Text style={styles.controlButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.subtotalContainer}>
        <Text style={styles.subtotal}>{formatCurrency(subtotal)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemove(product.id)}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '500',
    fontSize: 16,
  },
  price: {
    fontSize: 12,
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    width: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  subtotalContainer: {
    width: 80,
    alignItems: 'flex-end',
  },
  subtotal: {
    fontWeight: '500',
    fontSize: 16,
  },
  removeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default CartItem;
