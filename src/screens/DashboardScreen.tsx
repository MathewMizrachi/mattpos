
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import FloatForm from '../components/FloatForm';
import ShiftSummary from '../components/ShiftSummary';
import { formatCurrency } from '../lib/utils';

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  POS: undefined;
  Stock: undefined;
};

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const { currentUser, currentShift, startShift, endShift } = useApp();
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { showToast } = useToast();
  const [showFloatForm, setShowFloatForm] = useState(false);
  const [showShiftSummary, setShowShiftSummary] = useState(false);
  const [completedShift, setCompletedShift] = useState(null);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleStartShift = (amount: number) => {
    if (currentUser) {
      startShift(currentUser.id, amount);
      setShowFloatForm(false);
      showToast('success', 'Shift Started', `Starting float: ${formatCurrency(amount)}`);
    }
  };

  const handleEndShift = () => {
    if (currentShift) {
      const shift = endShift();
      if (shift) {
        setCompletedShift(shift);
        setShowShiftSummary(true);
      }
    }
  };

  const handleShowStartShift = () => {
    setShowFloatForm(true);
  };

  const handleCancelFloatForm = () => {
    setShowFloatForm(false);
  };

  const handleCloseShiftSummary = () => {
    setShowShiftSummary(false);
    setCompletedShift(null);
  };

  if (showFloatForm) {
    return (
      <SafeAreaView style={styles.container}>
        <FloatForm onSubmit={handleStartShift} onCancel={handleCancelFloatForm} />
      </SafeAreaView>
    );
  }

  if (showShiftSummary && completedShift) {
    return (
      <SafeAreaView style={styles.container}>
        <ShiftSummary shift={completedShift} onClose={handleCloseShiftSummary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {currentUser?.name}</Text>
          <Text style={styles.roleText}>Role: {currentUser?.role}</Text>
        </View>

        <View style={styles.shiftStatus}>
          {currentShift ? (
            <View style={styles.activeShift}>
              <Text style={styles.shiftTitle}>Active Shift</Text>
              <Text style={styles.shiftDetail}>
                Started: {new Date(currentShift.startTime).toLocaleTimeString()}
              </Text>
              <Text style={styles.shiftDetail}>
                Float: {formatCurrency(currentShift.startFloat)}
              </Text>
              {currentShift.salesTotal !== undefined && (
                <Text style={styles.shiftDetail}>
                  Sales: {formatCurrency(currentShift.salesTotal)}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.noShiftText}>No active shift</Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {!currentShift ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={handleShowStartShift}
            >
              <Text style={styles.actionButtonText}>Start Shift</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.endButton]}
              onPress={handleEndShift}
            >
              <Text style={styles.actionButtonText}>End Shift</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.posButton]}
            onPress={() => navigation.navigate('POS')}
            disabled={!currentShift}
          >
            <Text style={styles.actionButtonText}>
              Point of Sale
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.stockButton]}
            onPress={() => navigation.navigate('Stock')}
          >
            <Text style={styles.actionButtonText}>
              Manage Stock
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: '#6b7280',
  },
  shiftStatus: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeShift: {},
  shiftTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  shiftDetail: {
    fontSize: 16,
    marginBottom: 4,
  },
  noShiftText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
  },
  actionsContainer: {
    marginTop: 16,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  startButton: {
    backgroundColor: '#10b981', // green
  },
  endButton: {
    backgroundColor: '#f59e0b', // amber
  },
  posButton: {
    backgroundColor: '#3b82f6', // blue
  },
  stockButton: {
    backgroundColor: '#6366f1', // indigo
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DashboardScreen;
