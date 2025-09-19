import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Calendar, Star } from 'lucide-react';

const Specials = () => {
  const navigate = useNavigate();

  // Mock data for promotional pamphlets
  const specials = [
    {
      id: 1,
      title: "Fresh Market Weekly",
      store: "Green Valley Supermarket",
      distance: "0.3 km",
      validUntil: "Dec 25, 2024",
      description: "Fresh produce, dairy & bakery specials",
      image: "/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
    },
    {
      id: 2,
      title: "Holiday Sale",
      store: "City Electronics",
      distance: "0.7 km", 
      validUntil: "Dec 31, 2024",
      description: "Up to 50% off electronics & appliances",
      image: "/lovable-uploads/21ec9284-d40a-4bca-a789-7478910aa1fd.png"
    },
    {
      id: 3,
      title: "Fashion Forward",
      store: "Style Boutique",
      distance: "1.2 km",
      validUntil: "Jan 15, 2025", 
      description: "New year fashion deals & accessories",
      image: "/lovable-uploads/244aad63-e667-4a2e-a60c-e6e1a4338903.png"
    },
    {
      id: 4,
      title: "Home & Garden",
      store: "Garden Center Plus",
      distance: "2.1 km",
      validUntil: "Feb 1, 2025",
      description: "Tools, plants & outdoor furniture sale",
      image: "/lovable-uploads/3d914bdb-a5d0-4d7d-a1f8-debd2456d19a.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A2645] p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-[#0A2645]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Local Specials
            </h1>
          </div>
        </div>

        {/* Location info */}
        <Card className="bg-white/10 border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5 text-[#FAA225]" />
              <span>Showing specials within 5km of your location</span>
            </div>
          </CardContent>
        </Card>

        {/* Specials Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {specials.map((special) => (
            <Card key={special.id} className="bg-white hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-0">
                {/* Image */}
                <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                  <img 
                    src={special.image} 
                    alt={special.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-[#0A2645] leading-tight">
                      {special.title}
                    </h3>
                    <Star className="h-5 w-5 text-[#FAA225] flex-shrink-0" />
                  </div>
                  
                  <p className="text-[#0A2645] font-medium mb-2">
                    {special.store}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    {special.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{special.distance}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Until {special.validUntil}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-3 bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-semibold"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Specials;