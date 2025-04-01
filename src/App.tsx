
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import POSScreen from './screens/POSScreen';
import StockScreen from './screens/StockScreen';

// Define the stack navigator type
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  POS: undefined;
  Stock: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppProvider>
          <ToastProvider>
            <NavigationContainer>
              <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="POS" component={POSScreen} />
                <Stack.Screen name="Stock" component={StockScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </ToastProvider>
        </AppProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
