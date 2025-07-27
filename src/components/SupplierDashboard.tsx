import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Clock, MapPin, Phone, TrendingUp, Package, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  vendorName: string;
  distance: string;
  items: {name: string, quantity: number, unit: string}[];
  totalAmount: number;
  urgency: "high" | "medium" | "low";
  timeRequested: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  vendorPhone: string;
}

interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  pricePerUnit: number;
  isAvailable: boolean;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: "onion", name: "Onions", unit: "kg", currentStock: 50, pricePerUnit: 35, isAvailable: true },
    { id: "tomato", name: "Tomatoes", unit: "kg", currentStock: 30, pricePerUnit: 45, isAvailable: true },
    { id: "potato", name: "Potatoes", unit: "kg", currentStock: 75, pricePerUnit: 28, isAvailable: true },
    { id: "coriander", name: "Coriander", unit: "bunch", currentStock: 25, pricePerUnit: 10, isAvailable: true },
    { id: "green-chili", name: "Green Chilies", unit: "kg", currentStock: 15, pricePerUnit: 80, isAvailable: true },
    { id: "ginger", name: "Ginger", unit: "kg", currentStock: 0, pricePerUnit: 120, isAvailable: false },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      vendorName: "Rajesh's Chaat Corner",
      distance: "0.8 km",
      items: [
        { name: "Onions", quantity: 3, unit: "kg" },
        { name: "Tomatoes", quantity: 2, unit: "kg" }
      ],
      totalAmount: 195,
      urgency: "high",
      timeRequested: "5 mins ago",
      status: "pending",
      vendorPhone: "+91 98765 43210"
    },
    {
      id: "ORD-002", 
      vendorName: "Priya's Dosa Stall",
      distance: "1.2 km",
      items: [
        { name: "Potatoes", quantity: 5, unit: "kg" },
        { name: "Coriander", quantity: 10, unit: "bunch" }
      ],
      totalAmount: 240,
      urgency: "medium",
      timeRequested: "12 mins ago",
      status: "pending",
      vendorPhone: "+91 98765 43211"
    }
  ]);

  const updateInventoryStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, newStock), isAvailable: newStock > 0 }
        : item
    ));
  };

  const updateInventoryPrice = (itemId: string, newPrice: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, pricePerUnit: Math.max(0, newPrice) }
        : item
    ));
  };

  const handleOrderResponse = (orderId: string, action: "accept" | "reject") => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: action === "accept" ? "accepted" : "rejected" }
        : order
    ));

    const order = orders.find(o => o.id === orderId);
    if (action === "accept" && order) {
      // Update inventory
      order.items.forEach(item => {
        const inventoryItem = inventory.find(inv => inv.name === item.name);
        if (inventoryItem) {
          updateInventoryStock(inventoryItem.id, inventoryItem.currentStock - item.quantity);
        }
      });

      toast({
        title: "Order accepted!",
        description: `Order from ${order.vendorName} has been accepted. Start preparing for delivery.`,
      });
    } else {
      toast({
        title: "Order rejected",
        description: `Order from ${order?.vendorName} has been rejected.`,
        variant: "destructive"
      });
    }
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: "completed" }
        : order
    ));
    
    const order = orders.find(o => o.id === orderId);
    toast({
      title: "Order completed!",
      description: `Payment of ₹${order?.totalAmount} received from ${order?.vendorName}.`,
    });
  };

  const todayEarnings = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedToday = orders.filter(o => o.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Supplier Dashboard</h1>
            <p className="text-muted-foreground">Manage inventory and fulfill emergency orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="online-status">Online</Label>
              <Switch 
                id="online-status"
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Available for Orders" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  <p className="text-2xl font-bold">₹{todayEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Items in Stock</p>
                  <p className="text-2xl font-bold">{inventory.filter(i => i.isAvailable).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Incoming Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {orders.filter(o => o.status === "pending").length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No pending orders</h3>
                  <p className="text-muted-foreground">
                    When vendors place emergency orders, they'll appear here for you to accept or reject.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.filter(o => o.status === "pending").map((order) => (
                  <Card key={order.id} className="shadow-card border-l-4 border-l-orange-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{order.vendorName}</span>
                            <Badge variant={order.urgency === "high" ? "destructive" : order.urgency === "medium" ? "default" : "secondary"}>
                              {order.urgency} priority
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {order.distance}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {order.timeRequested}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {order.vendorPhone}
                            </div>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                          <p className="text-sm text-muted-foreground">Total order value</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Items requested:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between bg-muted p-2 rounded">
                                <span>{item.name}</span>
                                <span className="font-semibold">{item.quantity} {item.unit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button 
                            variant="default" 
                            className="flex-1"
                            onClick={() => handleOrderResponse(order.id, "accept")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Order
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="flex-1"
                            onClick={() => handleOrderResponse(order.id, "reject")}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Order
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Accepted Orders */}
            {orders.filter(o => o.status === "accepted").length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Orders to Deliver</h3>
                {orders.filter(o => o.status === "accepted").map((order) => (
                  <Card key={order.id} className="shadow-card border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{order.vendorName}</CardTitle>
                          <CardDescription>Order #{order.id} • {order.distance}</CardDescription>
                        </div>
                        <Badge variant="default">Preparing</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">₹{order.totalAmount}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.map(i => `${i.name} (${i.quantity}${i.unit})`).join(", ")}
                          </p>
                        </div>
                        <Button onClick={() => completeOrder(order.id)}>
                          Mark as Delivered
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Update stock levels and pricing for your ingredients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {inventory.map((item) => (
                    <Card key={item.id} className="border">
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">per {item.unit}</p>
                          </div>
                          
                          <div>
                            <Label htmlFor={`stock-${item.id}`}>Current Stock</Label>
                            <Input
                              id={`stock-${item.id}`}
                              type="number"
                              value={item.currentStock}
                              onChange={(e) => updateInventoryStock(item.id, parseInt(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`price-${item.id}`}>Price per {item.unit}</Label>
                            <Input
                              id={`price-${item.id}`}
                              type="number"
                              value={item.pricePerUnit}
                              onChange={(e) => updateInventoryPrice(item.id, parseInt(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="text-center">
                            <Badge variant={item.isAvailable ? "default" : "destructive"}>
                              {item.isAvailable ? "Available" : "Out of Stock"}
                            </Badge>
                            {item.currentStock < 10 && item.isAvailable && (
                              <p className="text-xs text-orange-600 mt-1">Low stock warning</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>This Week's Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">₹12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orders Completed</span>
                      <span className="font-bold">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Order Value</span>
                      <span className="font-bold">₹445</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Rating</span>
                      <span className="font-bold">4.8 ⭐</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Top Selling Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Onions", sold: "45 kg", revenue: "₹1,575" },
                      { name: "Tomatoes", sold: "32 kg", revenue: "₹1,440" },
                      { name: "Potatoes", sold: "38 kg", revenue: "₹1,064" },
                      { name: "Green Chilies", sold: "8 kg", revenue: "₹640" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sold} sold</p>
                        </div>
                        <span className="font-bold">{item.revenue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupplierDashboard;