
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { formatCurrency } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import CartItem from '../components/CartItem';
import PaymentForm from '../components/PaymentForm';

const POSScreen = () => {
  const [showPayment, setShowPayment] = useState(false);
  const { currentUser, currentShift, products, cart, addToCart, updateCartItem, removeFromCart, clearCart, processPayment } = useApp();
  const navigation = useNavigation();
  const { showToast } = useToast();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleBackToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  const handleShowPayment = () => {
    if (cart.length === 0) {
      showToast('error', 'Empty Cart', 'Please add items to the cart first');
      return;
    }
    setShowPayment(true);
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
  };

  const handleProcessPayment = (cashReceived: number) => {
    const result = processPayment(cashReceived);
    
    if (result.success) {
      setShowPayment(false);
      showToast('success', 'Sale Complete', `Change: ${formatCurrency(result.change)}`);
    } else {
      showToast('error', 'Payment Failed', 'Unable to process payment');
    }
  };

  if (!currentShift) {
    // Redirect back to dashboard if no active shift
    navigation.navigate('Dashboard');
    return null;
  }

  if (showPayment) {
    return (
      <SafeAreaView style={styles.container}>
        <PaymentForm
          total={calculateTotal()}
          onProcessPayment={handleProcessPayment}
          onCancel={handleCancelPayment}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToDashboard} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Point of Sale</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.productCardWrapper}>
                <ProductCard product={item} onAddToCart={addToCart} />
              </View>
            )}
            contentContainerStyle={styles.productGrid}
          />
        </View>

        <View style={styles.cartContainer}>
          <Text style={styles.sectionTitle}>Cart</Text>
          
          <FlatList
            data={cart}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({ item }) => (
              <CartItem
                product={item.product}
                quantity={item.quantity}
                onUpdateQuantity={updateCartItem}
                onRemove={removeFromCart}
              />
            )}
            contentContainerStyle={styles.cartList}
            ListEmptyComponent={
              <Text style={styles.emptyCartText}>No items in cart</Text>
            }
          />
          
          <View style={styles.cartFooter}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{formatCurrency(calculateTotal())}</Text>
            </View>
            
            <View style={styles.cartActions}>
              <TouchableOpacity 
                style={[styles.cartActionButton, styles.clearButton]} 
                onPress={clearCart}
                disabled={cart.length === 0}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.cartActionButton, styles.payButton]} 
                onPress={handleShowPayment}
                disabled={cart.length === 0}
              >
                <Text style={styles.payButtonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 120,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  productsContainer: {
    flex: 2,
    padding: 16,
  },
  cartContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  productGrid: {
    paddingBottom: 20,
  },
  productCardWrapper: {
    width: '50%',
    padding: 8,
  },
  cartList: {
    flexGrow: 1,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  cartFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
    marginTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  cartActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cartActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  payButton: {
    backgroundColor: '#10b981', // green
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default POSScreen;
