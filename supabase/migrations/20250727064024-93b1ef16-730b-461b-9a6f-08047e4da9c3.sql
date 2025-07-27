-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shop_name TEXT NOT NULL,
  shop_description TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL,
  delivery_time_min INTEGER DEFAULT 15,
  delivery_time_max INTEGER DEFAULT 45,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT DEFAULT 'piece',
  is_available BOOLEAN DEFAULT true,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor ratings table
CREATE TABLE public.vendor_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, order_id)
);

-- Add vendor_id to orders table
ALTER TABLE public.orders ADD COLUMN vendor_id UUID REFERENCES public.vendors(id);

-- Add more profile fields
ALTER TABLE public.profiles ADD COLUMN shop_name TEXT;
ALTER TABLE public.profiles ADD COLUMN address TEXT;
ALTER TABLE public.profiles ADD COLUMN account_type TEXT DEFAULT 'customer' CHECK (account_type IN ('customer', 'vendor', 'supplier'));
ALTER TABLE public.profiles ADD COLUMN is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'hi'));
ALTER TABLE public.profiles ADD COLUMN theme_preference TEXT DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark'));

-- Enable RLS on new tables
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_ratings ENABLE ROW LEVEL SECURITY;

-- RLS policies for vendors
CREATE POLICY "Vendors are viewable by everyone"
ON public.vendors
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own vendor profile"
ON public.vendors
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor profile"
ON public.vendors
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for products
CREATE POLICY "Products are viewable by everyone"
ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Vendors can manage their own products"
ON public.products
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.vendors
  WHERE vendors.id = products.vendor_id
  AND vendors.user_id = auth.uid()
));

-- RLS policies for vendor ratings
CREATE POLICY "Ratings are viewable by everyone"
ON public.vendor_ratings
FOR SELECT
USING (true);

CREATE POLICY "Users can create ratings for their orders"
ON public.vendor_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.vendor_ratings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample vendors
INSERT INTO public.vendors (user_id, shop_name, shop_description, address, phone, category, delivery_time_min, delivery_time_max) VALUES
(gen_random_uuid(), 'Ravi Fruit Corner', 'Fresh fruits and vegetables daily', 'Sector 15, Noida, UP', '+91-9876543210', 'Fruits & Vegetables', 10, 30),
(gen_random_uuid(), 'Mama Chai Stall', 'Best tea and snacks in the area', 'CP Metro Station, Delhi', '+91-9876543211', 'Tea & Snacks', 5, 15),
(gen_random_uuid(), 'Sharma Sweets', 'Traditional Indian sweets and snacks', 'Karol Bagh, Delhi', '+91-9876543212', 'Sweets & Snacks', 15, 45),
(gen_random_uuid(), 'Mobile Repair Center', 'Quick mobile and electronics repair', 'Nehru Place, Delhi', '+91-9876543213', 'Electronics', 30, 120),
(gen_random_uuid(), 'Desi Tiffin Service', 'Home-cooked meals delivered fresh', 'Gurgaon, Haryana', '+91-9876543214', 'Food & Tiffin', 20, 60);

-- Insert sample products for each vendor
INSERT INTO public.products (vendor_id, name, description, price, unit, category) VALUES
-- Ravi Fruit Corner products
((SELECT id FROM public.vendors WHERE shop_name = 'Ravi Fruit Corner' LIMIT 1), 'Fresh Apples', 'Red delicious apples - 1kg', 120.00, 'kg', 'Fruits'),
((SELECT id FROM public.vendors WHERE shop_name = 'Ravi Fruit Corner' LIMIT 1), 'Bananas', 'Fresh yellow bananas - 1 dozen', 48.00, 'dozen', 'Fruits'),
((SELECT id FROM public.vendors WHERE shop_name = 'Ravi Fruit Corner' LIMIT 1), 'Onions', 'Fresh red onions - 1kg', 30.00, 'kg', 'Vegetables'),
((SELECT id FROM public.vendors WHERE shop_name = 'Ravi Fruit Corner' LIMIT 1), 'Tomatoes', 'Fresh tomatoes - 1kg', 40.00, 'kg', 'Vegetables'),

-- Mama Chai Stall products
((SELECT id FROM public.vendors WHERE shop_name = 'Mama Chai Stall' LIMIT 1), 'Special Chai', 'Hot masala chai', 10.00, 'cup', 'Beverages'),
((SELECT id FROM public.vendors WHERE shop_name = 'Mama Chai Stall' LIMIT 1), 'Samosa', 'Crispy potato samosa', 15.00, 'piece', 'Snacks'),
((SELECT id FROM public.vendors WHERE shop_name = 'Mama Chai Stall' LIMIT 1), 'Biscuit', 'Tea biscuits', 5.00, 'piece', 'Snacks'),

-- Sharma Sweets products
((SELECT id FROM public.vendors WHERE shop_name = 'Sharma Sweets' LIMIT 1), 'Gulab Jamun', 'Soft and sweet gulab jamuns', 200.00, 'kg', 'Sweets'),
((SELECT id FROM public.vendors WHERE shop_name = 'Sharma Sweets' LIMIT 1), 'Samosa', 'Crispy vegetable samosa', 20.00, 'piece', 'Snacks'),
((SELECT id FROM public.vendors WHERE shop_name = 'Sharma Sweets' LIMIT 1), 'Jalebi', 'Fresh hot jalebis', 180.00, 'kg', 'Sweets'),

-- Mobile Repair Center products
((SELECT id FROM public.vendors WHERE shop_name = 'Mobile Repair Center' LIMIT 1), 'Screen Replacement', 'Mobile screen repair service', 1500.00, 'service', 'Repair'),
((SELECT id FROM public.vendors WHERE shop_name = 'Mobile Repair Center' LIMIT 1), 'Battery Replacement', 'Mobile battery replacement', 800.00, 'service', 'Repair'),

-- Desi Tiffin Service products
((SELECT id FROM public.vendors WHERE shop_name = 'Desi Tiffin Service' LIMIT 1), 'Rajma Chawal', 'Kidney beans with rice and pickle', 85.00, 'plate', 'Meals'),
((SELECT id FROM public.vendors WHERE shop_name = 'Desi Tiffin Service' LIMIT 1), 'Dal Roti', 'Yellow dal with 3 rotis', 65.00, 'plate', 'Meals'),
((SELECT id FROM public.vendors WHERE shop_name = 'Desi Tiffin Service' LIMIT 1), 'Mixed Veg', 'Mixed vegetables with rice', 75.00, 'plate', 'Meals');