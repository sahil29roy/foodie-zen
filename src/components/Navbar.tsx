import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IssueReportModal } from "@/components/IssueReportModal";

interface NavbarProps {
  user: any;
  cartItemsCount: number;
}

export const Navbar = ({ user, cartItemsCount }: NavbarProps) => {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out successfully",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FoodExpress
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            {user && (
              <>
                <Link to="/orders" className="text-foreground hover:text-primary transition-colors">
                  My Orders
                </Link>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <IssueReportModal />
              </>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="default">Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <>
                <Link
                  to="/orders"
                  className="block text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="block text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({cartItemsCount})
                </Link>
                <div onClick={() => setMobileMenuOpen(false)}>
                  <IssueReportModal />
                </div>
              </>
            )}
            {user ? (
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
