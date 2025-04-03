
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerList from '@/components/CustomerList';
import { useApp } from '@/contexts/AppContext';

const Customers = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  return (
    <CustomerList onBack={() => navigate('/dashboard')} />
  );
};

export default Customers;
