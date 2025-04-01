
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';

interface Product {
  id: number;
  name: string;
  price: number;
  stock?: number;
}

interface ProductFormProps {
  product: Product | null;
  onSave: (productData: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [trackStock, setTrackStock] = useState(false);
  const [stock, setStock] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setTrackStock(product.stock !== undefined);
      setStock(product.stock !== undefined ? product.stock.toString() : '');
    }
  }, [product]);

  const validate = () => {
    const newErrors = {
      name: '',
      price: '',
      stock: '',
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
      isValid = false;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = 'Price must be a positive number';
      isValid = false;
    }

    if (trackStock) {
      const stockValue = parseInt(stock, 10);
      if (isNaN(stockValue) || stockValue < 0) {
        newErrors.stock = 'Stock must be a non-negative number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validate()) {
      const productData: Omit<Product, 'id'> = {
        name: name.trim(),
        price: parseFloat(price),
      };

      if (trackStock) {
        productData.stock = parseInt(stock, 10);
      }

      onSave(productData);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {product ? 'Edit Product' : 'Add New Product'}
          </Text>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Product Name</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : {}]}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                placeholder="Enter product name"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price (R)</Text>
              <TextInput
                style={[styles.input, errors.price ? styles.inputError : {}]}
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  if (errors.price) setErrors({ ...errors, price: '' });
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
              {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Track Stock</Text>
                <Switch
                  value={trackStock}
                  onValueChange={setTrackStock}
                  trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
                  thumbColor={trackStock ? '#3b82f6' : '#f3f4f6'}
                />
              </View>
            </View>

            {trackStock && (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Stock Quantity</Text>
                <TextInput
                  style={[styles.input, errors.stock ? styles.inputError : {}]}
                  value={stock}
                  onChangeText={(text) => {
                    setStock(text);
                    if (errors.stock) setErrors({ ...errors, stock: '' });
                  }}
                  keyboardType="number-pad"
                  placeholder="0"
                />
                {errors.stock ? <Text style={styles.errorText}>{errors.stock}</Text> : null}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ProductForm;
