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
    <div className="min-h-screen flex items-center justify-center bg-[#0A2645]">
      <div className="w-full max-w-md p-8 bg-[#0A2645] rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <div className="max-w-[150px] mx-auto">
            <img 
              src="/lovable-uploads/b6cede87-26cc-4d43-b178-f4555df34f1e.png" 
              alt="MiniPos Logo" 
              className="h-auto w-full object-contain mx-auto mb-4"
            />
            <h1 className="text-5xl font-bold text-center -ml-2" style={{ color: '#FAA225' }}>MiniPos</h1>
          </div>
        </div>
        
        <PinPad 
          onSubmit={handleLogin}
          subtitle="Enter your PIN to continue"
          subtitleClassName="mt-12"
          titleClassName="text-white"
        />
        
        <div className="mt-4 text-center text-sm" style={{ color: '#FAA225' }}>
          <p>Demo PINs:</p>
          <p>Manager: 1234</p>
          <p>Staff: 5678</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
