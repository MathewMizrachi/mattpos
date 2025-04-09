
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartBarIcon, ArrowLeft } from 'lucide-react';

export const ReportHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center">
            <ChartBarIcon className="mr-2 h-6 w-6" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">View and analyze business performance</p>
        </div>
      </div>
    </div>
  );
};
