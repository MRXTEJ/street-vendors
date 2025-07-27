import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, X, Volume2, VolumeX, Settings, AlertCircle, Package, ShoppingCart, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'inventory' | 'system' | 'promotion';
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  timestamp: string;
  actionRequired?: boolean;
  orderId?: string;
}

interface NotificationSettings {
  orders: boolean;
  payments: boolean;
  inventory: boolean;
  promotions: boolean;
  system: boolean;
  sound: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    orders: true,
    payments: true,
    inventory: true,
    promotions: false,
    system: true,
    sound: true,
    push: true,
    email: false,
    sms: false
  });
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "नया ऑर्डर / New Order Received",
        message: "आपको Krishna Flour & Grains से एक नया ऑर्डर मिला है। राशि: ₹850",
        type: "order",
        priority: "high",
        read: false,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        actionRequired: true,
        orderId: "ORD-001"
      },
      {
        id: "2",
        title: "भुगतान पूरा / Payment Successful",
        message: "₹1,250 का भुगतान सफलतापूर्वक हो गया है। Transaction ID: WAL7821456039",
        type: "payment",
        priority: "medium",
        read: false,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: "3",
        title: "स्टॉक अलर्ट / Low Stock Alert",
        message: "टमाटर (Tomatoes) का स्टॉक कम है। वर्तमान: 8kg, न्यूनतम: 15kg",
        type: "inventory",
        priority: "high",
        read: false,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        actionRequired: true
      },
      {
        id: "4",
        title: "नई सुविधा / New Feature Available",
        message: "Voice Ordering अब हिंदी में भी उपलब्ध है! आज ही इस्तेमाल करें।",
        type: "system",
        priority: "low",
        read: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "5",
        title: "डिलीवरी अपडेट / Delivery Update",
        message: "आपका ऑर्डर #ORD-003 5 मिनट में पहुंच जाएगा। कुल राशि: ₹680",
        type: "order",
        priority: "medium",
        read: true,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "6",
        title: "विशेष छूट / Special Discount",
        message: "सभी मसालों पर 15% छूट! यह ऑफर आज तक वैध है।",
        type: "promotion",
        priority: "medium",
        read: true,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'payment': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'inventory': return <Package className="w-5 h-5 text-orange-600" />;
      case 'system': return <Settings className="w-5 h-5 text-purple-600" />;
      case 'promotion': return <TrendingUp className="w-5 h-5 text-pink-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "सभी नोटिफिकेशन पढ़े गए",
      description: "All notifications marked as read"
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "नोटिफिकेशन डिलीट",
      description: "Notification deleted successfully"
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "सभी नोटिफिकेशन साफ़",
      description: "All notifications cleared"
    });
  };

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "सेटिंग अपडेट",
      description: `${key} notifications ${value ? 'enabled' : 'disabled'}`
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            Stay updated with orders, payments, and alerts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{actionRequiredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sound</CardTitle>
            {settings.sound ? <Volume2 className="h-4 w-4 text-green-500" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{settings.sound ? 'Enabled' : 'Disabled'}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read Only</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="promotion">Promotions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {filter === "unread" ? "All caught up! No unread notifications." : "No notifications found with current filter."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all duration-200 ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''} hover:shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>
                              {notification.title}
                            </h4>
                            {getPriorityBadge(notification.priority)}
                            {notification.actionRequired && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Action Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              {new Date(notification.timestamp).toLocaleString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: 'short'
                              })}
                            </span>
                            {notification.orderId && (
                              <span className="font-mono">Order: {notification.orderId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.actionRequired && !notification.read && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="default">
                            Take Action
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Categories</CardTitle>
              <CardDescription>
                Choose which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="orders" className="text-base">
                    Order Notifications
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    New orders, order updates, and delivery notifications
                  </div>
                </div>
                <Switch
                  id="orders"
                  checked={settings.orders}
                  onCheckedChange={(checked) => updateSettings('orders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="payments" className="text-base">
                    Payment Notifications
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Payment confirmations, failures, and wallet updates
                  </div>
                </div>
                <Switch
                  id="payments"
                  checked={settings.payments}
                  onCheckedChange={(checked) => updateSettings('payments', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="inventory" className="text-base">
                    Inventory Alerts
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Low stock alerts and inventory updates
                  </div>
                </div>
                <Switch
                  id="inventory"
                  checked={settings.inventory}
                  onCheckedChange={(checked) => updateSettings('inventory', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promotions" className="text-base">
                    Promotional Offers
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Special deals, discounts, and promotional campaigns
                  </div>
                </div>
                <Switch
                  id="promotions"
                  checked={settings.promotions}
                  onCheckedChange={(checked) => updateSettings('promotions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system" className="text-base">
                    System Updates
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    App updates, maintenance, and new features
                  </div>
                </div>
                <Switch
                  id="system"
                  checked={settings.system}
                  onCheckedChange={(checked) => updateSettings('system', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Methods</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push" className="text-base">
                    Push Notifications
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Instant notifications on your device
                  </div>
                </div>
                <Switch
                  id="push"
                  checked={settings.push}
                  onCheckedChange={(checked) => updateSettings('push', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound" className="text-base">
                    Sound Alerts
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Audio alerts for important notifications
                  </div>
                </div>
                <Switch
                  id="sound"
                  checked={settings.sound}
                  onCheckedChange={(checked) => updateSettings('sound', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-base">
                    Email Notifications
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Important updates sent to your email
                  </div>
                </div>
                <Switch
                  id="email"
                  checked={settings.email}
                  onCheckedChange={(checked) => updateSettings('email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms" className="text-base">
                    SMS Notifications
                  </Label>
                  <div className="text-sm text-muted-foreground">
                    Critical alerts sent via SMS
                  </div>
                </div>
                <Switch
                  id="sms"
                  checked={settings.sms}
                  onCheckedChange={(checked) => updateSettings('sms', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;