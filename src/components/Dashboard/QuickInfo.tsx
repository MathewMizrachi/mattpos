
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Cloud, 
  Lightbulb, 
  TrendingUp,
  Star,
  Target,
  Award
} from 'lucide-react';

interface QuickInfoProps {
  mode: 'till' | 'restaurant';
}

const QuickInfo: React.FC<QuickInfoProps> = ({ mode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const tillTips = [
    "💡 Remember to check stock levels before end of shift",
    "⭐ Customers love when you remember their usual orders",
    "🎯 Today's goal: Beat yesterday's transaction count!",
    "💳 Promote Shop2Shop for faster checkouts"
  ];

  const restaurantTips = [
    "👨‍🍳 Check kitchen orders regularly to avoid delays",
    "🍽️ Table turnover is key to maximizing revenue",
    "⏰ Peak hours are 12-2pm and 6-8pm - be prepared!",
    "🌟 Happy customers leave better reviews and tips"
  ];

  const tips = mode === 'till' ? tillTips : restaurantTips;
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(tipTimer);
  }, [tips.length]);

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[#0A2645] flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-[#FAA225]" />
            Today
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#0A2645]">{formatTime(currentTime)}</span>
            <Badge variant="outline" className="text-[#0A2645]">
              Live
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{formatDate(currentTime)}</p>
          <div className="flex items-center gap-2 mt-3">
            <Cloud className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">22°C | Partly Cloudy</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-[#0A2645] flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-[#FAA225]" />
            Quick Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[60px] flex items-center">
            <p className="text-sm text-[#0A2645] font-medium leading-relaxed">
              {tips[currentTip]}
            </p>
          </div>
          <div className="flex justify-center mt-3 space-x-1">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentTip ? 'bg-[#FAA225]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickInfo;
