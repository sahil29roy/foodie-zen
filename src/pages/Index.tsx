import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchRestaurants();
    if (user) fetchCartCount();
  }, [user]);

  const fetchRestaurants = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("*")
      .eq("is_active", true);
    
    setRestaurants(data || []);
    setFilteredRestaurants(data || []);
  };

  const fetchCartCount = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", user.id);
    
    const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    setCartItemsCount(total);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} cartItemsCount={cartItemsCount} />
      <Hero onSearch={handleSearch} />
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Restaurants</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>

      <ChatBot />
    </div>
  );
};

export default Index;
