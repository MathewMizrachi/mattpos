import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, MapPin, Calendar, Star, Tag } from 'lucide-react';

const Specials = () => {
  const navigate = useNavigate();
  const [searchDistance, setSearchDistance] = useState([5]);

  // Mock data for promotional pamphlets
  const specials = [
    {
      id: 1,
      title: "Fresh Market Weekly",
      store: "Green Valley Supermarket",
      distance: 0.3,
      validUntil: "Dec 25, 2024",
      description: "Fresh produce, dairy & bakery specials",
      image: "/lovable-uploads/0f3bbad6-4fe7-4711-86f3-94adb2235986.png"
    },
    {
      id: 2,
      title: "Holiday Sale",
      store: "City Electronics",
      distance: 0.7,
      validUntil: "Dec 31, 2024",
      description: "Up to 50% off electronics & appliances",
      image: "/lovable-uploads/21ec9284-d40a-4bca-a789-7478910aa1fd.png"
    },
    {
      id: 3,
      title: "Fashion Forward",
      store: "Style Boutique",
      distance: 1.2,
      validUntil: "Jan 15, 2025", 
      description: "New year fashion deals & accessories",
      image: "/lovable-uploads/244aad63-e667-4a2e-a60c-e6e1a4338903.png"
    },
    {
      id: 4,
      title: "Home & Garden",
      store: "Garden Center Plus",
      distance: 2.1,
      validUntil: "Feb 1, 2025",
      description: "Tools, plants & outdoor furniture sale",
      image: "/lovable-uploads/3d914bdb-a5d0-4d7d-a1f8-debd2456d19a.png"
    },
    {
      id: 5,
      title: "Sports Warehouse",
      store: "Athletic Zone",
      distance: 15.5,
      validUntil: "Jan 30, 2025",
      description: "Winter sports equipment clearance",
      image: "/lovable-uploads/4531f963-ec96-471b-b1d6-1adba2dbf7cb.png"
    },
    {
      id: 6,
      title: "Beauty & Wellness",
      store: "Glow Beauty Centre",
      distance: 45.2,
      validUntil: "Mar 1, 2025",
      description: "Skincare and wellness products on sale",
      image: "/lovable-uploads/4d765655-41b0-42ba-a5ce-2313baaa255c.png"
    }
  ];

  // Filter specials based on selected distance
  const filteredSpecials = specials.filter(special => special.distance <= searchDistance[0]);

  return (
    <div className="min-h-screen bg-[#0A2645] p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Card - matching Reports page style */}
        <Card className="mb-6 bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-xl border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0A2645] rounded-xl">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0A2645]">
                      Local Specials & Promotions
                    </h1>
                    <p className="text-gray-600 text-sm">Discover deals from nearby stores</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Distance Control */}
        <Card className="mb-6 bg-white rounded-2xl shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-[#0A2645] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#FAA225]" />
              Search Distance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Distance Range</span>
                <span className="text-lg font-semibold text-[#0A2645]">
                  {searchDistance[0]} km
                </span>
              </div>
              <Slider
                value={searchDistance}
                onValueChange={setSearchDistance}
                max={500}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 km</span>
                <span>500 km</span>
              </div>
              <p className="text-sm text-gray-600">
                Showing {filteredSpecials.length} specials within {searchDistance[0]} km of your location
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Specials Grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSpecials.map((special) => (
            <Card key={special.id} className="bg-white hover:shadow-lg transition-all cursor-pointer rounded-2xl border-0 shadow-sm">
              <CardContent className="p-0">
                {/* Image */}
                <div className="h-48 bg-gray-200 rounded-t-2xl overflow-hidden">
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
                  
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{special.distance} km</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>Until {special.validUntil}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#FAA225] hover:bg-[#FAA225]/90 text-[#0A2645] font-semibold rounded-xl"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSpecials.length === 0 && (
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A2645] mb-2">
                No specials found
              </h3>
              <p className="text-gray-600">
                Try increasing your search distance to find more deals in your area.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Specials;