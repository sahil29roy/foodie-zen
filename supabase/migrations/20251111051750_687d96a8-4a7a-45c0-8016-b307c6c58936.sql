-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  rating DECIMAL(2,1) DEFAULT 4.0,
  cuisine TEXT NOT NULL,
  delivery_time TEXT DEFAULT '30-40 mins',
  minimum_order DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  is_vegetarian BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, menu_item_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for restaurants (public read)
CREATE POLICY "Restaurants are viewable by everyone" 
ON public.restaurants FOR SELECT USING (true);

-- RLS Policies for menu_items (public read)
CREATE POLICY "Menu items are viewable by everyone" 
ON public.menu_items FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view order items of their own orders" 
ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Trigger for profiles updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample restaurants
INSERT INTO public.restaurants (name, description, image, rating, cuisine, delivery_time, minimum_order) VALUES
('Spice Junction', 'Authentic Indian cuisine with rich flavors', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', 4.5, 'Indian', '25-35 mins', 100),
('Pizza Paradise', 'Wood-fired pizzas and Italian classics', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', 4.7, 'Italian', '30-40 mins', 150),
('Burger Bliss', 'Juicy burgers and crispy fries', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.3, 'American', '20-30 mins', 80),
('Sushi Master', 'Fresh sushi and Japanese delicacies', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', 4.8, 'Japanese', '35-45 mins', 200),
('Taco Fiesta', 'Mexican street food favorites', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', 4.4, 'Mexican', '20-30 mins', 90);

-- Insert sample menu items
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_vegetarian) 
SELECT id, 'Butter Chicken', 'Creamy tomato curry with tender chicken', 299.00, 'Main Course', false FROM public.restaurants WHERE name = 'Spice Junction'
UNION ALL
SELECT id, 'Paneer Tikka', 'Marinated cottage cheese grilled to perfection', 249.00, 'Appetizer', true FROM public.restaurants WHERE name = 'Spice Junction'
UNION ALL
SELECT id, 'Margherita Pizza', 'Classic pizza with fresh mozzarella', 399.00, 'Pizza', true FROM public.restaurants WHERE name = 'Pizza Paradise'
UNION ALL
SELECT id, 'Pepperoni Pizza', 'Loaded with pepperoni and cheese', 449.00, 'Pizza', false FROM public.restaurants WHERE name = 'Pizza Paradise'
UNION ALL
SELECT id, 'Classic Burger', 'Beef patty with lettuce and tomato', 199.00, 'Burgers', false FROM public.restaurants WHERE name = 'Burger Bliss'
UNION ALL
SELECT id, 'Veggie Burger', 'Plant-based patty with fresh vegetables', 179.00, 'Burgers', true FROM public.restaurants WHERE name = 'Burger Bliss'
UNION ALL
SELECT id, 'California Roll', 'Crab, avocado, and cucumber roll', 349.00, 'Sushi Rolls', false FROM public.restaurants WHERE name = 'Sushi Master'
UNION ALL
SELECT id, 'Vegetarian Roll', 'Fresh vegetables wrapped in rice', 299.00, 'Sushi Rolls', true FROM public.restaurants WHERE name = 'Sushi Master'
UNION ALL
SELECT id, 'Chicken Tacos', 'Three tacos with grilled chicken', 229.00, 'Tacos', false FROM public.restaurants WHERE name = 'Taco Fiesta'
UNION ALL
SELECT id, 'Bean Burrito', 'Wrapped burrito with black beans', 189.00, 'Burritos', true FROM public.restaurants WHERE name = 'Taco Fiesta';