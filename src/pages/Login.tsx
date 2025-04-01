
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import PinPad from '@/components/PinPad';
import { useApp } from '@/contexts/AppContext';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = (pin: string) => {
    const success = login(pin);
    
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Incorrect PIN",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">MiniPos</h1>
          <p className="text-muted-foreground mt-2">South African Informal Market</p>
        </div>
        
        <PinPad 
          onSubmit={handleLogin}
          title="Login"
          subtitle="Enter your PIN to continue"
        />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Demo PINs:</p>
          <p>Manager: 1234</p>
          <p>Staff: 5678</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

