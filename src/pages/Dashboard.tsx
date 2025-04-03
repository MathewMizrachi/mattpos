
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FloatForm from '@/components/FloatForm';
import ShiftSummary from '@/components/ShiftSummary';
import {
  CreditCardIcon,
  ShoppingBagIcon,
  UsersIcon,
  FileTextIcon
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser, currentShift, getLastShiftEndFloat, startShift } = useApp();
  const [showFloatForm, setShowFloatForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    if (currentShift) {
      navigate('/pos');
    }
  }, [currentUser, currentShift, navigate]);

  const handleStartPOS = () => {
    setShowFloatForm(true);
  };

  const handleFloatSubmit = (amount: number) => {
    if (currentUser) {
      startShift(currentUser.id, amount);
      navigate('/pos');
    }
  };

  if (!currentUser) return null;

  if (showFloatForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2645] p-4">
        <FloatForm
          onSubmit={handleFloatSubmit}
          onCancel={() => setShowFloatForm(false)}
          lastEndFloat={getLastShiftEndFloat()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/21ec9284-d40a-4bca-a789-7478910aa1fd.png"
              alt="Shop2Shop Logo"
              className="h-10"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary">MiniPOS</h1>
              <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
            </div>
          </div>
          
          <Button
            onClick={handleStartPOS}
            className="bg-[#FAA225] hover:bg-[#E88C00] text-black"
          >
            Start New Shift
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Point of Sale</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleStartPOS}
                className="w-full"
              >
                Start Transaction
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/stock')}
                variant="outline"
                className="w-full"
              >
                Manage Stock
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/customers')}
                variant="outline"
                className="w-full"
              >
                Manage Customers
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate('/reports')}
                variant="outline"
                className="w-full"
              >
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Last Shift Summary</h2>
          <ShiftSummary />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
