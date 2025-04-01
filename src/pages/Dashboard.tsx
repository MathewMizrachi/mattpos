import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOutIcon, ShoppingCartIcon, PackageIcon, DollarSignIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/contexts/AppContext';
import PinPad from '@/components/PinPad';
import FloatForm from '@/components/FloatForm';

const Dashboard = () => {
  const { currentUser, currentShift, logout, startShift } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showStaffPinPad, setShowStaffPinPad] = useState(false);
  const [showFloatForm, setShowFloatForm] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);
  
  useEffect(() => {
    if (currentShift) {
      navigate('/pos');
    }
  }, [currentShift, navigate]);
  
  const handleStartShift = () => {
    setShowStaffPinPad(true);
  };
  
  const handleStaffPinSubmit = (pin: string) => {
    // In a real app, you would validate the staff PIN against the database
    // For this demo, we'll just check against our known PINs
    if (pin === '5678') {
      setSelectedStaffId(2); // Staff ID
      setShowStaffPinPad(false);
      setShowFloatForm(true);
    } else if (pin === '1234') {
      setSelectedStaffId(1); // Manager ID
      setShowStaffPinPad(false);
      setShowFloatForm(true);
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid staff PIN",
        variant: "destructive"
      });
    }
  };
  
  const handleFloatSubmit = (amount: number) => {
    if (selectedStaffId) {
      startShift(selectedStaffId, amount);
      toast({
        title: "Shift Started",
        description: `Starting float: R${amount.toFixed(2)}`,
      });
      navigate('/pos');
    }
  };
  
  const handleManageStock = () => {
    navigate('/stock');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (showStaffPinPad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <PinPad 
            onSubmit={handleStaffPinSubmit}
            title="Staff Authentication"
            subtitle="Enter staff PIN to start shift"
          />
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline" onClick={() => setShowStaffPinPad(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (showFloatForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <FloatForm 
            onSubmit={handleFloatSubmit}
            onCancel={() => setShowFloatForm(false)}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/244aad63-e667-4a2e-a60c-e6e1a4338903.png" 
              alt="MiniPos Logo" 
              className="h-10 mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">MiniPos</h1>
              <p className="text-muted-foreground">Welcome, {currentUser?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOutIcon className="h-5 w-5" />
          </Button>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Start Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Start a new shift to begin processing sales.
              </p>
              <Button className="w-full" onClick={handleStartShift}>
                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Start Shift
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Manage Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, or remove products from your inventory.
              </p>
              <Button className="w-full" onClick={handleManageStock}>
                <PackageIcon className="h-4 w-4 mr-2" />
                Manage Stock
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function implementations
const handleStaffPinSubmit = (pin: string) => {
  // In a real app, you would validate the staff PIN against the database
  // For this demo, we'll just check against our known PINs
  if (pin === '5678') {
    setSelectedStaffId(2); // Staff ID
    setShowStaffPinPad(false);
    setShowFloatForm(true);
  } else if (pin === '1234') {
    setSelectedStaffId(1); // Manager ID
    setShowStaffPinPad(false);
    setShowFloatForm(true);
  } else {
    toast({
      title: "Invalid PIN",
      description: "Please enter a valid staff PIN",
      variant: "destructive"
    });
  }
};

const handleManageStock = () => {
  navigate('/stock');
};

const handleLogout = () => {
  logout();
  navigate('/');
};

export default Dashboard;
