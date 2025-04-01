
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatCurrency } from '../lib/utils';

interface Shift {
  id: number;
  userId: number;
  startTime: Date;
  endTime?: Date;
  startFloat: number;
  salesTotal?: number;
  transactionCount?: number;
}

interface ShiftSummaryProps {
  shift: Shift;
  onClose: () => void;
}

const ShiftSummary: React.FC<ShiftSummaryProps> = ({ shift, onClose }) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = () => {
    if (!shift.endTime) return 'N/A';
    
    const start = new Date(shift.startTime).getTime();
    const end = new Date(shift.endTime).getTime();
    const durationMs = end - start;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const calculateExpectedCash = () => {
    return shift.startFloat + (shift.salesTotal || 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shift Summary</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Started:</Text>
            <Text style={styles.value}>{formatTime(shift.startTime)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ended:</Text>
            <Text style={styles.value}>
              {shift.endTime ? formatTime(shift.endTime) : 'N/A'}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{formatDuration()}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Starting Float:</Text>
            <Text style={styles.value}>{formatCurrency(shift.startFloat)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Sales:</Text>
            <Text style={styles.value}>{formatCurrency(shift.salesTotal || 0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction Count:</Text>
            <Text style={styles.value}>{shift.transactionCount || 0}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Expected Cash:</Text>
            <Text style={styles.totalValue}>{formatCurrency(calculateExpectedCash())}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#3b82f6',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalRow: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  closeButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ShiftSummary;
