import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, DollarSign, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_vegetarian: boolean;
  image: string;
}

const Restaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartCounts, setCartCounts] = useState<{ [key: string]: number }>({});
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    fetchRestaurant();
    fetchCartCount();
  }, [id, user]);

  const fetchRestaurant = async () => {
    try {
      const { data: restaurantData, error: restaurantError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();

      if (restaurantError) throw restaurantError;
      setRestaurant(restaurantData);

      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", id)
        .eq("is_available", true);

      if (menuError) throw menuError;
      setMenuItems(menuData || []);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      toast({
        title: "Error",
        description: "Failed to load restaurant details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("menu_item_id, quantity")
        .eq("user_id", user.id);

      if (error) throw error;

      const counts: { [key: string]: number } = {};
      let total = 0;
      data?.forEach((item) => {
        counts[item.menu_item_id] = item.quantity;
        total += item.quantity;
      });
      setCartCounts(counts);
      setCartItemsCount(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateCart = async (menuItemId: string, change: number) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to add items to cart",
      });
      navigate("/auth");
      return;
    }

    const currentCount = cartCounts[menuItemId] || 0;
    const newCount = currentCount + change;

    if (newCount < 0) return;

    try {
      if (newCount === 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("menu_item_id", menuItemId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").upsert(
          {
            user_id: user.id,
            menu_item_id: menuItemId,
            quantity: newCount,
          },
          { onConflict: "user_id,menu_item_id" }
        );

        if (error) throw error;
      }

      setCartCounts((prev) => ({
        ...prev,
        [menuItemId]: newCount,
      }));
      setCartItemsCount((prev) => prev + change);

      toast({
        title: newCount === 0 ? "Removed from cart" : "Cart updated",
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: MenuItem[] });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Restaurant not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} cartItemsCount={cartItemsCount} />

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <div className="relative h-64 rounded-xl overflow-hidden mb-8">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white w-full">
              <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-lg mb-4">{restaurant.description}</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{restaurant.delivery_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Min ₹{restaurant.minimum_order}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items by Category */}
        <div className="space-y-8">
          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            {item.is_vegetarian && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                VEG
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                          <p className="text-xl font-bold text-primary mt-2">₹{item.price}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {cartCounts[item.id] > 0 ? (
                            <div className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg p-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-primary-foreground/20"
                                onClick={() => updateCart(item.id, -1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {cartCounts[item.id]}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 hover:bg-primary-foreground/20"
                                onClick={() => updateCart(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button onClick={() => updateCart(item.id, 1)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Cart Button */}
        {cartItemsCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <Button
              size="lg"
              onClick={() => navigate("/cart")}
              className="shadow-2xl"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              View Cart ({cartItemsCount} items)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
