import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerList from '@/components/CustomerList';
import CustomerProfile from '@/components/CustomerProfile';
import CustomerPaymentProcessor from '@/components/CustomerPaymentProcessor';
import { useApp } from '@/contexts/AppContext';

const Customers = () => {
  const navigate = useNavigate();
  const { currentUser, customers } = useApp();
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
      <CustomerPaymentProcessor 
        customerId={selectedCustomerId}
        customerName={customer.name}
        onClose={handleBack}
      />
    );
  }
  
  // If a customer is selected, show their profile
  if (selectedCustomerId !== null) {
    return (
      <CustomerProfile 
        customerId={selectedCustomerId}
        onBack={handleBack}
        onMakePayment={handleMakePayment}
      />
    );
  }
  
  // Otherwise show the customer list
  return (
    <CustomerList 
      onBack={() => navigate('/dashboard')} 
      onSelectCustomer={handleCustomerSelect}
    />
  );
};

export default Customers;
