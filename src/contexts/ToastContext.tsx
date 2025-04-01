
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showToast = (type: ToastType, title: string, message: string) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    
    setToasts(prev => [...prev, newToast]);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Animated.View 
          key={toast.id} 
          style={[
            styles.toast, 
            styles[toast.type],
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.title}>{toast.title}</Text>
          <Text style={styles.message}>{toast.message}</Text>
        </Animated.View>
      ))}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'column',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  success: {
    backgroundColor: '#10b981', // green
  },
  error: {
    backgroundColor: '#ef4444', // red
  },
  info: {
    backgroundColor: '#3b82f6', // blue
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: 'white',
    fontSize: 14,
  },
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
