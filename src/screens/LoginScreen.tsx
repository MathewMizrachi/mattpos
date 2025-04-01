
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import PinPad from '../components/PinPad';

// Define the navigation type
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  POS: undefined;
  Stock: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const { login } = useApp();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { showToast } = useToast();
  
  const handleLogin = (pin: string) => {
    const success = login(pin);
    
    if (success) {
      showToast('success', 'Login successful', 'Welcome back!');
      navigation.navigate('Dashboard');
    } else {
      showToast('error', 'Login failed', 'Incorrect PIN');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Market POS</Text>
            <Text style={styles.subtitle}>South African Informal Market</Text>
          </View>
          
          <PinPad
            onSubmit={handleLogin}
            title="Login"
            subtitle="Enter your PIN to continue"
          />
          
          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>Demo PINs:</Text>
            <Text style={styles.demoText}>Manager: 1234</Text>
            <Text style={styles.demoText}>Staff: 5678</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6', // primary color
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280', // muted foreground
    marginTop: 8,
  },
  demoInfo: {
    marginTop: 40,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
});

export default LoginScreen;
