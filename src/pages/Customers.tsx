import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerList from '@/components/CustomerList';
import CustomerProfile from '@/components/CustomerProfile';
import CustomerPaymentProcessor from '@/components/CustomerPaymentProcessor';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';

const Customers = () => {
  const navigate = useNavigate();
  const { currentUser, customers } = useApp();
  const { theme } = useTheme();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  // Set the document title
  React.useEffect(() => {
    document.title = 'Customers / Accounts';
    return () => {
      document.title = 'POS System';
    };
  }, []);
  
  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomerId(customerId);
  };
  
  const handleMakePayment = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setShowPaymentProcessor(true);
  };
  
  const handleBack = () => {
    setSelectedCustomerId(null);
    setShowPaymentProcessor(false);
  };
  
  // If we're showing the payment processor
  if (showPaymentProcessor && selectedCustomerId !== null) {
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) return null;
    
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: theme.background }}
      >
        <CustomerPaymentProcessor 
          customerId={selectedCustomerId}
          customerName={customer.name}
          onClose={handleBack}
        />
      </div>
    );
  }
  
  // If a customer is selected, show their profile
  if (selectedCustomerId !== null) {
    return (
      <div 
        className="min-h-screen"
        style={{ backgroundColor: theme.background }}
      >
        <CustomerProfile 
          customerId={selectedCustomerId}
          onBack={handleBack}
          onMakePayment={handleMakePayment}
        />
      </div>
    );
  }
  
  // Otherwise show the customer list
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: theme.background }}
    >
      <CustomerList 
        onBack={() => navigate('/dashboard')} 
        onSelectCustomer={handleCustomerSelect}
      />
    </div>
  );
};

export default Customers;
