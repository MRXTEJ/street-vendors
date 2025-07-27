import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Star, Phone, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  rating: number;
  distance: string;
  deliveryTime: string;
  phone: string;
  isOnline: boolean;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  minOrder: number;
  available: boolean;
}

const VendorDashboard = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  const suppliers: Supplier[] = [
    {
      id: "1",
      name: "Mumbai Fresh Suppliers",
      rating: 4.8,
      distance: "0.8 km",
      deliveryTime: "15-20 min",
      phone: "+91 98765 43210",
      isOnline: true
    },
    {
      id: "2", 
      name: "Quick Veg Supply",
      rating: 4.6,
      distance: "1.2 km",
      deliveryTime: "20-25 min",
      phone: "+91 98765 43211",
      isOnline: true
    },
    {
      id: "3",
      name: "Spice King Wholesaler",
      rating: 4.9,
      distance: "1.5 km",
      deliveryTime: "25-30 min",
      phone: "+91 98765 43212",
      isOnline: false
    }
  ];

  const ingredients: Ingredient[] = [
    { id: "onion", name: "Onions", unit: "kg", pricePerUnit: 35, minOrder: 2, available: true },
    { id: "tomato", name: "Tomatoes", unit: "kg", pricePerUnit: 45, minOrder: 2, available: true },
    { id: "potato", name: "Potatoes", unit: "kg", pricePerUnit: 28, minOrder: 3, available: true },
    { id: "coriander", name: "Coriander", unit: "bunch", pricePerUnit: 10, minOrder: 5, available: true },
    { id: "green-chili", name: "Green Chilies", unit: "kg", pricePerUnit: 80, minOrder: 1, available: true },
    { id: "ginger", name: "Ginger", unit: "kg", pricePerUnit: 120, minOrder: 1, available: false },
  ];

  const addToCart = (ingredientId: string) => {
    setCart(prev => ({
      ...prev,
      [ingredientId]: (prev[ingredientId] || 0) + 1
    }));
  };

  const removeFromCart = (ingredientId: string) => {
    setCart(prev => ({
      ...prev,
      [ingredientId]: Math.max((prev[ingredientId] || 0) - 1, 0)
    }));
  };

  const getTotalAmount = () => {
    return Object.entries(cart).reduce((total, [ingredientId, quantity]) => {
      const ingredient = ingredients.find(i => i.id === ingredientId);
      return total + (ingredient ? ingredient.pricePerUnit * quantity : 0);
    }, 0);
  };

  const placeOrder = () => {
    if (!selectedSupplier) {
      toast({
        title: "Select a supplier",
        description: "Please select a supplier before placing your order.",
        variant: "destructive"
      });
      return;
    }

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    if (totalItems === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive"
      });
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplier);
    toast({
      title: "Order placed successfully!",
      description: `Your order for ₹${getTotalAmount()} has been sent to ${supplier?.name}. Expected delivery: ${supplier?.deliveryTime}`,
    });
    
    setCart({});
    setSelectedSupplier(null);
  };

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Emergency Ingredient Ordering</h1>
          <p className="text-muted-foreground">Quick ordering for when you run out during peak hours</p>
        </div>

        <Tabs defaultValue="order" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="order">Quick Order</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Ingredients */}
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Available Ingredients</CardTitle>
                    <CardDescription>Click to add to your emergency order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {ingredients.map((ingredient) => (
                        <Card key={ingredient.id} className={`border-2 transition-all duration-200 ${
                          !ingredient.available ? 'opacity-50 bg-muted' : 'hover:border-primary'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold">{ingredient.name}</h3>
                              <Badge variant={ingredient.available ? "default" : "destructive"}>
                                {ingredient.available ? "Available" : "Out of Stock"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              ₹{ingredient.pricePerUnit}/{ingredient.unit} • Min: {ingredient.minOrder} {ingredient.unit}
                            </p>
                            
                            {ingredient.available && (
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeFromCart(ingredient.id)}
                                  disabled={!cart[ingredient.id]}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center font-semibold">
                                  {cart[ingredient.id] || 0}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => addToCart(ingredient.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cart & Checkout */}
              <div className="space-y-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ShoppingCart className="h-5 w-5" />
                      <span>Order Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {Object.entries(cart).filter(([_, qty]) => qty > 0).length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">Your cart is empty</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(cart)
                          .filter(([_, qty]) => qty > 0)
                          .map(([ingredientId, quantity]) => {
                            const ingredient = ingredients.find(i => i.id === ingredientId);
                            if (!ingredient) return null;
                            return (
                              <div key={ingredientId} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{ingredient.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {quantity} {ingredient.unit} × ₹{ingredient.pricePerUnit}
                                  </p>
                                </div>
                                <p className="font-semibold">₹{ingredient.pricePerUnit * quantity}</p>
                              </div>
                            );
                          })}
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total</span>
                            <span>₹{getTotalAmount()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Select Supplier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suppliers.filter(s => s.isOnline).map((supplier) => (
                        <Card
                          key={supplier.id}
                          className={`cursor-pointer border-2 transition-all duration-200 ${
                            selectedSupplier === supplier.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedSupplier(supplier.id)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-sm">{supplier.name}</h4>
                                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                                    {supplier.rating}
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {supplier.distance}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center text-xs text-green-600">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {supplier.deliveryTime}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <Button 
                      variant="vendor" 
                      className="w-full mt-4" 
                      size="lg"
                      onClick={placeOrder}
                    >
                      Place Emergency Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suppliers">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="shadow-card">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <Badge variant={supplier.isOnline ? "default" : "destructive"}>
                        {supplier.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                          <span className="font-semibold">{supplier.rating}</span>
                          <span className="text-muted-foreground ml-1">rating</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{supplier.distance} away</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{supplier.deliveryTime}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{supplier.phone}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your order history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "1", date: "Today, 2:30 PM", supplier: "Mumbai Fresh Suppliers", items: "Onions (3kg), Tomatoes (2kg)", amount: 195, status: "Delivered" },
                    { id: "2", date: "Yesterday, 7:45 PM", supplier: "Quick Veg Supply", items: "Green Chilies (1kg), Coriander (5 bunches)", amount: 130, status: "Delivered" },
                    { id: "3", date: "2 days ago, 1:15 PM", supplier: "Mumbai Fresh Suppliers", items: "Potatoes (3kg), Onions (2kg)", amount: 154, status: "Delivered" }
                  ].map((order) => (
                    <Card key={order.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                            <p className="text-sm">{order.supplier}</p>
                            <p className="text-sm text-muted-foreground">{order.items}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.amount}</p>
                            <Badge variant="default" className="mt-1">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;