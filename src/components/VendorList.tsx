import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  shop_name: string;
  shop_description: string;
  address: string;
  phone: string;
  category: string;
  delivery_time_min: number;
  delivery_time_max: number;
  rating: number;
  total_ratings: number;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  is_available: boolean;
}

interface VendorListProps {
  onOrderFromVendor?: (vendorId: string, products: Product[]) => void;
}

const VendorList = ({ onOrderFromVendor }: VendorListProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorProducts = async (vendorId: string) => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('is_available', true)
        .order('category');

      if (error) throw error;
      setVendorProducts(data || []);
      setSelectedVendor(vendorId);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setProductsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{vendor.shop_name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {vendor.shop_description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {vendor.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(vendor.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {vendor.rating.toFixed(1)} ({vendor.total_ratings} {t('vendors.rating')})
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  {vendor.delivery_time_min}-{vendor.delivery_time_max} {t('vendors.minutes')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">{vendor.address}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{vendor.phone}</span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => fetchVendorProducts(vendor.id)}
                  disabled={productsLoading && selectedVendor === vendor.id}
                >
                  {productsLoading && selectedVendor === vendor.id ? 
                    'Loading...' : t('vendors.view.products')
                  }
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    if (onOrderFromVendor) {
                      fetchVendorProducts(vendor.id);
                    }
                  }}
                >
                  {t('vendors.order.now')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">
                {vendors.find(v => v.id === selectedVendor)?.shop_name} - Products
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedVendor(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {vendorProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendorProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold text-primary">
                            ₹{product.price} 
                            <span className="text-sm font-normal text-muted-foreground">
                              /{product.unit}
                            </span>
                          </div>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => {
                            if (onOrderFromVendor) {
                              onOrderFromVendor(selectedVendor, [product]);
                              setSelectedVendor(null);
                            }
                          }}
                        >
                          Add to Order
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No products available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;