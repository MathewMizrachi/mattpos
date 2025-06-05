
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PinPad from '@/components/PinPad';
import { useApp } from '@/contexts/AppContext';

const Login = () => {
  const { login, currentMode, toggleMode } = useApp();
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
          <div className="max-w-[200px] mx-auto">
            <img 
              src="/lovable-uploads/b6cede87-26cc-4d43-b178-f4555df34f1e.png" 
              alt="Till2Day Logo" 
              className="h-auto w-full object-contain mx-auto mb-6"
            />
            <h1 
              className="text-6xl font-bold text-center -ml-2 cursor-pointer hover:opacity-80 transition-opacity" 
              style={{ color: '#FAA225' }}
              onClick={toggleMode}
              title={`Switch to ${currentMode === 'till' ? 'Cook2Day' : 'Till2Day'}`}
            >
              {currentMode === 'till' ? 'Till2Day' : 'Cook2Day'}
            </h1>
          </div>
        </div>
        
        <PinPad 
          onSubmit={handleLogin}
          subtitle="Enter your PIN to continue"
          subtitleClassName="mt-12"
          titleClassName="text-white"
        />
        
        <div className="mt-4 text-center text-sm" style={{ color: '#FAA225' }}>
          <p>Demo PIN:</p>
          <p>All Users: 55</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
