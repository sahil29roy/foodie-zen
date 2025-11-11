import { Link } from "react-router-dom";
import { Star, Clock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
    cuisine: string;
    delivery_time: string;
    minimum_order: number;
  };
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">{restaurant.rating}</span>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {restaurant.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {restaurant.description}
          </p>
          
          <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.delivery_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>Min ₹{restaurant.minimum_order}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <span className="inline-block bg-muted px-3 py-1 rounded-full text-xs font-medium">
              {restaurant.cuisine}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
