import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import VoiceOrdering from "./VoiceOrdering";
import OrderManagement from "./OrderManagement";
import TeamSection from "./TeamSection";
import VendorList from "./VendorList";
import ProfileModal from "./ProfileModal";
import InventoryManagement from "./InventoryManagement";
import Analytics from "./Analytics";
import PaymentSystem from "./PaymentSystem";
import NotificationCenter from "./NotificationCenter";
import VendorDashboard from "./VendorDashboard";
import SupplierDashboard from "./SupplierDashboard";
import AIOrderingAssistant from "./AIOrderingAssistant";
import LocationBasedSuppliers from "./LocationBasedSuppliers";
import { LogOut, Mic, ShoppingCart, Users, Home, User as UserIcon, Store, Sun, Moon, Package, BarChart3, CreditCard, Bell, Brain, MapPin, Truck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import logo from "@/assets/logo.png";

interface MainDashboardProps {
  user: User;
  onSignOut: () => void;
}

const MainDashboard = ({ user, onSignOut }: MainDashboardProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleVoiceOrderComplete = async (orderData: any) => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          vendor_name: "Voice Order",
          items: orderData.items,
          total_amount: orderData.total,
          status: 'pending',
          voice_order: true,
          delivery_address: "Address to be provided",
          phone: profile?.phone || "",
          notes: "Voice order - please contact customer for delivery details"
        });

      if (error) throw error;

      toast({
        title: "Order placed!",
        description: "Your voice order has been successfully placed.",
      });
      
      setShowVoiceModal(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt={t('app.name')} className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-primary">{t('app.name')}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
              {language === 'en' ? 'हिन्दी' : 'English'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowProfileModal(true)}>
              <UserIcon className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {t('dashboard.welcome')}, {profile?.full_name || user.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.signout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Dynamic tab layout based on user role */}
          {profile?.role === 'vendor' ? (
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="vendor-dashboard" className="flex items-center space-x-2">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Raw Materials</span>
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">Nearby Suppliers</span>
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">AI Assistant</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Order</span>
              </TabsTrigger>
            </TabsList>
          ) : profile?.role === 'supplier' ? (
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="supplier-dashboard" className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span className="hidden sm:inline">Supplier Hub</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="grid w-full grid-cols-8 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.dashboard')}</span>
              </TabsTrigger>
              <TabsTrigger value="vendors" className="flex items-center space-x-2">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.vendors')}</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.voice')}</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t('nav.orders')}</span>
              </TabsTrigger>
            </TabsList>
          )}

          {/* Vendor Role Content */}
          {profile?.role === 'vendor' && (
            <>
              <TabsContent value="vendor-dashboard">
                <VendorDashboard />
              </TabsContent>
              <TabsContent value="suppliers">
                <LocationBasedSuppliers />
              </TabsContent>
              <TabsContent value="ai-assistant">
                <AIOrderingAssistant />
              </TabsContent>
            </>
          )}

          {/* Supplier Role Content */}
          {profile?.role === 'supplier' && (
            <>
              <TabsContent value="supplier-dashboard">
                <SupplierDashboard />
              </TabsContent>
            </>
          )}

          {/* Default/Customer Role Content */}
          {(!profile?.role || profile?.role === 'customer') && (
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800">Welcome Back!</CardTitle>
                    <CardDescription className="text-orange-600">
                      Ready to manage your supply orders?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setShowVoiceModal(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Voice Order
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-100 to-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">Quick Access</CardTitle>
                    <CardDescription className="text-green-600">
                      Manage your orders and suppliers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      View All Orders
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      Find Suppliers
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">App Features</CardTitle>
                    <CardDescription className="text-blue-600">
                      Everything you need in one place
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-blue-700">
                      <li>• Voice-enabled ordering</li>
                      <li>• Real-time order tracking</li>
                      <li>• Supplier matching</li>
                      <li>• 30-minute delivery</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {/* Common Content for All Roles */}
          <TabsContent value="vendors">
            <VendorList />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentSystem />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="voice">
            <div className="flex justify-center">
              <VoiceOrdering onOrderComplete={handleVoiceOrderComplete} />
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Voice Order Modal */}
      {showVoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Voice Ordering</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowVoiceModal(false)}
              >
                ✕
              </Button>
            </div>
            <VoiceOrdering 
              onOrderComplete={(orderData) => {
                handleVoiceOrderComplete(orderData);
                setShowVoiceModal(false);
              }} 
            />
          </div>
        </div>
      )}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          user={user} 
          onClose={() => setShowProfileModal(false)}
          onProfileUpdated={fetchProfile}
        />
      )}
    </div>
  );
};

export default MainDashboard;