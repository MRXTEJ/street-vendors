import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, AlertTriangle, TrendingUp, Edit, Trash2, Search } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  current_stock: number;
  min_threshold: number;
  max_capacity: number;
  unit: string;
  category: string;
  cost_per_unit: number;
  supplier: string;
  last_updated: string;
  expiry_date?: string;
}

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({
    name: "",
    current_stock: 0,
    min_threshold: 0,
    max_capacity: 0,
    unit: "",
    category: "",
    cost_per_unit: 0,
    supplier: "",
    expiry_date: ""
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Mock data for now since we don't have inventory table
      const mockInventory: InventoryItem[] = [
        {
          id: "1",
          name: "प्याज / Onions",
          current_stock: 25,
          min_threshold: 10,
          max_capacity: 50,
          unit: "kg",
          category: "vegetables",
          cost_per_unit: 35,
          supplier: "Krishna Flour & Grains",
          last_updated: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2",
          name: "टमाटर / Tomatoes",
          current_stock: 8,
          min_threshold: 15,
          max_capacity: 40,
          unit: "kg",
          category: "vegetables",
          cost_per_unit: 45,
          supplier: "Gupta Snacks & Ingredients",
          last_updated: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          name: "आटा / Wheat Flour",
          current_stock: 45,
          min_threshold: 20,
          max_capacity: 100,
          unit: "kg",
          category: "flour",
          cost_per_unit: 42,
          supplier: "Krishna Flour & Grains",
          last_updated: new Date().toISOString()
        },
        {
          id: "4",
          name: "हल्दी पाउडर / Turmeric Powder",
          current_stock: 2,
          min_threshold: 5,
          max_capacity: 15,
          unit: "kg",
          category: "spices",
          cost_per_unit: 180,
          supplier: "Gupta Snacks & Ingredients",
          last_updated: new Date().toISOString()
        }
      ];
      setInventory(mockInventory);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const addInventoryItem = async () => {
    try {
      const newInventoryItem: InventoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...newItem,
        last_updated: new Date().toISOString()
      };
      
      setInventory(prev => [...prev, newInventoryItem]);
      setNewItem({
        name: "",
        current_stock: 0,
        min_threshold: 0,
        max_capacity: 0,
        unit: "",
        category: "",
        cost_per_unit: 0,
        supplier: "",
        expiry_date: ""
      });
      setShowAddDialog(false);
      
      toast({
        title: "Item Added",
        description: "Inventory item has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to add inventory item.",
        variant: "destructive",
      });
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      setInventory(prev => prev.map(item => 
        item.id === id 
          ? { ...item, current_stock: newStock, last_updated: new Date().toISOString() }
          : item
      ));
      
      toast({
        title: "Stock Updated",
        description: "Inventory stock has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock.",
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock <= item.min_threshold) return "critical";
    if (item.current_stock <= item.min_threshold * 1.5) return "low";
    return "good";
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "low":
        return <Badge variant="secondary">Low Stock</Badge>;
      default:
        return <Badge variant="default">Good</Badge>;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["vegetables", "spices", "flour", "grains", "dairy", "oils"];
  const lowStockItems = inventory.filter(item => getStockStatus(item) !== "good").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track your ingredients and stock levels
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new ingredient to your inventory tracking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g., Onions / प्याज"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="current_stock">Current Stock</Label>
                  <Input
                    id="current_stock"
                    type="number"
                    value={newItem.current_stock}
                    onChange={(e) => setNewItem({...newItem, current_stock: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    placeholder="kg, pieces, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_threshold">Min Threshold</Label>
                  <Input
                    id="min_threshold"
                    type="number"
                    value={newItem.min_threshold}
                    onChange={(e) => setNewItem({...newItem, min_threshold: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="max_capacity">Max Capacity</Label>
                  <Input
                    id="max_capacity"
                    type="number"
                    value={newItem.max_capacity}
                    onChange={(e) => setNewItem({...newItem, max_capacity: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cost_per_unit">Cost per Unit (₹)</Label>
                  <Input
                    id="cost_per_unit"
                    type="number"
                    value={newItem.cost_per_unit}
                    onChange={(e) => setNewItem({...newItem, cost_per_unit: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newItem.supplier}
                    onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={addInventoryItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{inventory.reduce((total, item) => total + (item.current_stock * item.cost_per_unit), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(inventory.map(item => item.category)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory List */}
      <div className="grid gap-4">
        {filteredInventory.map((item) => {
          const status = getStockStatus(item);
          const stockPercentage = (item.current_stock / item.max_capacity) * 100;
          
          return (
            <Card key={item.id} className="transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {getStockBadge(status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Stock</p>
                        <p className="font-semibold">{item.current_stock} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min / Max</p>
                        <p className="font-semibold">{item.min_threshold} / {item.max_capacity} {item.unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost per {item.unit}</p>
                        <p className="font-semibold">₹{item.cost_per_unit}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Supplier</p>
                        <p className="font-semibold">{item.supplier}</p>
                      </div>
                    </div>

                    {/* Stock Level Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Stock Level</span>
                        <span>{stockPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            status === 'critical' ? 'bg-red-500' :
                            status === 'low' ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, item.current_stock - 1)}
                        disabled={item.current_stock <= 0}
                      >
                        -1
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStock(item.id, item.current_stock + 1)}
                        disabled={item.current_stock >= item.max_capacity}
                      >
                        +1
                      </Button>
                    </div>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "Start by adding your first inventory item."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;