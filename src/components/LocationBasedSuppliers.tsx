import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, Navigation, Clock, Star, Phone, Filter,
  Truck, DollarSign, Package, Route
} from "lucide-react";

interface LocationSupplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  distance: number; // in km
  deliveryTime: string;
  deliveryFee: number;
  minOrder: number;
  specialties: string[];
  isOpen: boolean;
  coordinates: { lat: number; lng: number };
  products: {
    name: string;
    price: number;
    unit: string;
    available: boolean;
  }[];
}

const LocationBasedSuppliers = () => {
  const [suppliers, setSuppliers] = useState<LocationSupplier[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState("5");
  const [sortBy, setSortBy] = useState("distance");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock supplier data with realistic Delhi locations
  const mockSuppliers: LocationSupplier[] = [
    {
      id: "1",
      name: "राम ट्रेडिंग कॉर्पोरेशन",
      address: "Azadpur Mandi, Sector 6, Delhi",
      phone: "+91 98765 43210",
      rating: 4.5,
      reviews: 127,
      distance: 1.2,
      deliveryTime: "20-30 min",
      deliveryFee: 25,
      minOrder: 500,
      specialties: ["vegetables", "fruits", "grains"],
      isOpen: true,
      coordinates: { lat: 28.7041, lng: 77.1025 },
      products: [
        { name: "Onions", price: 35, unit: "kg", available: true },
        { name: "Tomatoes", price: 45, unit: "kg", available: true },
        { name: "Potatoes", price: 28, unit: "kg", available: true },
      ]
    },
    {
      id: "2",
      name: "श्री गुप्ता होलसेल",
      address: "Sadar Bazar, Old Delhi",
      phone: "+91 87654 32109",
      rating: 4.2,
      reviews: 89,
      distance: 2.8,
      deliveryTime: "30-45 min",
      deliveryFee: 40,
      minOrder: 800,
      specialties: ["spices", "grains", "packaged"],
      isOpen: true,
      coordinates: { lat: 28.6600, lng: 77.2300 },
      products: [
        { name: "Turmeric Powder", price: 180, unit: "kg", available: true },
        { name: "Red Chili", price: 220, unit: "kg", available: true },
        { name: "Basmati Rice", price: 85, unit: "kg", available: true },
      ]
    },
    {
      id: "3",
      name: "मोदी ब्रदर्स सप्लायर्स",
      address: "Ghazipur Mandi, East Delhi",
      phone: "+91 76543 21098",
      rating: 4.7,
      reviews: 156,
      distance: 4.1,
      deliveryTime: "45-60 min",
      deliveryFee: 50,
      minOrder: 1000,
      specialties: ["vegetables", "dairy", "meat"],
      isOpen: true,
      coordinates: { lat: 28.6315, lng: 77.3273 },
      products: [
        { name: "Fresh Paneer", price: 280, unit: "kg", available: true },
        { name: "Green Chilies", price: 120, unit: "kg", available: true },
        { name: "Coriander Leaves", price: 40, unit: "bunch", available: true },
      ]
    },
    {
      id: "4",
      name: "दिल्ली स्पाइस मार्ट",
      address: "Khari Baoli, Chandni Chowk",
      phone: "+91 65432 10987",
      rating: 4.3,
      reviews: 203,
      distance: 3.5,
      deliveryTime: "35-50 min",
      deliveryFee: 35,
      minOrder: 600,
      specialties: ["spices", "oils", "packaged"],
      isOpen: false,
      coordinates: { lat: 28.6562, lng: 77.2334 },
      products: [
        { name: "Mustard Oil", price: 165, unit: "liter", available: true },
        { name: "Garam Masala", price: 320, unit: "kg", available: true },
        { name: "Cumin Seeds", price: 180, unit: "kg", available: true },
      ]
    },
    {
      id: "5",
      name: "न्यू दिल्ली वेजिटेबल मार्केट",
      address: "Najafgarh Road, West Delhi",
      phone: "+91 54321 09876",
      rating: 4.1,
      reviews: 94,
      distance: 6.2,
      deliveryTime: "60-75 min",
      deliveryFee: 65,
      minOrder: 750,
      specialties: ["vegetables", "fruits"],
      isOpen: true,
      coordinates: { lat: 28.6139, lng: 77.1025 },
      products: [
        { name: "Cabbage", price: 25, unit: "kg", available: true },
        { name: "Cauliflower", price: 35, unit: "kg", available: true },
        { name: "Carrots", price: 45, unit: "kg", available: true },
      ]
    }
  ];

  useEffect(() => {
    getCurrentLocation();
    setSuppliers(mockSuppliers);
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
          toast({
            title: "Location found",
            description: "Showing suppliers near your location",
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Delhi location
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          setLoading(false);
          toast({
            title: "Using default location",
            description: "Delhi location is being used. Enable location for better results.",
          });
        }
      );
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
      setLoading(false);
      toast({
        title: "Location not supported",
        description: "Using Delhi as default location",
        variant: "destructive",
      });
    }
  };

  const filterAndSortSuppliers = () => {
    let filtered = [...suppliers];

    // Filter by radius
    const radius = parseInt(searchRadius);
    filtered = filtered.filter(supplier => supplier.distance <= radius);

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(supplier => 
        supplier.specialties.includes(filterCategory)
      );
    }

    // Sort suppliers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "rating":
          return b.rating - a.rating;
        case "delivery":
          return a.deliveryFee - b.deliveryFee;
        case "minOrder":
          return a.minOrder - b.minOrder;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getDirections = (supplier: LocationSupplier) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${supplier.coordinates.lat},${supplier.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  const filteredSuppliers = filterAndSortSuppliers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <MapPin className="w-6 h-6" />
          <span>📍 Nearby Suppliers</span>
        </h1>
        <p className="opacity-90">Find raw material suppliers near your location</p>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search Radius</label>
              <Select value={searchRadius} onValueChange={setSearchRadius}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Within 2 km</SelectItem>
                  <SelectItem value="5">Within 5 km</SelectItem>
                  <SelectItem value="10">Within 10 km</SelectItem>
                  <SelectItem value="20">Within 20 km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="spices">Spices</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="dairy">Dairy</SelectItem>
                  <SelectItem value="oils">Oils</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="delivery">Delivery Fee</SelectItem>
                  <SelectItem value="minOrder">Min Order</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={getCurrentLocation} disabled={loading} className="w-full">
                <Navigation className="w-4 h-4 mr-2" />
                {loading ? "Finding..." : "Update Location"}
              </Button>
            </div>
          </div>

          {userLocation && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className={`${!supplier.isOpen ? 'opacity-75' : ''} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{supplier.name}</span>
                    {!supplier.isOpen && <Badge variant="destructive">Closed</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{supplier.address}</span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Rating and Distance */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(supplier.rating)}
                  </div>
                  <span className="text-sm">{supplier.rating} ({supplier.reviews})</span>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  {supplier.distance} km
                </Badge>
              </div>

              {/* Delivery Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Delivery:</span>
                  </div>
                  <span>{supplier.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Truck className="w-3 h-3" />
                    <span>Fee:</span>
                  </div>
                  <span>₹{supplier.deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Package className="w-3 h-3" />
                    <span>Min Order:</span>
                  </div>
                  <span>₹{supplier.minOrder}</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-xs font-medium mb-1">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sample Products */}
              <div>
                <p className="text-xs font-medium mb-1">Sample Products:</p>
                <div className="space-y-1">
                  {supplier.products.slice(0, 2).map((product, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>{product.name}</span>
                      <span className="font-medium">₹{product.price}/{product.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => getDirections(supplier)}
                >
                  <Route className="w-3 h-3 mr-1" />
                  Directions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`tel:${supplier.phone}`, '_self')}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={!supplier.isOpen}
                >
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No suppliers found</h3>
            <p className="text-muted-foreground">
              Try increasing your search radius or changing the category filter
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm">
              <DollarSign className="w-4 h-4 mr-2" />
              Price Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Schedule Delivery
            </Button>
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Rate Suppliers
            </Button>
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              Save Routes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationBasedSuppliers;