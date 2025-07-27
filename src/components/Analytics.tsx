import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Clock, Star } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data for analytics
  const salesData = [
    { date: '2024-01-01', sales: 12000, orders: 45, customers: 38 },
    { date: '2024-01-02', sales: 15000, orders: 52, customers: 42 },
    { date: '2024-01-03', sales: 18000, orders: 61, customers: 55 },
    { date: '2024-01-04', sales: 14000, orders: 48, customers: 40 },
    { date: '2024-01-05', sales: 22000, orders: 73, customers: 65 },
    { date: '2024-01-06', sales: 25000, orders: 82, customers: 71 },
    { date: '2024-01-07', sales: 28000, orders: 95, customers: 83 }
  ];

  const topProducts = [
    { name: 'प्याज / Onions', sales: 450, revenue: 15750, trend: '+12%' },
    { name: 'टमाटर / Tomatoes', sales: 380, revenue: 17100, trend: '+8%' },
    { name: 'आटा / Wheat Flour', sales: 220, revenue: 9240, trend: '+15%' },
    { name: 'हल्दी / Turmeric', sales: 95, revenue: 17100, trend: '-3%' },
    { name: 'धनिया / Coriander', sales: 340, revenue: 3400, trend: '+22%' }
  ];

  const supplierPerformance = [
    { name: 'Krishna Flour & Grains', orders: 145, onTime: 95, rating: 4.8, revenue: 85000 },
    { name: 'Gupta Snacks & Ingredients', orders: 123, onTime: 92, rating: 4.6, revenue: 72000 },
    { name: 'Mumbai Fresh Market', orders: 98, onTime: 88, rating: 4.5, revenue: 54000 },
    { name: 'Spice King Wholesale', orders: 87, onTime: 94, rating: 4.7, revenue: 48000 }
  ];

  const categoryData = [
    { name: 'Vegetables', value: 35, color: '#22c55e' },
    { name: 'Spices', value: 25, color: '#f59e0b' },
    { name: 'Grains & Flour', value: 20, color: '#3b82f6' },
    { name: 'Dairy', value: 12, color: '#8b5cf6' },
    { name: 'Others', value: 8, color: '#ef4444' }
  ];

  const revenueData = [
    { month: 'Jan', vendor: 45000, supplier: 35000 },
    { month: 'Feb', vendor: 52000, supplier: 42000 },
    { month: 'Mar', vendor: 48000, supplier: 38000 },
    { month: 'Apr', vendor: 61000, supplier: 48000 },
    { month: 'May', vendor: 55000, supplier: 45000 },
    { month: 'Jun', vendor: 67000, supplier: 52000 }
  ];

  const kpiCards = [
    {
      title: "Total Revenue",
      value: "₹2,45,670",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Total Orders",
      value: "1,247",
      change: "+8.2%",
      trend: "up", 
      icon: ShoppingCart,
      description: "This month"
    },
    {
      title: "Active Vendors",
      value: "156",
      change: "+5.1%",
      trend: "up",
      icon: Users,
      description: "Currently active"
    },
    {
      title: "Avg Delivery Time",
      value: "22 min",
      change: "-2.3%",
      trend: "down",
      icon: Clock,
      description: "Average time"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your business performance and insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge 
                  variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                  className={kpi.trend === 'up' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}
                >
                  {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {kpi.change}
                </Badge>
                <span className="text-muted-foreground">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#f97316" 
                      fill="url(#gradient)" 
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Comparison</CardTitle>
              <CardDescription>Vendor vs Supplier revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="vendor" fill="#f97316" name="Vendor Revenue" />
                  <Bar dataKey="supplier" fill="#22c55e" name="Supplier Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Analytics</CardTitle>
              <CardDescription>Order volume and customer trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN')}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    name="Total Orders"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    name="Unique Customers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling items by volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                      <Badge 
                        variant={product.trend.startsWith('+') ? 'default' : 'destructive'}
                        className={product.trend.startsWith('+') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}
                      >
                        {product.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance</CardTitle>
              <CardDescription>Track supplier metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supplierPerformance.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full">
                        <Users className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{supplier.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{supplier.orders} orders</span>
                          <span>•</span>
                          <span>{supplier.onTime}% on-time</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                            {supplier.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{supplier.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;