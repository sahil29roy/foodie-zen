import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("search") as string;
    onSearch(query);
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')] bg-cover bg-center opacity-5" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Order your favorite food{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              in minutes
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Discover the best restaurants and cuisines near you. Fast delivery, great taste!
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="search"
                type="text"
                placeholder="Search for restaurants or cuisines..."
                className="pl-10 h-14 text-base shadow-lg"
              />
            </div>
            <Button type="submit" size="lg" variant="hero" className="h-14 px-8">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            {["Pizza", "Burger", "Sushi", "Indian", "Mexican"].map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => onSearch(cuisine)}
                className="px-4 py-2 rounded-full bg-card hover:bg-accent border border-border transition-colors"
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
