
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { formatCurrency } from '../lib/utils';

interface PaymentFormProps {
  total: number;
  onProcessPayment: (cashReceived: number) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  total, 
  onProcessPayment, 
  onCancel 
}) => {
  const [cashReceived, setCashReceived] = useState('');
  const [change, setChange] = useState(0);
  
  useEffect(() => {
    const cashAmount = parseFloat(cashReceived) || 0;
    setChange(Math.max(0, cashAmount - total));
  }, [cashReceived, total]);
  
  const handleSubmit = () => {
    const cashAmount = parseFloat(cashReceived);
    if (cashAmount >= total) {
      onProcessPayment(cashAmount);
    }
  };
  
  // Quick amount buttons
  const generateQuickAmounts = () => {
    const amounts = [50, 100, 200, 500];
    // Filter out amounts that are less than the total
    return amounts.filter(amount => amount >= total);
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Payment</Text>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Change:</Text>
              <Text style={[styles.summaryValue, change > 0 && styles.changeValue]}>
                {formatCurrency(change)}
              </Text>
            </View>
          </View>
          
          <View style={styles.form}>
            <Text style={styles.label}>Cash Received (R)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={cashReceived}
              onChangeText={setCashReceived}
              placeholder="0.00"
            />
            
            <View style={styles.quickAmountContainer}>
              {generateQuickAmounts().map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.quickAmountButton}
                  onPress={() => setCashReceived(amount.toString())}
                >
                  <Text style={styles.quickAmountText}>{formatCurrency(amount)}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.quickAmountButton, styles.exactAmountButton]}
                onPress={() => setCashReceived(total.toString())}
              >
                <Text style={styles.quickAmountText}>
                  Exact Amount ({formatCurrency(total)})
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.completeButton,
                  parseFloat(cashReceived) < total && styles.disabledButton
                ]} 
                onPress={handleSubmit}
                disabled={parseFloat(cashReceived) < total}
              >
                <Text style={styles.completeButtonText}>Complete Sale</Text>
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
  summaryContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  changeValue: {
    color: '#10b981',
  },
  form: {
    width: '100%',
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
    fontSize: 18,
    marginBottom: 24,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    width: '48%',
  },
  exactAmountButton: {
    width: '100%',
    backgroundColor: '#e0f2fe',
    borderColor: '#bae6fd',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
  },
  completeButton: {
    flex: 2,
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
});

export default PaymentForm;
