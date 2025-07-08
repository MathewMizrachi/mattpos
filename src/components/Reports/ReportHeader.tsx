
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChartBarIcon, ArrowLeft } from 'lucide-react';

export const ReportHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/dashboard')}
          className="text-white hover:bg-white/10 border border-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <ChartBarIcon className="mr-3 h-8 w-8" />
            Reports & Analytics
          </h1>
          <p className="text-blue-100 mt-1">View and analyze business performance</p>
        </div>
      </div>
    </div>
  );
};
